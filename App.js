import React from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Alert, Image } from 'react-native';
import { useFonts } from "expo-font";

export default function App() {

  const [loaded] = useFonts({
    Montserrat: require('./assets/fonts/Montserrat-VariableFont_wght.ttf'),
    NunitoSans: require('./assets/fonts/NunitoSans-Black.ttf'),
    RaleWay: require('./assets/fonts/Raleway-VariableFont_wght.ttf'),
  }) 

  if (!loaded) {
    return null;
  }

  return (
    <View style={styles.container}>

      <Text style={{color: 'red', fontSize: 50, fontFamily: 'RaleWay',}}> FightBite</Text>
      <Image height source={require('./assets/logo.png')} style= {{width: 300, height: 300}}/>
      <StatusBar style="auto"/>
      <Button
        title="Start"
        onPress={() => console.log("yes")}    
      />

      

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
