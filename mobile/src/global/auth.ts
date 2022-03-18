import AsyncStorage from '@react-native-async-storage/async-storage';
import { authorize, AuthorizeResult } from 'react-native-app-auth'
import Config from 'react-native-config';
import { handleErrors } from './error';
import { TrelloUser } from './result';
import { getGithubUser, getTrelloUser } from './utils';

const githubConfig = {
  redirectUrl: Config.GITHUB_REDIRECT_URL,
  clientId: Config.GITHUB_CLIENT,
  clientSecret: Config.GITHUB_SECRET,
  scopes: ['identity', 'admin:repo_hook', 'admin:org', 'admin:public_key', 'admin:org_hook', 'gist', 'notifications', 'user', 'delete_repo', 'admin:gpg_key', 'workflow', 'repo', 'repo_deployment', 'public_repo', 'repo:invite'],
  serviceConfiguration: {
    authorizationEndpoint: 'https://github.com/login/oauth/authorize',
    tokenEndpoint: 'https://github.com/login/oauth/access_token',
    revocationEndpoint:
      `https://github.com/settings/connections/applications/${Config.GITHUB_CLIENT}`
  }
}

export const authGithub = async (): Promise<Response> => {
  try {
    const authState = await authorize(githubConfig)
    console.log(authState.accessToken)
    const user = await getGithubUser(authState.accessToken)
    let newData: GithubData = authState
    newData.login = user.login
    newData.avatar_url = user.avatar_url
    await AsyncStorage.setItem('github', JSON.stringify(newData))
    const github = await sendTokenToServer('github', authState.accessToken)
    return (github)
  } catch (e) {throw e}
}

export interface GithubData extends AuthorizeResult {
  login?: string,
  avatar_url?: string
}

export const authTrello = async (token: string): Promise<Response> => {
  try {
    let data: TrelloData = {token}
    const user = await getTrelloUser(token)
    data.username = user.username
    data.avatarUrl = user.avatarUrl
    await AsyncStorage.setItem('trello', JSON.stringify(data))
    const trello = await sendTokenToServer('trello', token)
    return (trello)
  } catch (e) {throw e}
}

export interface TrelloData extends TrelloUser {
  token: string
}

const sendTokenToServer = async (type: string, token: string): Promise<Response> => {
  let bodyFormData = new FormData()
  bodyFormData.append(`token_${type}`, token)

  let headers = {}
  const t = await AsyncStorage.getItem('token')
  if (t)
    headers = {
      'Authorization': `Bearer ${t}`
    }
    
  const url = await AsyncStorage.getItem('url')
  if (!url) throw new Error('No url data found')
  const response: Response = await fetch(`${url}/${type}`, {
    method: 'POST',
    headers,
    body: bodyFormData
  }).then(handleErrors).then((response) => {
    return response
  }).catch((error: Error) => {
    throw error
  });
  return response;
}