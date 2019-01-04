import React from 'react'
import axios from 'axios'
import fetch from 'react-native-fetch-polyfill'
import moment from 'moment';
import { view } from 'react-easy-state'

import { Ionicons } from '@expo/vector-icons';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import settings from '../store/themeStore'
import history from '../store/historyStore'

import {
  RefreshControl,
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  Button,
  Image,
  TouchableOpacity,
  View,
} from 'react-native';  

import { Icon } from 'native-base';

const PAGE_ITEMS = 10
const URL_ITEM = 'https://hacker-news.firebaseio.com/v0/item/'
const URL_STORIES = `https://hacker-news.firebaseio.com/v0/`


const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  return layoutMeasurement.height + contentOffset.y >=
    contentSize.height
};

const changeThemeColor = (color) => {
  settings.changeThemeColor(color)
}

class HomeScreen extends React.Component {
  _isMounted = false;

  constructor(props, context) {
    super(props, context);
    this.state = {
      loading: false,
      listNew: null,
      listFilter: [],
      pageCount: 0,
      arrays: [],
      loadingMoreStories: false,
      finishLoading: true,
    }, 
    this._breakChunks = this._breakChunks.bind(this)
    this._getInitalStories = this._getInitalStories.bind(this)
    this._onRefresh = this._onRefresh.bind(this)
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
      title: navigation.state.routeName,
      headerLeft: 
        <View style={{paddingLeft:16}}>
          <Icon style={{color: '#fff'}} onPress={() => navigation.toggleDrawer()} name="md-menu"/>
        </View>,

      headerRight: 
      <View style={{paddingRight: 20}}>
        <Menu>
            <MenuTrigger
              customStyles={{
                triggerTouchable: {
                  hitSlop: { top: 50, bottom: 50, left: 50, right: 50 }
                }
              }}>
              <Icon 
                style={{color: '#fff'}} 
                name="md-more"
              />
            </MenuTrigger>
            <MenuOptions style={{backgroundColor: '#222222'}}>
              <MenuOption style={{alignItems: 'center'}} onSelect={() => changeThemeColor('#fff')}>
                <Text style={styles.textMenu} >Light Theme</Text>
              </MenuOption>
              <MenuOption style={{alignItems: 'center'}} onSelect={() => changeThemeColor('#222222')}>
                <Text style={styles.textMenu} >Dark Theme</Text>
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
        if (this._isMounted) {
          this.setState({
            arrays
          })
        }
        return arrays
      }
  }


  _checkImage(img) {
    for (i = 0; 10 > i;) {
      if (
          img &&
          img[i] && 
          img[i].includes('http') &&
          !img[i].includes('logo') &&
          !img[i].includes('svg')
         ) {
          return img[1]
          i++           
         } else {
          return null
        }
    }
  }

  async _getImage(res) {
    const re = '<img[^>]+src="([^">]+)"'
    let response = await fetch(res.data.url, {timeout: 3 * 1000})
    let data = await response.text()
    let img = await data.match(re)
    return this._checkImage(img)
  }

  async _getStories(list) {
    if(this.state.finishLoading) {
      if (this._isMounted) {
        this.setState({
          loadingMoreStories: !this.state.loadingMoreStories,
          finishLoading: false,
        })
      }

      l = this.state.listNew || []
      let count = 0
      if(!list){
        list = this.state.arrays[0]
      }
      for (var item of list) {
        axios.get(URL_ITEM + item + `.json`)
        .then(async res => {
          if (res.data.url && !res.data.url.includes('pdf')) {
            this._getImage(res)
            .then(img => {
              res.data.img = img
            })
            .catch((error) => {
              console.log(error);
            })
          }
          count += 1
          l.push(res.data)
          if (list.length === count && this._isMounted) {
            this.setState({
              loadingMoreStories: !this.state.loadingMoreStories,
              listNew: l, 
              listFilter: l,
              pageCount: this.state.pageCount + 1,
              finishLoading: true
            })
          } else if (l.length > 3 && this._isMounted){
            this.setState({
              loadingMoreStories: true,
              listNew: l, 
              loading: false, 
              listFilter: l,
            })
          }
        })
      }
    }
  }

  _handleComments(item) {
    if (item.kids) {
      this.props.navigation.navigate('Comments', {
        kids: item.kids,
        title: item.title,
        score: item.score,
        by: item.by,
        url: item.url,
        image: item.img ? item.img : null
      })
    }
  }

  async _onRefresh() {
    if (this._isMounted) {
      this.setState({
        loading: true,
        listNew: null,
        listFilter: [],
        pageCount: 0,
        arrays: [],
        loadingMoreStories: false,
        finishLoading: true,
      },
      this._getInitalStories
      )
    }
  }

  async _getInitalStories() {
    if (this._isMounted) {
      axios.get(URL_STORIES + this.props.navigation.state.routeName.toLowerCase() + `stories.json`)
      .then(res => {
        let data = res.data;
        const arrays = this._breakChunks(data);
        if (this._isMounted) {
          this.setState({ arrays },
            this._getStories
          )
        }
      }) 
      .catch(error => { 
        console.warn(error)
      });
    }
  }
  
  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidMount() {
    this.props.navigation.addListener('didFocus', (payload) => {
      if((history.getLastPage == 'Best') || (history.getLastPage == 'New') || (history.getLastPage == 'Top')) {
        this._onRefresh();
        history.addHistory(this.props.navigation.state.routeName)
      } else {
        history.addHistory(this.props.navigation.state.routeName)
      }
    })
    this._isMounted = true;
    this._onRefresh() 
  }

  render() {
    const { listFilter, loading, pageCount, arrays, loadingMoreStories } = this.state

    return (
      <View style={[styles.container, {backgroundColor: settings.getThemeColor}]}>
        { loading &&
          <View style={[styles.container, {justifyContent: 'center'} ]}>
            <ActivityIndicator size="large" color="#ff7043" />
          </View>
        }
        { !loading &&
          <ScrollView
            onScroll={({nativeEvent}) => {
              if (isCloseToBottom(nativeEvent)) {
                this._getStories(arrays[pageCount])
              }
            }}
            scrollEventThrottle={400}
            showsVerticalScrollIndicator={true}
            refreshControl={
              <RefreshControl
                refreshing={this.state.loading}
                onRefresh={this._onRefresh}
              />
            }
            style={styles.container} 
            contentContainerStyle={styles.contentContainer}
            onRefresh={this._onRefresh}>
            <View style={styles.welcomeContainer}> 
            {
              listFilter.map((item, index) => (
                <View key={ index } style={styles.helpContainer}>
                  {
                    item.img &&
                    <View style={{ marginBottom: 5 }}>
                      <TouchableOpacity 
                        delayPressIn={50}
                        onPress={() => this.props.navigation.navigate('WebLinks', {url: item.url})}
                        style={[styles.helpLink, {flexDirection: 'row'}]}>
                        <Image
                          resizeMode='cover'
                          onError={(e) => { this.props.source = { uri: 'https://example.domain.com/no-photo.png' }}}
                          style={{ width: '100%', height: 200 }}
                          source={{uri:item.img}}
                        />
                      </TouchableOpacity>
                    </View>
                  }
                  <TouchableOpacity 
                    delayPressIn={50}
                    onPress={() => this._handleComments(item)} 
                    style={styles.helpLink}
                    hitSlop={{top: 50, bottom: 50, left: 50, right: 50}}>
                    <TouchableOpacity 
                      delayPressIn={50}
                      onPress={() => this.props.navigation.navigate('WebLinks', {url: item.url})}
                      style={[styles.helpLink, {flexDirection: 'row'}]}>
                      <Text style={styles.helpLinkText}>{item.title}  <Ionicons name="md-link" size={20} color="white" style={{paddingLeft: 5}} />
                      </Text>
                    </TouchableOpacity>
                    <View style={styles.infoContainer}>
                      <TouchableOpacity 
                        delayPressIn={50}
                        onPress={() => this._handleComments(item)} 
                        style={styles.helpLink} 
                        hitSlop={{top: 50, bottom: 50, left: 50, right: 50}}>
                        <Text style={[styles.infoText, {fontWeight: 'bold', color: 'white'}]}> {item.descendants ? item.descendants : 'no'} comments</Text>
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
              {
                loadingMoreStories && 
                <ActivityIndicator size="large" color="#ff7043" />
              }
              {
                !loadingMoreStories && 
                <Button
                color='#ff7043'
                title= 'More'
                onPress={() => this._getStories(arrays[pageCount])} />  
              }
              </View>
          </ScrollView>
        }
      </View>
    );
  }
}

export default view(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
