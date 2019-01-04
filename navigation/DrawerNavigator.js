import React from 'react'
import { createDrawerNavigator, createAppContainer, SafeAreaView } from 'react-navigation';
import {  Platform } from "react-native"
import { Icon } from 'native-base';

import BestTabNavigator from './BestTabNavigator';
import TopTabNavigator from './TopTabNavigator';
import StoriesTabNavigator from './StoriesTabNavigator';
import CustomDrawerContentComponent from './CustomDrawerContentComponent'

// tamanho do statusbar grande demais
// if (Platform.OS === 'android') {
//   SafeAreaView.setStatusBarHeight(0);
// }

const DrawerNavigator = createDrawerNavigator({
  Stories: {
    screen: StoriesTabNavigator,
    navigationOptions: () =>  {
      return {
        drawerIcon: () => (
          <Icon 
            name="md-list"
          />
        )
      }
    }
  },
  Ask: {
    screen: TopTabNavigator,
    navigationOptions: () =>  {
      return {
        drawerIcon: () => (
          <Icon 
            name="md-help"
          />
        )
      }
    }
  },
  Jobs: {
    screen: StoriesTabNavigator,
    navigationOptions: () =>  {
      return {
        drawerIcon: () => (
          <Icon 
            name="md-code-working"
          />
        )
      }
    }
  },
  Settings: {
    screen: StoriesTabNavigator,
    navigationOptions: () =>  {
      return {
        drawerIcon: () => (
          <Icon 
            name="md-settings"
          />
        )
      }
    }
  }
}, {
  contentComponent: CustomDrawerContentComponent, 
  activeTintColor: '#890409',
  initialRouteName: 'Stories',
});

export default createAppContainer(DrawerNavigator);