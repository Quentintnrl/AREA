import { View, Text, TouchableOpacity } from "react-native"
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Card({data} : {data:any}) {
    return (
        <SafeAreaView>
            <View>
                <TouchableOpacity
                    style={{
                        backgroundColor: '#1ed760',
                        padding: 20,
                        borderRadius: 10,
                        marginBottom: 20,
                        width: 350,
                        height: 200,
                        justifyContent: 'center',
                    }}>
                    <Text
                        style={{
                            textAlign: 'left',
                            fontSize: 25,
                            fontWeight: 700,
                            color: 'white',
                        }}>
                        {data.name}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}
