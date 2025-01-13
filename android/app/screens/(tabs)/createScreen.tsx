import {View, Text, TextInput, TouchableOpacity, Linking, StyleSheet} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { SelectList } from 'react-native-dropdown-select-list'
import config from "../../../config"
import SessionStorage from 'react-native-session-storage';

export default function CreateScreen() {
    const navigation = useNavigation();
    const [selectedService1, setSelectedService1] = useState("");
    const [selectedService2, setSelectedService2] = useState("");

    const [selectedAction, setSelectedAction] = useState("");

    const [selectedReaction, setSelectedReaction] = useState("");
    const [dataServices, setDataServices] = useState([]);
    const [dataActions, setDataActions] = useState([]);
    const [dataReactions, setDataReactions] = useState([]);
    const [dataActionsParams, setDataActionsParams] = useState([]);
    const [dataReactionsParams, setDataReactionsParams] = useState([]);
    const [paramActionValue, setParamActionValue] = useState({});
    const [paramReactionValue, setParamReactionValue] = useState({});
    const userId = SessionStorage.getItem('@id');

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

    const checkLogged = async (selectedService:any) => {
        if (selectedService == 2) // Github service
            return;
        const checkIfLogged = await fetch('http://' + config.IP + ':8080/isUserLogin/' + selectedService + '/' + userId)
        const json = await checkIfLogged.json();
        if (json.login != true) {
            const serviceURLConnexion = await fetch('http://' + config.IP + ':8080/getServiceLoginURL/' + userId + '/' + selectedService)
            const serviceURLConnexionjson = await serviceURLConnexion.json();
            Linking.canOpenURL(serviceURLConnexionjson.url).then((supported) => {
                supported && Linking.openURL(serviceURLConnexionjson.url);
            })
        }
    }

    const checkParamAction = (selectedAction:any) => {
        const getParamsAction = async () => {
            let paramsArray = [] as any
            try {
                const response = await fetch('http://' + config.IP + ':8080/getAction/' + selectedAction)
                const json = await response.json();
                json.action.forEach((elt:any, i:any) => {
                    if (elt.params != null) {
                        elt.params.params.forEach((item:any, i:any) => {
                            paramsArray.push({id: (i + 1), value: item.name})
                        })
                    }
                });
                setDataActionsParams(paramsArray)
            } catch (error) {
                console.log(error)
            }
        }
        getParamsAction()
    }

    const checkParamReaction = (selectedReaction:any) => {
        const getParamsReaction = async () => {
            let paramsArray = [] as any
            try {
                const response = await fetch('http://' + config.IP + ':8080/getReaction/' + selectedReaction)
                const json = await response.json();
                json.reaction.forEach((elt:any, i:any) => {
                    //console.log(elt, i)
                    if (elt.params != null) {
                        elt.params.params.forEach((item:any, i:any) => {
                            paramsArray.push({id: (i + 1), value: item.name})
                        })
                    }
                });
                setDataReactionsParams(paramsArray)
            } catch (error) {
                console.log(error)
            }
        }
        getParamsReaction()
    }

    const checkSelectedService1 = (selectedService:any) => {
        const getServiceActions = async () => {
            let newArray = [] as any
            try {
                const response = await fetch('http://' + config.IP + ':8080/getServiceActions/' + selectedService)
                const json = await response.json();
                json.forEach((elt: any) => {
                    newArray.push({key: elt.id, value: elt.name})
                });
                setDataActions(newArray)
                //setSelectedAction("")
                await checkLogged(selectedService)
            } catch (error) {
                console.log(error)
            }
        }
        getServiceActions()
    }

    const checkSelectedService2 = (selectedService:any) => {
        const getServiceReactions = async () => {
            let newArray = [] as any
            try {
                const response = await fetch('http://' + config.IP + ':8080/getServiceReactions/' + selectedService)
                const json = await response.json();
                json.forEach((elt: any) => {
                    newArray.push({key: elt.id, value: elt.name})
                });
                setDataReactions(newArray)
                //setSelectedReaction("")
                await checkLogged(selectedService)
            } catch (error) {
                console.log(error)
            }
        }
        getServiceReactions()
    }

    const displayInputsActions = () => {
        console.log("dataactions = ", dataActionsParams)
        return dataActionsParams.map((data:any, i) =>
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
                    onChangeText={(paramAction) => setParamActionValue(prev => ({...prev, [data.value]: paramAction}))}
                />
            </View>
        )
    }

    const displayInputsReactions = () => {
        console.log("datareactions = ", dataReactionsParams)
        return dataReactionsParams.map((data:any, i) =>
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
                    onChangeText={(paramReaction) => setParamReactionValue(prev => ({...prev, [data.value]: paramReaction}))}
                />
            </View>
        )
    }

    const createAREA = async () => {
        try {
            const action = {"id": selectedAction, params: paramActionValue};
            const reaction = {"id": selectedReaction, params: paramReactionValue};
            //const JsonReponse = {"user_id": userId, action, reaction};
            let formData = JSON.stringify({JsonReponse: {
                user_id: userId,
                action: action,
                reaction: reaction,
            }});
            console.log(formData)
            const response = await fetch('http://' + config.IP + ':8080/CreateActionReaction/',
                {
                    body: formData,
                    method: 'post'
                });
            console.log("after request")
            console.log(response)
            const json = await response.json();
            console.log('Actions and reactions created successfully:', json);
        } catch (error) {
            console.error('Error fetching actions and reactions:', error);
        }
    }

    return (
        <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <View style={styles.container}>
                <View style={{width: '50%'}}>
                    <Text style={styles.text}>When This</Text>
                    <Text style={{textAlign: 'center'}}>Available Services</Text>
                    <SelectList
                        setSelected={(val: any) => setSelectedService1(val)}
                        data={dataServices}
                        onSelect={() => checkSelectedService1(selectedService1)}
                        save="key"
                        placeholder='Select Service'
                    />
                    {selectedService1 &&
                        <View>
                            <Text>Available Actions</Text>
                            <SelectList
                                setSelected={(val: any) => setSelectedAction(val)}
                                data={dataActions}
                                onSelect={() => checkParamAction(selectedAction)}
                                save="key"
                                placeholder='Select Action'
                            />
                            {selectedAction &&
                                <View>
                                    {displayInputsActions()}
                                </View>
                            }
                        </View>
                    }
                </View>
                <View style={{width: '50%', paddingLeft: 10}}>
                    <Text style={styles.text}>Do This</Text>
                    <Text style={{textAlign: 'center'}}>Available Services</Text>
                    <SelectList
                        setSelected={(val: any) => setSelectedService2(val)}
                        data={dataServices}
                        onSelect={() => checkSelectedService2(selectedService2)}
                        save="key"
                        placeholder='Select Service'
                    />
                    {selectedService2 &&
                        <View>
                            <Text>Available Reactions</Text>
                            <SelectList
                                setSelected={(val: any) => setSelectedReaction(val)}
                                data={dataReactions}
                                onSelect={() => checkParamReaction(selectedService2)}
                                save="key"
                                placeholder='Select Reaction'
                            />
                            {selectedAction &&
                                <View>
                                    {displayInputsReactions()}
                                </View>
                            }
                        </View>
                    }
                </View>
            </View>
            {selectedAction && selectedReaction &&
                <View>
                    <TouchableOpacity
                        onPress={createAREA}
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
                            Create AREA
                        </Text>
                    </TouchableOpacity>
                </View>
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 25,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignContent: 'flex-start'
    },
    text: {
        fontFamily: 'SpaceMono-Regular',
        fontSize: 25,
        fontWeight: 600,
        color: '333',
        marginBottom: 30,
        textAlign: 'center'
    }
})