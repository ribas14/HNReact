import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import Comments from '../screens/Comments';
import WebLinks from '../screens/WebLinks';

const NewStack = createStackNavigator({
  New: HomeScreen,
  Comments: Comments,
  WebLinks: WebLinks,
});

NewStack.navigationOptions = {
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
          ? 'ios-refresh'
          : 'md-refresh'
      }
    />
  ),
};

const BestStack = createStackNavigator({
  Best: HomeScreen,
  Comments: { screen: Comments},
  WebLinks: WebLinks,
});

BestStack.navigationOptions = {
  tabBarOptions: {
    inactiveTintColor: '#ececec',
    labelStyle: {
      fontSize: 12,
    },
    style: {
      backgroundColor: '#3c3c3c',
    },
  },
  tabBarLabel: 'Best',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? 'ios-trophy'
          : 'md-trophy'
      }
    />
  ),
};

const TopStack = createStackNavigator({
  Top: HomeScreen,
  Comments: Comments,
  WebLinks: WebLinks,
});

TopStack.navigationOptions = {
  tabBarOptions: {
    inactiveTintColor: '#ececec',
    labelStyle: {
      fontSize: 12,
    },
    style: {
      backgroundColor: '#3c3c3c',
    },
  },
  tabBarLabel: 'Top',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? 'ios-arrow-round-up'
          : 'md-arrow-round-up'
      }
    />
  ),
};


export default createBottomTabNavigator({
  BestStack,
  NewStack,
  TopStack,
}, {
  initialRouteName: 'BestStack',
});
