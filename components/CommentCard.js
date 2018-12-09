import React from 'react'
import HTMLView from 'react-native-htmlview';
import randomcolor from 'randomcolor'
import moment from 'moment';

import {
  Text,
  View,
  StyleSheet,
} from 'react-native';

const CommentCard = props => {
  const { item } = props
  return (
    <View>
      { item.text &&
        <View style={[styles.helpContainer, { borderLeftColor: randomcolor()}]}>
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
                  <CommentCard key={child.id} item={child}/>
                )) 
              }
            </View>
          }
        </View>
      </View>
      }
    </View>
  )
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
