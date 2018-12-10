import React from 'react'
import axios from 'axios'
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

import {
  ActivityIndicator,
  Platform,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';  

import {Icon} from 'native-base';

const PAGE_ITEMS = 20
const URL_ITEM = 'https://hacker-news.firebaseio.com/v0/item/'
const URL_STORIES = `https://hacker-news.firebaseio.com/v0/`

export default class HomeScreen extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      loading: false,
      listNew: [],
      listFilter: [],
      pageCount: 0,
      arrays: [],
      queryStories: 'best',
    }, 
    this._breakChunks = this._breakChunks.bind(this)
    this._getInitalStories = this._getInitalStories.bind(this)
    this._handleMenuClick = this._handleMenuClick.bind(this)
  }
  
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitleStyle: { 
        textAlign:"center", 
        left: 0,
        flex:1,
      },
      headerTintColor: 'white',
      headerStyle: {
        backgroundColor: '#ff7043',
      },
      title: navigation.state.params ? navigation.state.params.title.charAt(0).toUpperCase() + navigation.state.params.title.slice(1) : 'Best',
      headerLeft: 
        <View style={{paddingLeft:16}}>
          <Icon style={{color: '#fff'}} onPress={() => navigation.toggleDrawer()} name="md-menu"/>
        </View>,

      headerRight: 
      <View style={{paddingRight: 20}}>
        <Menu>
            <MenuTrigger>
              <Icon style={{color: '#fff'}} name="md-more"/>
            </MenuTrigger>
            <MenuOptions style={{backgroundColor: '#222222'}}>
              <MenuOption style={{alignItems: 'center'}} onSelect={() => navigation.state.params.handleClick('new')}>
                <Text style={styles.textMenu} >New Stories</Text>
              </MenuOption>
              <MenuOption style={{alignItems: 'center'}} onSelect={() => navigation.state.params.handleClick('best')}>
                <Text style={styles.textMenu} >Best Stories</Text>
              </MenuOption>
              <MenuOption style={{alignItems: 'center'}} onSelect={() => navigation.state.params.handleClick('top')}>
                <Text style={styles.textMenu} >Top Stories</Text>
              </MenuOption>

            </MenuOptions>
          </Menu>
      </View>
    };
  };

  _breakChunks(data) {
    if (data) {
      let arrays = [], size = PAGE_ITEMS
      while (data.length > 0)
        arrays.push(data.splice(0, size))
        this.setState({
          arrays
        })
      return arrays
      }
  }

  _getStories(list) {
      let l = this.state.listNew || []
      let count = 0
      list.forEach(item => {
        axios.get(URL_ITEM + item + `.json`)
        .then(res => { 
          count += 1
          l.push(res.data)
          if (list.length === count) {
            this.setState({
              listNew: l, 
              loading: false, 
              listFilter: l,
              pageCount: this.state.pageCount + 1
            })
          }
        })
        .catch(error => {
          console.warn(error)
        });
      })
  }

  _handleComments(item) {
    if (item.kids) {
      this.props.navigation.navigate('Comments', {
        kids: item.kids,
        title:  item.title,
        score: item.score,
        by: item.by,
        url: item.url
      })
    }
  }

 _handleMenuClick(queryStories) {
    this.setState({ queryStories: queryStories }, () => {
      this._getInitalStories()
    })
  }
  
  async _getInitalStories() {
    await this.props.navigation.setParams({ title: this.state.queryStories })
    this.setState({ loading: true, listNew: []})
    axios.get(URL_STORIES + this.state.queryStories + `stories.json`)
    .then(res => {
      let data = res.data;
      const arrays = this._breakChunks(data);
      this.setState({ arrays })
      this._getStories(this.state.arrays[0])
    })
    .catch(error => {
      console.warn(error)
    });
  }
  componentDidMount() {
    this.props.navigation.setParams({ handleClick: this._handleMenuClick.bind(this), title: this.state.queryStories });
    this._getInitalStories() 
  }

  render() {
    const { listFilter, loading, pageCount, arrays } = this.state

    return (
      <View style={styles.container}>
        { loading &&
          <View style={[styles.container, {justifyContent: 'center'} ]}>
            <ActivityIndicator size="large" color="#ff7043" />
          </View>
        }
        { !loading &&
          <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.welcomeContainer}> 
            {
              listFilter.map((item) => (
                <View key={ item.id } style={styles.helpContainer}>
                  <TouchableOpacity onPress={() => this._handleComments(item)} style={styles.helpLink}>
                    <TouchableOpacity 
                      onPress={() => this.props.navigation.navigate('WebLinks', {url: item.url})}
                      style={[styles.helpLink, {flexDirection: 'row'}]}>
                      <Text style={styles.helpLinkText}>{item.title}  <Ionicons name="md-link" size={20} color="white" style={{paddingLeft: 5}} />
                      </Text>
                    </TouchableOpacity>
                    <View style={styles.infoContainer}>
                      <TouchableOpacity onPress={() => this._handleComments(item)} style={styles.helpLink}>
                        <Text style={[styles.infoText, {fontWeight: 'bold', color: 'white'}]}> {item.kids ? item.kids.length : 'no'} comments</Text>
                      </TouchableOpacity>                  
                      <Text style={styles.infoText}>{item.score} points</Text>
                      <Text style={styles.infoText}>by {item.by}</Text>
                      <Text style={styles.infoText}>{moment.unix(item.time).fromNow()}</Text>
                    </View>
                  </TouchableOpacity>                  
                </View>
              )
            )}
            </View>
            <View>
              <Button
                color='#ff7043'
                title= 'More'
                onPress={() => this._getStories(arrays[pageCount])} />            
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
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 0,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    borderLeftColor: '#ff7043',
    borderLeftWidth: 1,
    marginTop: 15,
    alignSelf: 'stretch',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 7,
  },
  infoContainer: {
    marginTop: 10,
    flex: 1,
    alignItems: 'center',
    flexDirection: "row"

  },
  helpLinkText: {
    textAlign: 'left',
    fontSize: 14,
    color: '#fff',
  },
  infoText: {
    textAlign: 'left',
    fontSize: 12,
    marginRight: 15,
    color: 'grey',
  },
  textMenu: {
    color: 'white',
    fontSize: 14,
    paddingVertical: 10
  }
});
