import React from 'react'
import axios from 'axios'
import { Ionicons } from '@expo/vector-icons';
import CommentCard from '../components/CommentCard'
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default class Comments extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      loading: false,
      listComments: []
    } 
    this.handleKids = this.handleKids.bind(this)
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitleStyle: { 
        textAlign:"center", 
        left: -30,
        flex:1,
      },
      headerTintColor: 'white',
      headerStyle: {
        backgroundColor: '#ff7043',
      },
      title: navigation.getParam('title', 'Comments'),
    };
  };

  async handleKids(kids, noParent=false) {
    if (kids) {
      const listComments = [], promises = []
      for await (var kid of kids) {
        promises.push(axios.get(`https://hacker-news.firebaseio.com/v0/item/` + kid + `.json`))
      }
      await Promise.all(promises).then(async (list) => {
        for await (var resp of list) {
          if (resp.data.kids) {
            resp.data.listComments = await this.handleKids(resp.data.kids, true)
          }
          listComments.push(resp.data)
          if (listComments.length === kids.length && !noParent) {
            this.setState({
              listComments: [...listComments], loading: false
            })
            return
          }
        }
      })
      return listComments
    }
  }

  componentDidMount() {
    this.setState({ loading: true })
    this.handleKids(this.props.navigation.getParam('kids', null))
  }

  render() {
    const {loading, listComments} = this.state
    const { navigation } = this.props
    const by = navigation.getParam('by', 'error')
    const score = navigation.getParam('score', 'error')
    const title = navigation.getParam('title', 'error')
    const url = navigation.getParam('url', 'error')

    return (
      <View style={styles.container}>
        { loading &&
          <View style={[styles.container, {justifyContent: 'center'} ]}>
            <ActivityIndicator size="large" color="#ff7043" />
          </View>
        }
        { !loading &&
          <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.boxContent}>
            <View>
              <Text style={{color: 'white', fontSize: 14}}>{title}</Text>
            </View>
              <View style={styles.infoContainer}>
                <View>
                  <TouchableOpacity 
                    onPress={() => this.props.navigation.navigate('WebLinks', {url: url})} 
                    style={{flexDirection: "row", flex: 1}}>
                      <Ionicons name="md-link" size={20} color="white" />
                      <Text style={styles.infoText}>Link</Text>
                    </TouchableOpacity>
                </View>
                <View>
                  <Text style={styles.infoText}>{score} points</Text>
                </View>
                <View style={{flexDirection: "row", flex: 1}}> 
                  <Ionicons name="md-person" size={20} color="white" />
                  <Text style={[styles.infoText]}>{by}</Text>
                </View>
              </View>
            </View>
            <View> 
            {
              listComments.map((item) => (
                <CommentCard key={ item.id } item={item} />
              )
            )}
            </View>
          </ScrollView>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222222',
  },
  boxContent: {
    backgroundColor: '#4c4c4c',
    paddingHorizontal: 5,
    paddingVertical: 5,
    flex: 1,
    // flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpContainer: {
    borderLeftWidth: 1,
    marginTop: 15,
    alignSelf: 'stretch',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 7,
  },
  welcomeContainer:{
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },  
  infoContainer: {
    marginTop: 10,
    flex: 1,
    alignItems: 'center',
    flexDirection: "row",
    justifyContent: 'center',

  },
  helpLinkText: {
    textAlign: 'left',
    fontSize: 14,
    color: '#fff',
    flexDirection: "row",
    flex: 1,
  },
  infoText: {
    textAlign: 'left',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 15,
    marginLeft: 4,
    color: 'white',
  },
});
