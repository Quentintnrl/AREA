import {View, Text, TextInput, TouchableOpacity, Image} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import config from "../../config"
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import SessionStorage from 'react-native-session-storage';
const googleImg = require('../../assets/images/google.png');

GoogleSignin.configure({
    webClientId: "1009845226599-9fhep16q5uq81eeqblftqn4o5slhv7j7.apps.googleusercontent.com",
    offlineAccess: true,
    scopes: ['profile', 'email'],
})

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();


    const GoogleLogin = async() => {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        console.log(userInfo)
        return userInfo
    }

    const handleGoogleLogin = async () => {
        try {
            const response = await GoogleLogin()
            const idToken = response.data?.idToken;
            console.log("id token : ", idToken)
            if (idToken) {
                let formData = JSON.stringify({
                    token: idToken,
                })
                const responseAuth = await fetch('http://' +  config.IP + ':8080/auth/google/',
                    {
                        body: formData,
                        method: 'post'
                    });
                const json = await responseAuth.json();
                console.log("USER DATA : ", json)
                SessionStorage.setItem('@id', json.user[0].id);
                navigation.navigate("App" as never)
            }
        } catch (error) {
            console.log(error)
        }
    }

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
                <TouchableOpacity onPress={handleGoogleLogin}>
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