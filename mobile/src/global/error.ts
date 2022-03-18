import { APIMessage } from "../global/result"

export const handleErrors = async (response: Response) => {
  if (!response.ok) 
    throw Error(`Status ${response.status} => ${await response.json().then((error: APIMessage) => error.message)}`);
  return response;
}