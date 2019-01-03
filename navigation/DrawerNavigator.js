import React from 'react'
import { createDrawerNavigator, createAppContainer, SafeAreaView } from 'react-navigation';
import {  Platform } from "react-native"
import { Icon } from 'native-base';

import BestTabNavigator from './BestTabNavigator';
import TopTabNavigator from './TopTabNavigator';
import NewTabNavigator from './NewTabNavigator';
import CustomDrawerContentComponent from './CustomDrawerContentComponent'

// tamanho do statusbar grande demais
// if (Platform.OS === 'android') {
//   SafeAreaView.setStatusBarHeight(0);
// }

const DrawerNavigator = createDrawerNavigator({
  Best: {
    screen: BestTabNavigator,
    navigationOptions: () =>  {
      return {
        drawerIcon: () => (
          <Icon 
            name="md-trophy"
          />
        )
      }
    }
  },
  Top: {
    screen: TopTabNavigator,
    navigationOptions: () =>  {
      return {
        drawerIcon: () => (
          <Icon 
            name="md-arrow-round-up"
          />
        )
      }
    }
  },
  New: {
    screen: NewTabNavigator,
    navigationOptions: () =>  {
      return {
        drawerIcon: () => (
          <Icon 
            name="md-refresh"
          />
        )
      }
    }
  }
}, {
  contentComponent: CustomDrawerContentComponent, 
  activeTintColor: '#890409',
  initialRouteName: 'Best',
});


// const DrawerNavigator = createDrawerNavigator({
//   Best: {screen: BestTabNavigator},
//   Top: {screen: TopTabNavigator},
//   New: {screen: NewTabNavigator},
// }, {
//   contentComponent: CustomDrawerContentComponent, 
//   headerMode: 'screen',
//   activeTintColor: '#e91e63',
// });

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   containerImage: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

// });

export default createAppContainer(DrawerNavigator);