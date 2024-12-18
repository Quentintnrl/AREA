import {View, Text, TextInput, TouchableOpacity} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { SelectList } from 'react-native-dropdown-select-list'
import config from "../../../config"

export default function CreateScreen() {
    const navigation = useNavigation();
    const [selectedService, setSelectedService] = useState("");
    const [selectedAction, setSelectedAction] = useState("");
    const [dataServices, setDataServices] = useState([]);
    const [dataActions, setDataActions] = useState([]);

    useEffect(() => {
        const getServices = async() => {
            let newArray = [] as any
            try {
                const response = await fetch('http://' + config.IP + ':8080/getServices/')
                const json = await response.json();
                json.forEach((elt: any) => {
                    newArray.push({key: elt.id, value: elt.name})
                });
                setDataServices(newArray)
            } catch (error) {
                console.log(error)
            }
        }
        getServices();
    }, [])

    const checkSelectedService = () => {
        if (selectedService) {
            const getServiceActions = async () => {
                let newArray = [] as any
                try {
                    const response = await fetch('http://' + config.IP + ':8080/getServiceActions/' + selectedService)
                    const json = await response.json();
                    json.forEach((elt: any) => {
                        newArray.push({key: elt.id, value: elt.name})
                    });
                    setDataActions(newArray)
                } catch (error) {
                    console.log(error)
                }
            }
            if (dataActions.length == 0)
                getServiceActions()
            return true
        } else {
            return false
        }
    }

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
                    setSelected={(val: any) => setSelectedService(val)}
                    data={dataServices}
                    save="key"
                    placeholder='Select Service'
                />
                {checkSelectedService() &&
                    <View>
                        <Text>Available Actions</Text>
                        <SelectList
                            setSelected={(val: any) => setSelectedAction(val)}
                            data={dataActions}
                            save="value"
                            placeholder='Select Action'
                        />
                    </View>
                }
            </View>
        </SafeAreaView>
    )
}