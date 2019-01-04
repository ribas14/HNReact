import React from 'react'
import { DrawerItems, SafeAreaView } from 'react-navigation';

import { 
  StyleSheet, 
  ScrollView, 
  View, 
  Image, 
  Text,  
} from 'react-native';


class CustomDrawerContentComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <ScrollView style={{flex: 1, marginTop: 20}}> 
          <View style={styles.containerImage}>
            <Image  
              style={{
                alignSelf: 'center',
                width: '100%',
                height: '100%',
                borderRadius: 10,
              }}
              resizeMode="contain"
              source={{uri: 'https://is1-ssl.mzstatic.com/image/thumb/Purple49/v4/64/29/8b/64298bad-2aef-bcd5-d0cf-6dad0e520d91/AppIcon.png/320x0w.png'}} 
            />
          </View>          
  
          <SafeAreaView style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
            <DrawerItems 
              {...this.props} 
            />
          </SafeAreaView>
        </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerImage: {
    height: 100,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonView: {
    marginLeft: 8,
    marginTop: 5,
    flexDirection: 'row'
  }
});

export default CustomDrawerContentComponent; 
