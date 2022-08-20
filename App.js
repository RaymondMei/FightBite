import React from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Alert, Image } from 'react-native';
// import StartScreen from 'screens/StartScreen'
// import GetPhotoScreen from 'screens/GetPhotoScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";

const Stack = createNativeStackNavigator();
import { useFonts } from "expo-font";

export default function App() {

  const [loaded] = useFonts({
    Montserrat: require('./assets/fonts/Montserrat-VariableFont_wght.ttf'),
    NunitoSans: require('./assets/fonts/NunitoSans-Black.ttf'),
    RaleWay: require('./assets/fonts/Raleway-VariableFont_wght.ttf'),
    RobotoSlab: require('./assets/fonts/RobotoSlab-VariableFont_wght.ttf'),
    Roboto: require('./assets/fonts/Roboto-Black.ttf'),
  })

  if (!loaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
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

    <View style={styles.container}>

      <LinearGradient
        // Background Linear Gradient
        colors={['#696969', `#b0c4de`,'transparent']}
        style={styles.background}
        
      />

      <Text style={{ color: 'lightsalmon', fontSize: 70, fontFamily: 'Roboto',}}> FightBite</Text>
      <Image height source={require('./assets/logo.png')} style={{ width: 300, height: 300 }} />
      <StatusBar style="auto" />
      <LinearGradient
        // Button Linear Gradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.button}>
        <Button
          title="Start"
          onPress={() => {
            navigation.navigate('GetPhoto');
            console.log("start button clicked");
          }}
        />
      </LinearGradient>

    </View>
  );
}

function GetPhotoScreen() {
  return (<View>
    <Text>
      Test
    </Text>
  </View>);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  button: {
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 1000,
  },
  
});
