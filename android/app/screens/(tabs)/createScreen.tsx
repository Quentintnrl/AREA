import {View, Text, TextInput, TouchableOpacity} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { SelectList } from 'react-native-dropdown-select-list'
import config from "../../../config"

export default function CreateScreen() {
    const navigation = useNavigation();
    const [selected, setSelected] = useState("");
    const [data, setData] = useState([]);

    useEffect(() => {
        const getServices = async() => {
            let newArray = [] as any
            try {
                const response = await fetch('http://' + config.IP + ':8080/getServices/')
                const json = await response.json();
                json.forEach((elt: any) => {
                    newArray.push({key: elt.id, value: elt.name})
                });
                setData(newArray)
            } catch (error) {
                console.log(error)
            }
        }
        getServices();
    }, [])

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
                    Tab Create
                </Text>
            </View>
            <View>
                <Text>Available Services</Text>
                <SelectList
                    setSelected={(val: any) => setSelected(val)}
                    data={data}
                    save="value"
                />
            </View>
        </SafeAreaView>
    )
}