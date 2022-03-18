import AsyncStorage from '@react-native-async-storage/async-storage';
import { handleErrors } from '../../global/error';

export const requestSignUp = async (name: string, email: string, password: string, confirm_pw: string): Promise<Response> => {
  let bodyFormData = new FormData()
  bodyFormData.append('name', name)
  bodyFormData.append('email', email)
  bodyFormData.append('password', password)
  bodyFormData.append('confirm_pw', confirm_pw)


  const url = await AsyncStorage.getItem('url')
  if (!url) throw new Error('No url data found')
  const response: Response = await fetch(`${url}/user`, {
    method: 'POST',
    body: bodyFormData
  }).then(handleErrors).then((response) => {
    return response
  }).catch((error: Error) => {
    throw error
  });
  return response;
}
