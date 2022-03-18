import { handleErrors } from '../../global/error';
import { Job } from 'global/result';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Config from 'react-native-config';

export const createJob = async (job: Job): Promise<Response> => {
  try {
    const token = await AsyncStorage.getItem('token')
    if (!token) throw new Error('No token found');
    const url = await AsyncStorage.getItem('url')
    if (!url) throw new Error('No url data found')
    const response: Response = await axios({
      url: `${url}/jobs`,
      method: 'POST',
      data: job,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then((response) => {
      return response
    }).catch((error: Error) => {
      throw error
    });
    return response;
  } catch (e) {
    throw e
  }
}
