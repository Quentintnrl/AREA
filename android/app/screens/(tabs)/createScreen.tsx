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
    const [dataParams, setDataParams] = useState([]);
    const [paramValue, setParamValue] = useState("");

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
        const getServiceActions = async () => {
            let newArray = [] as any
            let paramsArray = [] as any
            try {
                const response = await fetch('http://' + config.IP + ':8080/getServiceActions/' + selectedService)
                const json = await response.json();
                json.forEach((elt: any) => {
                    if (elt.params != null) {
                        paramsArray.push({id: elt.id, value: elt.params.params[0].name})
                    }
                    newArray.push({key: elt.id, value: elt.name})
                });
                setDataParams(paramsArray)
                setDataActions(newArray)
                setSelectedAction("")
            } catch (error) {
                console.log(error)
            }
        }
        getServiceActions()
    }

    const displayInputs = () => {
        console.log(dataParams)
        return dataParams.map((data:any, i) =>
            <View key={i}>
                <TextInput
                    placeholder={data.value}
                    style={{
                        fontFamily: 'SpaceMono-Regular',
                        fontSize: 20,
                        marginTop: 20,
                        marginBottom: 10,
                        textAlign: 'center',
                        borderWidth: 2,
                        width: 150,
                    }}
                    onChangeText={(paramValue) => setParamValue(paramValue)}
                />
            </View>
        )
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
                    onSelect={checkSelectedService}
                    save="key"
                    placeholder='Select Service'
                />
                {selectedService &&
                    <View>
                        <Text>Available Actions</Text>
                        <SelectList
                            setSelected={(val: any) => setSelectedAction(val)}
                            data={dataActions}
                            save="value"
                            placeholder='Select Action'
                        />
                    {selectedAction &&
                        <View>
                            {displayInputs()}
                            <View>
                                <TouchableOpacity
                                    onPress={alert("created") as any}
                                    style={{
                                        backgroundColor: '#7B9DD2',
                                        padding: 20,
                                        borderRadius: 10,
                                        marginTop: 30,
                                        width: 150,
                                    }}>
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            fontSize: 20,
                                            fontWeight: 600,
                                        }}>
                                        Create
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    }
                    </View>
                }
            </View>
        </SafeAreaView>
    )
}