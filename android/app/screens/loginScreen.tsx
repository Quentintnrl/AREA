import {View, Text, TextInput, TouchableOpacity} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState } from 'react'
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const login = async () => {
        try {
            let formData = new FormData();
            formData.append("email", email);
            formData.append("password", password);

            const config = {
                headers: {
                    "Accept": 'application/json',
                    "Content-Type" : "application/json",
                    //"Content-Type": 'multipart/form-data',
                }
            }
            const response = await fetch('http://10.84.106.223:3000/login/',
                {
                    body: formData,
                    method: 'post'
                });
            const json = await response.json();
            navigation.navigate("App" as never)
            //console.log(json)
        } catch (error) {
            console.log(error)
            //return []
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
            </View>
        </SafeAreaView>
    )
}