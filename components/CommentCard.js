import React from 'react'
import HTMLView from 'react-native-htmlview';
import axios from 'axios'
import moment from 'moment';
import randomcolor from 'randomcolor'
import { Ionicons } from '@expo/vector-icons';

const URL_COMMENTS = `https://hacker-news.firebaseio.com/v0/item/`
const PAGE_ITEMS = 4

import {
  ActivityIndicator,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
} from 'react-native';

class CommentCard extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      loading: false,
      item: this.props.item,
      color: randomcolor()
    } 
    this._handleKids = this._handleKids.bind(this)
    this._breakChunks = this._breakChunks.bind(this)
    this._handleMoreComments = this._handleMoreComments.bind(this)
  }

  _breakChunks(data, allComments=null) {
    if (data) {
      let arrays = []
      let size = allComments ? allComments : PAGE_ITEMS
      while (data.length > 0) {
        arrays.push(data.splice(0, size))
      }
      return arrays
    }
  }

  async _handleKids(kids, allComments=0) {
    if (kids) {
      const that = this
      const listComments = [], promises = []
      for await (var kid of kids) {
        promises.push(axios.get(URL_COMMENTS + kid + `.json`))
      }
      await Promise.all(promises).then(async (list) => {
        for await (var resp of list) {
          if (resp.data.kids) {
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
  
  async _handleMoreComments() {
    this.setState({
      loading: true
    })
    let i = this.state.item
    i.listComments = []
    for await (var kid of i.kids) {
      let listComments = await this._handleKids(kid, 20)
      for 
      i.listComments.push(listComments[0])
    }
    this.setState({
      item: i, loading: false
    })
  }

  render() {
    const { item, loading, color } = this.state
    const more = item.listComments && (item.listComments.length < item.kidsCount) ? { borderBottomColor: color, borderBottomWidth: 2 } : null

    return (
      <View>
        { item.text &&
          <View style={[styles.helpContainer, { borderLeftColor:color }, more ]}>
            <View style={{flexDirection: "row", flex: 1}}>
              <Text style={[styles.infoText, {fontSize: 11}]}>{item.by}</Text>
              <Text style={[styles.infoText, {fontSize: 10}]}>{moment.unix(item.time).fromNow()}</Text>
            </View>
            <View style={{ marginTop: 3 }}>
              <HTMLView
                value={'<p>' + item.text}
                stylesheet={styles}
              />
          </View>
          <View>
            { 
              item.listComments &&
              <View>
                {
                  item.listComments.map((child) => (
                    <CommentCard 
                      key={child.id}
                      item={child} 
                      index={child.id} 
                    />
                  )) 
                }
              </View>
            }
            { loading &&
              <View style={[styles.container, {justifyContent: 'center'} ]}>
                <ActivityIndicator size="large" color="#ff7043" />
              </View>
            }
            {
              !loading &&
              item.listComments &&
              (item.listComments.length < item.kidsCount) && 
              <View>
                <TouchableOpacity 
                  onPress={() => this._handleMoreComments() } 
                  style={{flexDirection: "row", flex: 1, justifyContent: 'center', paddingTop: 10}}>
                    <Ionicons name="md-add" size={20} color="white" />
                    <Text style={styles.infoText}>More</Text>
                </TouchableOpacity>
              </View>
            }
          </View>
        </View>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  helpContainer: {
    borderLeftWidth: 2,
    marginTop: 15,
    alignSelf: 'stretch',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 7,
  },
  infoText: {
    textAlign: 'left',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 15,
    marginLeft: 4,
    color: 'white',
  },
  p: {
    color: 'white'
  }
});


export default CommentCard
