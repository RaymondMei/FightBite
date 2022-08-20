import React from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>

      <Text>Start</Text>
      <Text>FightBite</Text>
      <StatusBar style="auto" />
      <Button
        title="Take Photo"
        onPress={() => Alert.alert('This Button was pressed')}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
