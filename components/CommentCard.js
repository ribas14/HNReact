import React from 'react'
import HTMLView from 'react-native-htmlview';
import moment from 'moment';
import randomcolor from 'randomcolor'
import { Ionicons } from '@expo/vector-icons';

import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
} from 'react-native';

class CommentCard extends React.Component {

  constructor(props, context) {
    super(props, context);
    
  }
  
  render() {
    const { item, index, handleMore } = this.props
    const color = randomcolor()
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
                  item.listComments.map((child, index) => (
                    <View key={child.id}>
                      <CommentCard 
                        item={child} 
                        index={index} 
                        handleMore={ handleMore }/>
                    </View>
                  )) 
                }
              </View>
            }
          {
            item.listComments &&
            (item.listComments.length < item.kidsCount) && 
            <View>
              <TouchableOpacity 
                onPress={() => handleMore(index) } 
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
