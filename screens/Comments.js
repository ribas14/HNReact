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

const PAGE_ITEMS = 2
const URL_COMMENTS = `https://hacker-news.firebaseio.com/v0/item/`

export default class Comments extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      loading: false,
      listComments: []
    } 
    this._handleKids = this._handleKids.bind(this)
    this._breakChunks = this._breakChunks.bind(this)
    this._handleMoreComments = this._handleMoreComments.bind(this)

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

  async _handleKids(kids, allComments=false) {
    const that = this
    if (kids) {
      const listComments = [], promises = []
      for await (var kid of kids) {
        promises.push(axios.get(URL_COMMENTS + kid + `.json`))
      }
      await Promise.all(promises).then(async (list) => {
        for await (var resp of list) {
          if (resp.data.kids ) {
            resp.data.kids = that._breakChunks(resp.data.kids, allComments)
            resp.data.kidsCount = resp.data.kids.length
            resp.data.listComments = await this._handleKids(resp.data.kids[0])
          }
          listComments.push(resp.data)
        }
      })
      return listComments
    }
  }

  async _handleMoreComments(index) {
    let oldList = this.state.listComments
    oldList[index].listComments = []
    for await (var kid of this.state.listComments[index].kids) {
      let listComments = await this._handleKids(kid, true)
      oldList[index].listComments.push(listComments)
    }
    console.log(oldList)
  }

  _breakChunks(data, allComments=false) {
    if (data) {
      let arrays = []
      let size = allComments ? data.length - 1 : PAGE_ITEMS
      while (data.length > 0)
        arrays.push(data.splice(0, size))
        this.setState({
          arrays
        })
      return arrays
      }
  }

  async componentDidMount() {
    this.setState({ loading: true })
    if (this.props.navigation.getParam('kids', null)) {
      let kids = this._breakChunks(this.props.navigation.getParam('kids', null))
      let listComments = await this._handleKids(kids[0])
      this.setState({
        listComments: [...listComments], loading: false
      })
    }
  }

  render() {
    const _this = this
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
              listComments.map((item, index) => (
                <CommentCard 
                  key={ item.id } 
                  item={item} 
                  index={index} 
                  handleMore={ _this._handleMoreComments }/>
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
