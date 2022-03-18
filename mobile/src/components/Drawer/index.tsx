import React, {
  FC,
  useEffect,
  useState
} from 'react';
import { View } from 'react-native';
import {
  Drawer,
  Title,
  Caption,
  Avatar,
} from 'react-native-paper';
import {
  DrawerContentScrollView,
  DrawerItem
} from '@react-navigation/drawer';
import RNRestart from 'react-native-restart';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DrawerCSS from './styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const DrawerContent: FC = (props: any) => {
  const [name, setName] = useState<string>();
  const [email, setEmail] = useState<string>();

  const onHome = () =>
    props.navigation.navigate('Home')

  const onSettings = () =>
    props.navigation.navigate('Settings')

  const onSignOut = async () => {
    try {
      await AsyncStorage.removeItem('token')
      await AsyncStorage.removeItem('github')
      await AsyncStorage.removeItem('trello')
      RNRestart.Restart();
    } catch (e) { console.error(e) }
  }

  useEffect(() => {
      (async () => {
        try {
          const retrievedName = await AsyncStorage.getItem('name')
          if (retrievedName === null) throw new Error('Name not found')
          setName(retrievedName!)

          const retrievedEmail = await AsyncStorage.getItem('email')
          if (retrievedEmail === null) throw new Error('Email not found')
          setEmail(retrievedEmail!)
        } catch (e) {console.error(e)}
      })()
    }, [])

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={DrawerCSS.drawerContent}>
          <View style={DrawerCSS.userInfoSection}>
            <Avatar.Text label={name && name.match(/(\s|^)([a-z])/gi).join('')}/>
              
            <Title style={DrawerCSS.name}>{name}</Title>

            <Caption style={DrawerCSS.email}>{email}</Caption>
          </View>
          
          <Drawer.Section style={DrawerCSS.drawerSection}>
            <DrawerItem
              icon={({color, size}) => (
                  <Icon 
                    name='home-outline' 
                    color={color}
                    size={size}
                  />
              )}
              label='Home'
              onPress={onHome}
            />
          </Drawer.Section>
        </View>
      </DrawerContentScrollView>
      <Drawer.Section
        style={DrawerCSS.bottomDrawerSection} >
          <DrawerItem
            icon={({color, size}) => (
              <Icon 
                name='cog' 
                color={color}
                size={size}
              />
            )}
            label='Settings'
            onPress={onSettings}
          />

          <DrawerItem
            icon={({color, size}) => (
              <Icon 
                name='exit-to-app' 
                color={color}
                size={size}
              />
            )}
            label='Sign Out'
            onPress={onSignOut}
          />
      </Drawer.Section>
    </View>
  );
}

export default DrawerContent;