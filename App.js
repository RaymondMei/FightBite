import React from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Alert, Image } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>

      <Text style={{color: 'red', fontWeight: 'bold', fontSize: 50,}}>FightBite</Text>
      <Image height source={require('./assets/FightBiteLogo.jpg')} style= {{width: 100, height: 100}}/>
      <StatusBar style="auto"/>
      <Button
        title="Start"
        onPress={() => Alert.alert("FightBite Activated", "Continue to FightBite?", [
          {text: "Yes", onPress: () => console.log("yes")},
          {text: "No", onPress: () => console.log("no")}
        ])}
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
