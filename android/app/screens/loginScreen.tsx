import {View, Text, TextInput, TouchableOpacity, Image, Button} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import config from "../../config"
import SessionStorage from 'react-native-session-storage';
import * as WebBrowser from "expo-web-browser"
import * as Google from "expo-auth-session/providers/google"
import { makeRedirectUri } from 'expo-auth-session';

const googleImg = require('../../assets/images/google.png');
const androidClientId = "1009845226599-d9erm72lq37lmkmhes3i4jqqese6vhte.apps.googleusercontent.com"
//const webClientId = "487545478283-sngqjb8bk9st81ng89q1rsaag6dbq010.apps.googleusercontent.com"

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();
    const configOauth = {
        //webClientId,
        redirectUri: makeRedirectUri({
            scheme: 'com.lxnbt.AREA1',  // This should match your app's redirect URI scheme
          }),
        androidClientId
    }
   const [accessToken, setAccessToken] = useState<string | null>(null);

   // Correct usage of useAuthRequest hook
   const [request, response, promptAsync] = Google.useAuthRequest(configOauth);

   // Handle the OAuth response
   useEffect(() => {
        console.log(request, response)
        if (response?.type === 'success' && response.authentication) {
            const token = response.authentication.accessToken;
            setAccessToken(token); // Store the access token
            console.log('Access Token:', token);
        }
   }, [request]); // Re-run the effect whenever the response changes

    const handlePress = async () => {
        console.log("lala")
        await promptAsync();
        console.log(request, response)
    };


    const login = async () => {
        try {
            let formData = JSON.stringify({
                    userName: email,
                    password: password,
                });
            const response = await fetch('http://' + config.IP + ':8080/login/',
                {
                    body: formData,
                    method: 'post'
                });
            const json = await response.json();
            if (response.status == 201) {
                SessionStorage.setItem('@id', json.Id);
                navigation.navigate("App" as never)
            } else
                alert(json.error)
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <View style={{paddingHorizontal: 25}}/>
            <View>
                <Text
                    style={{
                        fontFamily: 'SpaceMono-Regular',
                        fontSize: 30,
                        fontWeight: 700,
                        color: '333',
                        marginBottom: 30,
                        textAlign: 'center',
                    }}>
                    Login
                </Text>
                <TextInput
                    placeholder='Email'
                    style={{
                        fontFamily: 'SpaceMono-Regular',
                        fontSize: 20,
                        marginBottom: 30,
                        textAlign: 'center',
                        borderWidth: 5,
                        width: 300,
                    }}
                    onChangeText={(email) => setEmail(email)}
                />
                <TextInput
                    placeholder='Password'
                    style={{
                        fontFamily: 'SpaceMono-Regular',
                        fontSize: 20,
                        marginBottom: 30,
                        textAlign: 'center',
                        borderWidth: 5,
                    }}
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                />
                <TouchableOpacity
                    onPress={login}
                    style={{
                        backgroundColor: '#7B9DD2',
                        padding: 20,
                        borderRadius: 10,
                        marginBottom: 30,
                        width: 300,
                    }}>
                    <Text
                        style={{
                            textAlign: 'center',
                            fontSize: 20,
                            fontWeight: 600,
                        }}>
                        Login
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handlePress()}>
                        <Image source={googleImg} style={{width: 25, height: 25, position: 'absolute', left: 135}}/>
                </TouchableOpacity>
                <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 40}}>
                    <Text>New on the app?</Text>
                    <TouchableOpacity onPress={() => {navigation.navigate("Register" as never)}}>
                        <Text style={{color: '#7B9DD2', fontWeight: 700}}> Register</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}