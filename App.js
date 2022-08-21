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
import Toast from 'react-native-simple-toast';
// import StartScreen from 'screens/StartScreen'
// import GetPhotoScreen from 'screens/GetPhotoScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts } from "expo-font";
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import { Buffer } from 'buffer';
import { withSafeAreaInsets } from 'react-native-safe-area-context';



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
        <Stack.Screen
          name="Results"
          component={ResultsScreen}
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
        colors={['#FE6197', '#FFB463']}
        style={styles.background}
      />
      <Text style={{ color: 'black', fontSize: 70, fontFamily: 'RobotoCondensedBold', }}> FightBite</Text>
      <Image height source={require('./assets/logo.png')} style={{
        width: 400, height: 400, shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
      }} />
      <StatusBar style="auto" />
      <LinearGradient
        colors={['#1b1c27', '#424454']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.button, { padding: 25 }]}>
        <TouchableOpacity onPress={() => {
          navigation.navigate('GetPhoto');
          console.log("start button clicked");
        }} >
          <Text style={{ color: 'white', fontSize: 35, fontFamily: 'RobotoCondensedBold' }}> Identify Bite</Text>
        </TouchableOpacity>
      </LinearGradient>
    </SafeAreaView >
  );
}

function GetPhotoScreen({ navigation }) {

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

  async function scanPhoto(photo) {
    console.log(photo.uri);
    async function uploadImageAsync(uri) {
      let apiUrl = 'https://fitebite.herokuapp.com/predict';

      let uriParts = uri.split('.');
      let fileType = uri[uri.length - 1];

      let formData = new FormData();
      formData.append('file', {
        uri,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      });

      let options = {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      };

      return fetch(apiUrl, options);
    }
    let uploadResponse = await uploadImageAsync(photo.uri);
    let uploadResult = await uploadResponse.json();
    navigation.navigate("Results", { results: JSON.stringify(uploadResult) });
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
      allowsMultipleSelection: false,
      aspect: [1, 1],
      quality: 1,
      base64: true,
      exif: false,
    });

    if (!newPhoto.cancelled) {
      // console.log(newPhoto);
      setPhoto(newPhoto);
    }
  }

  if (photo) {

    let savePhoto = () => {
      Toast.show("Saved", Toast.SHORT);
      MediaLibrary.saveToLibraryAsync(photo.uri);
    };

    return (
      <SafeAreaView style={styles.photosContainer}>
        <LinearGradient
          // Background Linear Gradient
          colors={['#FE6197', '#FFB463']}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0, height: '130%', flex: 1, alignItems: 'center'
          }}
        >
          <View style={{ position: 'absolute', top: '15%', height: 500, justifyContent: 'space-between' }}>

            <View style={{ height: 365, justifyContent: 'space-between' }}>
              {photo && <Image style={styles.camera} source={{ uri: "data:image/png;base64," + photo.base64 }} />}
              {hasMediaLibraryPermission ?
                <LinearGradient
                  colors={['#6448FE', '#5FC6FF']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={[styles.button, { height: 60 }]}>
                  <TouchableOpacity onPress={async () => { await scanPhoto(photo); }}>
                    <Text>Scan</Text>
                  </TouchableOpacity>
                </LinearGradient>
                : undefined}
            </View>
            <View style={[styles.capturedPhotoButtons]}>
              {hasMediaLibraryPermission ?
                <LinearGradient
                  colors={['#FFFE6197', '#FFB463']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={[styles.button, { width: '45%', height: 60 }]}>
                  <TouchableOpacity onPress={() => { savePhoto(photo); }}>
                    <Text>Save</Text>
                  </TouchableOpacity>
                </LinearGradient>
                : undefined}
              <LinearGradient
                colors={['#FF5DCD', '#FF8484']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={[styles.button, { width: '45%', height: 60 }]}>
                <TouchableOpacity onPress={() => setPhoto(undefined)}>
                  <Text>Discard</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>

          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        // Background Linear Gradient
        colors={['#FE6197', '#FFB463']}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0, height: '130%', flex: 1, alignItems: 'center',
        }}
      >
        <View style={{ alignItems: 'center', position: 'absolute', top: '10%', justifyContent: 'space-between', height: 380 }}>
          <Camera
            style={[styles.camera, { borderColor: 'black', borderWidth: 3 }]}
            ref={cameraRef}
            ratio="1:1">
            <StatusBar style="auto" />
          </Camera>

          <LinearGradient
            colors={['#1b1c27', '#424454']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={[styles.button, { width: 170 }]}>
            <TouchableOpacity onPress={capturePic} style={styles.button}>
              <Text style={{ color: 'white', fontSize: 25, fontFamily: 'RobotoCondensedBold' }}>Capture</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        <View style={{ width: 300, position: 'absolute', bottom: '35%', alignItems: 'center', }}>
          <LinearGradient
            colors={['#1b1c27', '#424454']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={[styles.button, { width: 300 }]}>
            <TouchableOpacity onPress={pickImage} style={styles.button}>
              <Text style={{ color: 'white', fontSize: 25, fontFamily: 'RobotoCondensedBold' }}>Pick from Gallery</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View >
      </LinearGradient>
    </SafeAreaView >
  );
}

function ResultsScreen({ route }) {
  const { results } = route.params;
  let data = JSON.parse(results);
  console.log(data.class);
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        // Background Linear Gradient
        colors={['#FE6197', '#FFB463']}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0, height: '130%', flex: 1, alignItems: 'center',
        }}
      >

        <Text style={{ position: 'absolute', top: '30%', color: 'black', fontSize: 70, fontFamily: 'RobotoCondensedBold', }}>
          {data.class}
        </Text>
      </LinearGradient>
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
    minHeight: 50,
    minWidth: 80,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    color: 'white',
  },
  lingrad: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: "130%",
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
