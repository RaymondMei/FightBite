import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  Button,
  Image,
  TouchableOpacity,
} from 'react-native';
// import Toast from 'react-native-simple-toast';
// import StartScreen from 'screens/StartScreen'
// import GetPhotoScreen from 'screens/GetPhotoScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts } from "expo-font";
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';



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
        title="Take Image"
        onPress={() => {
          navigation.navigate('GetPhoto');
          console.log("start button clicked");
        }}
        styles={styles.button}
      />

    </SafeAreaView>
  );
}

function GetPhotoScreen() {

  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [photo, setPhoto] = useState();
  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, []);

  let scanPhoto = async () => {

  }

  let capturePic = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false
    };
    let newPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(newPhoto);
  };

  let pickImage = async () => {
    let newPhoto = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
      exif: false,
    });

    if (!newPhoto.cancelled) {
      setPhoto(newPhoto);
    }
  }

  if (photo) {

    let savePhoto = () => {
      // Toast.show("Saved", Toast.SHORT);
      MediaLibrary.saveToLibraryAsync(photo.uri);
    };

    return (
      <SafeAreaView style={styles.photosContainer}>
        {photo && <Image style={styles.camera} source={{ uri: "data:image/jpg;base64," + photo.base64 }} />}
        {/* {photo && <Image source={{ uri: photo }} />} */}

        <View style={styles.capturedPhotoButtons}>
          {hasMediaLibraryPermission ? <TouchableOpacity onPress={scanPhoto} style={styles.button}>
            <Text>Scan</Text>
          </TouchableOpacity> : undefined}
          {hasMediaLibraryPermission ? <TouchableOpacity onPress={savePhoto} style={styles.button}>
            <Text>Save</Text>
          </TouchableOpacity> : undefined}
          <TouchableOpacity onPress={() => setPhoto(undefined)} style={styles.button}>
            <Text>Discard</Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.photosContainer}>
      <Camera
        style={styles.camera}
        ref={cameraRef}
        ratio="1:1">
        <StatusBar style="auto" />
      </Camera>
      <View>
        <TouchableOpacity onPress={capturePic} style={styles.button}>
          <Text>Capture</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={pickImage} style={styles.button}>
          <Text>Pick from Gallery</Text>
        </TouchableOpacity>
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
    minHeight: 40,
    minWidth: 80,
    backgroundColor: 'salmon',
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',

  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 1000,
  },
  photosContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    width: 300,
    height: 300,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  buttonContainer: {
    alignSelf: 'center',
    justifyContent: 'flex-end',
  },
  capturedPhotoButtons: {
    width: 300,
    flexDirection: 'row',
    justifyContent: 'space-around',
  }
});
