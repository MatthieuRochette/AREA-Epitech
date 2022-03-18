import { APIAbout, APIJobs, GithubUser, Job, Service, TrelloUser } from './result'
import { handleErrors } from './error';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GithubData } from './auth';

export const getServices = async (): Promise<Service[]> => {
    const url = await AsyncStorage.getItem('url')
    if (!url) throw new Error('No url data found')
    return (await fetch(`${url}/area-params.json`, {
        method: 'GET'
    }).then(handleErrors).then((response) => response.json())
    .then((json: APIAbout) => json.server.services)
    .catch((e: Error) => {throw e}))
}

export const getJobs = async (): Promise<Job[]> => {
  try {
    const url = await AsyncStorage.getItem('url')
    if (!url) throw new Error('No url data found')
    const token = await AsyncStorage.getItem('token')
    if (!token) throw new Error('No token found')
    const result = await fetch(`${url}/jobs`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(handleErrors).then((response) => response.json())
      .then((json: APIJobs) => json.jobs)
      .catch((e: Error) => {throw e})
    return result
  } catch (e) {throw e}
}

export const deleteJob = async (id: string, delete_all?: boolean) => {
  let bodyFormData = new FormData()
  bodyFormData.append('id', id)
  bodyFormData.append('delete_all', delete_all)

  try {
    const url = await AsyncStorage.getItem('url')
    if (!url) throw new Error('No url data found')
    const token = await AsyncStorage.getItem('token')
    if (!token) throw new Error('No token found')
    await fetch(`${url}/jobs`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: bodyFormData
    }).then(handleErrors).then(() => console.log('Success!'))
    .catch((e: Error) => {throw e})
  } catch (e) {throw e}
}

export const getGithubUser = async (accessToken: string): Promise<GithubUser> => {
  try {
    const user = await fetch('https://api.github.com/user', {
      method: 'GET',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${accessToken}`
      }
    }).then(handleErrors).then((r) => r.json())
      .then((json: GithubUser) => ({ login: json.login, avatar_url: json.avatar_url }))
      .catch((e: Error) => {throw e})
      return (user)
  } catch (e) {throw e}
}

export const getTrelloUser = async (accessToken: string): Promise<TrelloUser> => {
  try {
    const user = await fetch(`https://api.trello.com/1/members/me/?key=${Config.TRELLO_CLIENT}&token=${accessToken}`, {
      method: 'GET'
    }).then(handleErrors).then((r) => r.json())
      .then((r: TrelloUser) => ({ username: r.username, avatarUrl: r.avatarUrl }))
      .catch((e) => {throw e})
      return user
  } catch (e) {throw e}
}

export interface ModalContent {
  title: string,
  description: string,
  params: any,
  service: string
}