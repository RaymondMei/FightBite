import React from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Alert, Image } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>

      <Text style={{color: 'red', fontWeight: 'bold', fontSize: 50,}}>FightBite</Text>
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
