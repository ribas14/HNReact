import React from 'react'
import { createDrawerNavigator, createAppContainer } from 'react-navigation';
import { DrawerItems, SafeAreaView } from 'react-navigation';
import { StyleSheet, ScrollView, View, Image } from 'react-native';
import BestTabNavigator from './BestTabNavigator';
import TopTabNavigator from './TopTabNavigator';
import NewTabNavigator from './NewTabNavigator';

const CustomDrawerContentComponent = (props) => (
  <ScrollView>
      <View style={styles.containerImage}>
      <Image  
        style={{
            alignSelf: 'center',
            height: 150,
            width: '100%',
            marginTop: 10,
            borderWidth: 1,
            borderRadius: 75
          }}
          resizeMode="stretch"
          source={{uri: '../assets/images/logo_hn.jpg' }} 
        />
      </View>
    <SafeAreaView style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
      <DrawerItems {...props} />
    </SafeAreaView>
  </ScrollView>
);

const DrawerNavigator = createDrawerNavigator({
  Best: {screen: BestTabNavigator},
  Top: {screen: TopTabNavigator},
  New: {screen: NewTabNavigator},
}, {
  contentComponent: CustomDrawerContentComponent, 
  headerMode: 'screen',
  activeTintColor: '#e91e63',
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerImage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

});

export default createAppContainer(DrawerNavigator);