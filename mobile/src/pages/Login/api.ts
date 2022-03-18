import { handleErrors } from '../../global/error';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const requestLogin = async (email: string, password: string): Promise<Response> => {
  let bodyFormData = new FormData()
  bodyFormData.append('email', email)
  bodyFormData.append('password', password)
  bodyFormData.append('mobile', true)

  const url = await AsyncStorage.getItem('url')
  if (!url) throw new Error('No url data found')    
  const response: Response = await fetch(`${url}/user`, {
    method: 'LINK',
    body: bodyFormData
  }).then(handleErrors).then((response) => {
    return response
  }).catch((error: Error) => {
    throw error
  });
  return response;
}
