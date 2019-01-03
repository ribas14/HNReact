import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import Comments from '../screens/Comments';
import WebLinks from '../screens/WebLinks';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';

const HomeStack = createStackNavigator({
  Top: HomeScreen,
  Comments: Comments,
  WebLinks: WebLinks,
});

HomeStack.navigationOptions = {
  tabBarOptions: {
    inactiveTintColor: '#ececec',
    labelStyle: {
      fontSize: 12,
    },
    style: {
      backgroundColor: '#3c3c3c',
    },
  },
  tabBarLabel: 'New',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? 'ios-list'
          : 'md-list'
      }
    />
  ),
};

const LinksStack = createStackNavigator({
  Links: LinksScreen,
});

LinksStack.navigationOptions = {
  tabBarOptions: {
    inactiveTintColor: '#ececec',
    labelStyle: {
      fontSize: 12,
    },
    style: {
      backgroundColor: '#3c3c3c',
    },
  },
  tabBarLabel: 'Ask',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-help' : 'md-help'}
    />
  ),
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});

SettingsStack.navigationOptions = {
  tabBarOptions: {
    inactiveTintColor: '#ececec',
    labelStyle: {
      fontSize: 12,
    },
    style: {
      backgroundColor: '#3c3c3c',
    },
  },
  tabBarLabel: 'Jobs',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-code-working' : 'md-code-working'}
    />
  ),
};

export default HomeStack;
