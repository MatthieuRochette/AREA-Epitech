import AsyncStorage from '@react-native-async-storage/async-storage';
import { handleErrors } from '../../global/error';
import React, { FC, useEffect, useState } from 'react';
import { Button, Text, TextInput } from 'react-native';
import Config from 'react-native-config';
import SetURLCSS from './styles';

interface Props {
  onUrl: (state: boolean) => void; 
}

const SetURL: FC<Props> = (props: Props) => {
  const [url, setUrl] = useState<string>('bleu')
  const [error, setError] = useState(false)

  useEffect(() => {
    setUrl(Config.AREA_SERVER)
  }, [])

  return (
    <>
      <TextInput style={SetURLCSS.urlInput}
        placeholder={url}
        value={url}
        onChangeText={(text) => setUrl(text)}
      />

      <Text style={{ display: !error ? 'none' : 'flex', color: 'red' }}>
        URL INVALID !
      </Text>

      <Text style={SetURLCSS.text}>
        Format: http://localhost:8080
      </Text>

      <Button style={SetURLCSS.button}
        title="SetURL"
        onPress={async () => {
          if (await fetch(`${url}/about.json`, { method: 'GET' }).then(handleErrors).then(() => true).catch(() => false)) {
            AsyncStorage.setItem('url', url)
            props.onUrl(true)
          } else {
            setError(true)
          }
        }}
      />
    </>
  )
}

export default SetURL;