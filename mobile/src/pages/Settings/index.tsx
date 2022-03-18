import { deleteJob } from '../../global/utils';
import React, { FC, useEffect, useState } from 'react';
import { View } from 'react-native';
import RNRestart from 'react-native-restart';
import { authGithub, authTrello, GithubData, TrelloData } from '../../global/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Avatar, Title, Button as IconButton } from 'react-native-paper';
import Config from 'react-native-config';
import WebView from 'react-native-webview';
import SettingsCSS from './styles';

const Settings: FC = () => {
  const [githubData, setGithubData] = useState<GithubData>()
  const [githubLogged, setGithubLogged] = useState(false)
  const [trelloData, setTrelloData] = useState<TrelloData>()
  const [trelloLogged, setTrelloLogged] = useState(false)
  const [showTrello, setShowTrello] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        const github = await AsyncStorage.getItem('github')
        if (!github) throw new Error('No github data found')
        setGithubData(JSON.parse(github))
        setGithubLogged(true)
      } catch {(e: Error) => console.log(e)}
      try {
        const trello = await AsyncStorage.getItem('trello')
        if (!trello) throw new Error('No trello data found')
        setTrelloData(JSON.parse(trello))
        setTrelloLogged(true)
      } catch {(e: Error) => console.log(e)}
    })()
  },[])
  
  const onGithub = async () => {
    try {
      await authGithub().catch((e) => {throw e})
      const github = await AsyncStorage.getItem('github')
      if (!github) throw new Error('No github data found')
      setGithubData(JSON.parse(github))
      setGithubLogged(true)
    } catch {(e) => console.error(e)}
  }

  const onSignOut = async (type: string) => {
    try {
      await AsyncStorage.removeItem(type)
    } catch (e) { console.error(e) }
  }

  return (
    <View style={{flex: 1}}>
      {
        showTrello ?
        <WebView
          source={{ uri: `https://trello.com/1/authorize?scope=read,write,account&expiration=never&name=area&key=${Config.TRELLO_CLIENT}&return_url=https://www.google.com` }}
          onNavigationStateChange={async (navState) => {
            if (navState.url.substr(0, navState.url.indexOf('#')) === 'https://www.google.com/' && navState.url.split('=')[2]) {
              console.log('Refused!')
              setShowTrello(false)
            } else if (navState.url.substr(0, navState.url.indexOf('#')) === 'https://www.google.com/') {
              try {
                await authTrello(navState.url.split('=')[1])
                const trello = await AsyncStorage.getItem('trello')
                if (!trello) throw Error('No trello data found')
                console.log(trello)
                setTrelloData(JSON.parse(trello))
                setTrelloLogged(true)
              } catch {(e) => console.error(e)}
              setShowTrello(false)
            }
          }}
        />
        :
        <View style={SettingsCSS.settings}>
          <View style={SettingsCSS.githubCard}>
            {
              githubLogged ?
                <View>
                  <Avatar.Image source={{ uri: githubData.avatar_url }} />
                  <Title>{githubData.login}</Title>
                  <IconButton
                    icon='exit-to-app'
                    mode='contained'
                    onPress={() => {
                      onSignOut('github')
                      setGithubLogged(false)
                    }}
                  >
                    Sign Out
                  </IconButton>
                </View>
              :
                <IconButton
                  icon='github'
                  onPress={onGithub}
                  mode='contained'
                >
                  GITHUB
                </IconButton>}
          </View>
          <View style={SettingsCSS.trelloCard}>
            {
              trelloLogged ?
              <View>
                  <Avatar.Image source={{ uri: trelloData.avatarUrl + '/50.png' }} />
                  <Title>{trelloData.username}</Title>
                <IconButton
                  icon='exit-to-app'
                  mode='contained'
                  onPress={() => {
                    onSignOut('trello')
                    setTrelloLogged(false)
                  }}
                >
                  SIGN OUT
                </IconButton>
              </View>
              :
              <IconButton
                icon='trello'
                mode='contained'
                onPress={() => setShowTrello(true)} 
              >
                TRELLO
              </IconButton>
            }
          </View>
          <View style={SettingsCSS.deleteAllCard}>
            <IconButton
              mode='contained'
              icon='delete'
              onPress={() => {
                deleteJob('haha', true);
                RNRestart.Restart();
              }}
            >
              Delete all jobs
            </IconButton>
          </View>
        </View>
      }
    </View>
  )
};

export default Settings;