import {View, Text, TextInput, TouchableOpacity} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import config from "../../config"

export default function RegisterScreen() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const navigation = useNavigation();

    const register = async () => {
        try {
            let formData = JSON.stringify({
                    userEmail: email,
                    userName: name,
                    password: password,
                });
            const response = await fetch('http://' + config.IP + ':8080/register/',
                {
                    body: formData,
                    method: 'post'
                });
            const json = await response.json();

            if (response.status == 201)
                navigation.navigate("App" as never)
            else
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
                    Register
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
                    placeholder='Name'
                    style={{
                        fontFamily: 'SpaceMono-Regular',
                        fontSize: 20,
                        marginBottom: 30,
                        textAlign: 'center',
                        borderWidth: 5,
                        width: 300,
                    }}
                    onChangeText={(name) => setName(name)}
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
                    onPress={register}
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
                        Register
                    </Text>
                </TouchableOpacity>
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                    <Text>Already registered?</Text>
                    <TouchableOpacity onPress={() => {navigation.goBack()}}>
                        <Text style={{color: '#7B9DD2', fontWeight: 700}}> Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}