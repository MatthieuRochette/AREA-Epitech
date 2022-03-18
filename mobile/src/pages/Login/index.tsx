import React, {
  FC, 
  useEffect,
  useState
} from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  TextInput,
  Button,
  Text,
  View,
  ColorPropType,
} from 'react-native';
import { APILogin } from '../../global/result';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { requestLogin } from './api';
import LoginCSS from './styles';
import { authGithub, authTrello } from '../../global/auth';
import WebView from 'react-native-webview';
import Config from 'react-native-config';


interface Props {
  onLogIn: (state: boolean) => void; 
}

const Login: FC<Props> = (props: Props) => {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [disable, setDisable] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<string>();
  const [showTrello, setShowTrello] = useState(false)
  const navigation = useNavigation();

  const onChangeEmail = (email: string) =>
    setEmail(email); 
    
  const onChangePassword = (password: string) =>
    setPassword(password);

  const onContinue = async () =>
    await requestLogin(email!, password!)
      .then((response) => response.json())
      .then(async (data: APILogin) => {
        try {
          await AsyncStorage.setItem('token', data.mobile_token)
          await AsyncStorage.setItem('name', data.name)
          await AsyncStorage.setItem('email', data.email)
          props.onLogIn(true)
        } catch (e) { throw e }
      }).catch((error: Error) => {
        setModalContent(error.toString())
        setModalVisible(true);
      });
  
  const onSignUp = () =>
    navigation.navigate('SignUp')

  const onGithub = async () =>
    await authGithub()
      .then((response) => response.json())
      .then(async (data: APILogin) => {
        try {
          await AsyncStorage.setItem('token', data.mobile_token)
          await AsyncStorage.setItem('name', data.name)
          await AsyncStorage.setItem('email', data.email)
          props.onLogIn(true)
        } catch (e) { throw e }
      }).catch((error: Error) => {
        setModalContent(error.toString())
        setModalVisible(true)
      })

  const onTrello = () => {
    setShowTrello(true)
  }

  const validate = () => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!email  || !re.test(email))
      return false;
    if (!password)
      return false;
    return true;
  }

  useEffect(() => {
    if (validate())
      setDisable(false);
    else
      setDisable(true);
  }, [email, password]);

  return (
    <>
      {
        showTrello ?
        <WebView
          source={{ uri: `https://trello.com/1/authorize?scope=read,write,account&expiration=never&name=area&key=${Config.TRELLO_CLIENT}&return_url=https://www.google.com` }}
          onNavigationStateChange={async (navState) => {
            if (navState.url.substr(0, navState.url.indexOf('#')) === 'https://www.google.com/' && navState.url.split('=')[2]) {
              setModalContent('Trello connexion Rejected')
              setModalVisible(true)
              setShowTrello(false)
            } else if (navState.url.substr(0, navState.url.indexOf('#')) === 'https://www.google.com/') {
              await authTrello(navState.url.split('=')[1])
              .then((response) => response.json())
              .then(async (data: APILogin) => {
                await AsyncStorage.setItem('token', data.mobile_token)
                await AsyncStorage.setItem('name', data.name)
                await AsyncStorage.setItem('email', data.email)
                props.onLogIn(true)
              }).catch((error: Error) => {
                setModalContent(error.toString())
                setModalVisible(true)
                setShowTrello(false)
              })
            }
          }}
        />
        :
        <>
          <Text style={LoginCSS.title}>
            Welcome on AREA Tirer
          </Text>
          
          <TextInput
              style={LoginCSS.emailInput}
              value={email}
              placeholder="Email Address"
              onChangeText={onChangeEmail}
              autoCompleteType="email" />
          <TextInput
              style={LoginCSS.passwordInput}
              value={password}
              placeholder="Password"
              onChangeText={onChangePassword}
              autoCompleteType="password"
              secureTextEntry={true} />
            
          <View style={LoginCSS.continueButton}>
            <Button
              title="CONTINUE"
              disabled={disable}
              onPress={onContinue} />
          </View>
          
          <View style={LoginCSS.alternativeLogins}>
            <View style={LoginCSS.githubButton}>
              <Button
                title="GITHUB"
                onPress={onGithub} />
            </View>

            <View style={LoginCSS.trelloButton}>
              <Button
                title="TRELLO"
                onPress={onTrello} />
            </View>
          </View>
          
          <View style={LoginCSS.signUpButton}>
            <Button
              title="SIGN UP"
              onPress={onSignUp} />
          </View>
          
          <Text style={LoginCSS.copyright}>
            © 2021 AREA
          </Text>
          
          <View>
            <Modal
              isVisible={modalVisible}
              onBackdropPress={() => setModalVisible(false)}
              onBackButtonPress={() => setModalVisible(false)}
            >
              <View style={LoginCSS.modal}>
                <Text>{modalContent}</Text>
              </View>
            </Modal>
          </View>
        </>
      }
    </>
  );
};

export default Login;