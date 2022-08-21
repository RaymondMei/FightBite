import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, SafeAreaView, View, Button, Alert, Image } from 'react-native';
// import StartScreen from 'screens/StartScreen'
// import GetPhotoScreen from 'screens/GetPhotoScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useFonts } from "expo-font";


import { LinearGradient } from "expo-linear-gradient";

const Stack = createNativeStackNavigator();

export default function App() {

  const [loaded] = useFonts({
    Montserrat: require('./assets/fonts/Montserrat-VariableFont_wght.ttf'),
    NunitoSans: require('./assets/fonts/NunitoSans-Black.ttf'),
    RaleWay: require('./assets/fonts/Raleway-VariableFont_wght.ttf'),
    RobotoSlab: require('./assets/fonts/RobotoSlab-VariableFont_wght.ttf'),
    Roboto: require('./assets/fonts/Roboto-Black.ttf'),
    AlumniSansPinstripe: require('./assets/fonts/AlumniSansPinstripe-Regular.ttf'),
    RobotoCondensedBold: require('./assets/fonts/RobotoCondensed-Bold.ttf')
  })

  if (!loaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="Start"
          component={StartScreen}
        />
        <Stack.Screen
          name="GetPhoto"
          component={GetPhotoScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


function StartScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>

      <LinearGradient
        // Background Linear Gradient
        colors={['#FFB88C', '#DE6262', `#FFB88C`, 'transparent']}
        style={styles.background}

      />

      <Text style={{ color: 'black', fontSize: 70, fontFamily: 'RobotoCondensedBold',}}> FightBite</Text>
      <Image height source={require('./assets/logo.png')} style={{ width: 400, height: 400 }} />
      <StatusBar style="auto" />
      <Button
        title="Add Photo from Library"
        onPress={() => {
          navigation.navigate('GetPhoto');
          console.log("start button clicked");
        }}
      />

    </SafeAreaView>
  );
}

function GetPhotoScreen() {
  const openCamera = () => {

  }
  return (
    <SafeAreaView style={styles.body}>
      <View style={styles.center}>
        <Button title={"Open Camera"} onPress={() => { openCamera }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  body: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    height: '50%',
    width: '50%',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 1000,
  },

});
