import React, { FC } from 'react';
import { Text, View } from 'react-native';
import SplashScreenCSS from './styles';

const Splash: FC = () => (
  <>
    <View style={SplashScreenCSS.title}>
      <Text>AREA Tirer</Text>
    </View>
  </>
);

export default Splash;