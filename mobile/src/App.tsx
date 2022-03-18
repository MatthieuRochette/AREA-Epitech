import React, {
  useEffect,
  useState
} from 'react';
import {} from 'react-native';
import 'react-native-gesture-handler';
import Splash from './pages/Splash';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Services from './pages/Services';
import Actions from './pages/Actions';
import Settings from './pages/Settings';
import SetURL from './pages/SetURL';
import DrawerContent from './components/Drawer';
// import TopBarContent from './components/TopBar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const TopTab = createMaterialTopTabNavigator();

const SplashScreen = () => (<Splash />)
const SignUpScreen = () => (<SignUp />)
const ServiceScreen = () => (<Services />)
const ActionsScreen = () => (<Actions />)
const SettingsScreen = () => (<Settings />)

const AreaMobile = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState(false)
  const LoginScreen = () => (<Login onLogIn={(state) => setLoggedIn(state)} />)
  const SetURLScreen = () => (<SetURL onUrl={(state) => setUrl(state)} />)

  useEffect(() => {
    (async () => {
      try {
        if (await AsyncStorage.getItem('token') === null) throw new Error('No token found');
        setLoggedIn(true)
      } catch (e) { console.log(e) }
      setLoading(false)
    })()
  }, [])

  return (
    <>
      <NavigationContainer>
        {
          !url ?
          <Stack.Navigator initialRouteName="SetURL">
            <Stack.Screen 
              name="SetURL"
              component={SetURLScreen}
              options={{
                headerShown: false,
                animationTypeForReplace: 'push'
              }}
            />
          </Stack.Navigator>

          : loading ?
          // Placeholder Navigator
          <Stack.Navigator initialRouteName="SplashScreen">
            <Stack.Screen
              name="SplashScreen"
              component={SplashScreen}
              options={{ headerShown: false }} />
          </Stack.Navigator>

          : !loggedIn ?
          // Authentification Navigator
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{
                headerShown: false,
                animationTypeForReplace: !loggedIn ? 'pop' : 'push'
              }} />

            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{ headerShown: false }} />
          </Stack.Navigator>

          :
          // Main Navigator
          <Drawer.Navigator
            drawerContent={(props) => (<DrawerContent {...props} />)}
            initialRouteName="Home" >
            <Drawer.Screen name="Home">
              {() => (
                <TopTab.Navigator
                // TODO Custom TopBar
                //tabBar={(props) => (<TopBarContent {...props} />)}
                  initialRouteName="Services"
                  backBehavior="none">
                  <TopTab.Screen 
                    name="Services"
                    component={ServiceScreen} />

                  <TopTab.Screen
                    name="Actions"  
                    component={ActionsScreen} />
                </TopTab.Navigator>
              )}
            </Drawer.Screen>
              
            <Drawer.Screen
              name="Settings"
              component={SettingsScreen} />
          </Drawer.Navigator>
        } 
      </NavigationContainer>
    </>
  );
}

export default AreaMobile;
