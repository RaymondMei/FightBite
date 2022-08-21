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
  Linking,
  Platform,
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
        style={[styles.background]}
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
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.button, { padding: 25, }]}>
        <TouchableOpacity onPress={() => {
          navigation.navigate('GetPhoto');
          console.log("start button clicked");
        }} >
          <Text style={{ color: 'white', fontSize: 35, }}> Identify Bite</Text>
        </TouchableOpacity>
      </LinearGradient>
      {/* <Text>Developed by Evan Wu, Eric Wang, Raymond Mei</Text> */}
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
    if (Platform.OS === 'android') Toast.show("Scanning...", Toast.SHORT);
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
      if (Platform.OS === 'android') Toast.show("Saved", Toast.SHORT);
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
          <Text style={{ color: 'black', position: 'absolute', top: '5%', fontSize: 70, fontFamily: 'RobotoCondensedBold', }}>Image</Text>
          <View style={{ position: 'absolute', top: '18%', height: 500, justifyContent: 'space-between' }}>

            <View style={{ height: 365, justifyContent: 'space-between' }}>
              {photo && <Image style={styles.camera} source={{ uri: "data:image/png;base64," + photo.base64 }} />}
              {hasMediaLibraryPermission ?
                <LinearGradient
                  colors={['#6448FE', '#5FC6FF']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={[styles.button, { height: 60 }]}>
                  <TouchableOpacity onPress={async () => { await scanPhoto(photo); }}
                    style={[styles.button, { width: '100%' }]}>
                    <Text style={{ color: 'white', fontSize: 25 }}>SCAN</Text>
                  </TouchableOpacity>
                </LinearGradient>
                : undefined}
            </View>
            <View style={[styles.capturedPhotoButtons]}>
              {hasMediaLibraryPermission ?
                <LinearGradient
                  colors={['#2ec06f', '#a6f77b']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={[styles.button, { width: '45%', height: 60 }]}>
                  <TouchableOpacity onPress={() => { savePhoto(photo); }} style={[styles.button, { width: '100%' }]}>
                    <Text style={{ color: 'white', fontSize: 25 }}>Save</Text>
                  </TouchableOpacity>
                </LinearGradient>
                : undefined}
              <LinearGradient
                colors={['#eb3941', '#f15e64', '#e14e53', '#e2373f']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={[styles.button, { width: '45%', height: 60 }]}>
                <TouchableOpacity onPress={() => setPhoto(undefined)} style={[styles.button, { width: '100%' }]}>
                  <Text style={{ color: 'white', fontSize: 25 }}>Discard</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>

          </View>
        </LinearGradient>
      </SafeAreaView >
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
      ><Text style={{ position: 'absolute', top: '5%', color: 'black', fontSize: 50, fontFamily: 'RobotoCondensedBold', }}>Bite Image</Text>
        <View style={{ alignItems: 'center', position: 'absolute', top: '20%', justifyContent: 'space-between', height: 380 }}>
          <Camera
            style={[styles.camera, { borderColor: 'black', borderWidth: 3 }]}
            ref={cameraRef}
            ratio="1:1">
            <StatusBar style="auto" />
            <LinearGradient
              colors={['#1b1c27', '#424454']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={[styles.button, { width: '25%', height: '16%', marginBottom: '2%' }]}>
              <TouchableOpacity onPress={capturePic} style={[styles.button, { width: '100%' }]}>
                <Text style={{ color: 'white', fontSize: 15 }}>Capture</Text>
              </TouchableOpacity>
            </LinearGradient>
          </Camera>


        </View>

        <View style={{ width: 300, position: 'absolute', bottom: '32%', alignItems: 'center', }}>
          <LinearGradient
            colors={['#1b1c27', '#424454']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={[styles.button, { width: 300 }]}>
            <TouchableOpacity onPress={pickImage} style={[styles.button, { width: '100%' }]}>
              <Text style={{ color: 'white', fontSize: 25 }}>Pick from Gallery</Text>
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
  let bugInfo = getBugInfo(data.class);
  console.log(bugInfo);
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
        <View style={{ position: 'absolute', left: 0, right: 0, top: 0, height: "77%", justifyContent: 'space-evenly', padding: 20 }}>
          <Text style={{ color: 'black', fontSize: 70, fontFamily: 'RobotoCondensedBold', }}>
            {bugInfo.name}
          </Text>
          <Text style={{ color: 'black', fontSize: 18, fontFamily: 'Roboto', }}>
            {bugInfo.description}
          </Text>
          <Text style={{ color: 'black', fontSize: 18, fontFamily: 'Roboto', }}>
            {bugInfo.treatment}
          </Text>
          <Text onPress={() => { Linking.openURL(bugInfo.link) }} style={{ color: 'black', fontSize: 18, fontFamily: 'Roboto', color: 'blue', textDecorationLine: 'underline' }}>
            {bugInfo.link}
          </Text>

        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

function getBugInfo(bug) {
  let bugInfo = { "name": bug };
  if (bug == "Bedbug") {
    bugInfo['description'] = "Reddish brown, oval and flat, about the size of an apple seed. They hide in the crevices of beds, box springs, bed frames, and other objects near a bed. They come out at night to suck on human blood, which generally do not cause any disease, but may cause infections from scratching."
    bugInfo['treatment'] = "Wash bites with soap and water. Apply corticosteroid cream to reduce itching."
    bugInfo['link'] = "https://www.amazon.ca/Gold-Bond-Ultimate-Eczema-Milliliter/dp/B07KK4WYK9/ref=sr_1_2_sspa?crid=3LUCYWE6FZ3UP&keywords=corticosteroid+cream&qid=1661072164&sprefix=corticosteroid+cream%2Caps%2C60&sr=8-2-spons&psc=1";
  } else if (bug == "Flea") {
    bugInfo['description'] = "Small wingless, agile insects that occupy hosts such as pets and humans to suck their blood. These bites may transmit diseases such as cat scratch disease or parasites."
    bugInfo['treatment'] = "Antihistamine or corticosteroid cream to reduce itching. Ice can reduce swelling and pain. Aloe vera contains salicylic acid, which reduces itching and pain."
    bugInfo['link'] = "https://www.amazon.ca/Foodaholic-Aloe-Vera-Soothing-300ml/dp/B0868WLDXM/ref=sr_1_5?crid=3K3URV1K23HNA&keywords=aloe+vera+gel&qid=1661072692&sprefix=aloe+vera+gel%2Caps%2C64&sr=8-5";
  } else if (bug == "Mosquito") {
    bugInfo['description'] = "Thin, long-leged, two-winged insects that mainly inhabit hotter, more humid environments. They use a long appendage to suck blood, which may transmit diseases such as West Nile virus, yellow fever, and dengue fever virus."
    bugInfo['treatment'] = "Wash area with soap and water. Apply ice packs to reduce swelling and itching. Use anti-itch or antihistamine cream to relieve itching."
    bugInfo['link'] = "https://www.amazon.ca/After-Bite-Treatment-Protectant-0-7-Ounce/dp/B001UWOYUE/ref=sr_1_1_sspa?keywords=after+bite&qid=1661070612&sprefix=after%2Caps%2C65&sr=8-1-spons&psc=1";
  } else if (bug == "Tick") {
    bugInfo['description'] = "Small wingless insects that usually lurk in tall grass and plants. They attach to your skin and bite into it to suck blood, which may transmit diseases such as Lyme disease and Rocky Mountain spotted fever."
    bugInfo['treatment'] = "In case of a tick bite, put ice or a cold pack with a thin cloth between the ice and your skin, on the bite for 15 to 20 minutes once an hour. Take an antihistamine medicine to help relieve itching, redness, and swelling. Use a spray of local anesthetic that contains benzocaine, such as Solarcaine. It may help relieve pain. If your skin reacts to the spray, stop using it. Put calamine lotion on the skin. It may help relieve itching."
    bugInfo['link'] = "https://www.amazon.ca/Childrens-Benadryl-Relief-Irritations-Antihistamine/dp/B07KG26YB8/ref=sr_1_1?keywords=antihistamine+cream&qid=1661069758&sprefix=antihistamine+%2Caps%2C59&sr=8-1";
  }
  return bugInfo;
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
