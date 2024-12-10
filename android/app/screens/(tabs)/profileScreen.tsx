import {View, Text, TextInput, TouchableOpacity} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native';

export default function CreateScreen() {
    const navigation = useNavigation();

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
                <TouchableOpacity onPress={() => {}}>
                    <Text
                        style={{
                            textAlign: 'left',
                            fontSize: 30,
                            fontWeight: 800,
                            marginBottom: 20,
                        }}>
                        Account
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {navigation.navigate("Login" as never)}}>
                    <Text
                        style={{
                            textAlign: 'left',
                            fontSize: 30,
                            fontWeight: 800,
                        }}>
                        Sign out
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}