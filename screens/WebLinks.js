import React from 'react'
import {
  WebView,
} from 'react-native';

export default class WebLinks extends React.Component {
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
      title: navigation.getParam('url', 'error'),
    };
  };

  render() {
    const { navigation  } = this.props
    const url = navigation.getParam('url', 'error')
    return (
      <WebView
        source={{uri: url}}
        style={{marginTop: 20}}
      />
    );
  }
}
