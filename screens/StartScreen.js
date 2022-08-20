import React from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';

export default function StartScreen({ navigation }) {
    return (
        <View style={styles.container}>

            <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 50, }}>FightBite</Text>
            <Image height source={require('./assets/logo.png')} style={{ width: 300, height: 300 }} />
            <StatusBar style="auto" />
            <Button
                title="Start"
                onPress={() => {
                    navigation.navigate('GetPhotoScreen');
                    console.log("start button clicked");
                }}
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
