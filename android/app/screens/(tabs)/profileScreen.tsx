import {View, Text, TextInput, TouchableOpacity} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react'
import config from "../../../config"

interface UserInfo {
    email: string;
    username: string;
}

export default function CreateScreen() {
    const navigation = useNavigation();
    const [dataUser, setDataUser] = useState<UserInfo | null>(null);

    useEffect(() => {
        getUserInfo()
    }, []);

    const getUserInfo = async() => {
        try {
            const response = await fetch('http://' + config.IP + ':8080/getUserInfo/')
            const json = await response.json();
            setDataUser({email: json.info[0].email, username: json.info[0].username})
        } catch (error) {
          console.log(error)
        }
    }

    return (
        <SafeAreaView
            style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
            <View
                style={{
                    width: '100%',
                    justifyContent: 'center',
                    //position: 'absolute',
                    //bottom: 0,
                    paddingHorizontal: 50
                }}>
                {dataUser &&
                    <View>
                        <Text
                            style={{
                                textAlign: 'left',
                                fontSize: 25,
                                fontWeight: 600,
                                marginBottom: 20,
                            }}>
                            Email : {dataUser.email}
                        </Text>
                        <Text
                            style={{
                                textAlign: 'left',
                                fontSize: 25,
                                fontWeight: 600,
                                marginBottom: 20,
                            }}>
                            Username : {dataUser.username}</Text>
                    </View>
                }
                <TouchableOpacity onPress={() => {navigation.navigate("Login" as never)}}>
                    <Text
                        style={{
                            textAlign: 'left',
                            fontSize: 30,
                            fontWeight: 800,
                            marginTop: 30,
                        }}>
                        Sign out
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}