import {View, Text, TextInput, TouchableOpacity, Linking} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { SelectList } from 'react-native-dropdown-select-list'
import config from "../../../config"
import SessionStorage from 'react-native-session-storage';
import InAppBrowser from 'react-native-inappbrowser-reborn';

export default function CreateScreen() {
    const navigation = useNavigation();
    const [selectedService, setSelectedService] = useState("");
    const [selectedAction, setSelectedAction] = useState("");
    const [selectedReaction, setSelectedReaction] = useState("");
    const [dataServices, setDataServices] = useState([]);
    const [dataActions, setDataActions] = useState([]);
    const [dataReactions, setDataReactions] = useState([]);
    const [dataActionsParams, setDataActionsParams] = useState([]);
    const [dataReactionsParams, setDataReactionsParams] = useState([]);
    const [paramValueTMP, setParamValueTMP] = useState("");
    const [paramValue, setParamValue] = useState([]);
    const [paramReactionValue, setParamReactionValue] = useState("");


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

    const checkLogged = async () => {
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
                setDataActionsParams(paramsArray)
                setDataActions(newArray)
                setSelectedAction("")
                await checkLogged()
            } catch (error) {
                console.log(error)
            }
        }
        getServiceActions()
    }

    const checkSelectedAction = () => {
        const getServiceReactions = async () => {
            let newArray = [] as any
            let paramsArray = [] as any
            try {
                const response = await fetch('http://' + config.IP + ':8080/getServiceReactions/' + selectedService)
                const json = await response.json();
                json.forEach((elt: any) => {
                    if (elt.params != null) {
                        paramsArray.push({id: elt.id, value: elt.params.params[0].name})
                    }
                    newArray.push({key: elt.id, value: elt.name})
                });
                setDataReactionsParams(paramsArray)
                setDataReactions(newArray)
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
                    onChangeText={(paramValueTmp) => setParamValueTMP(paramValueTmp)}
                />
            </View>
        )
    }

    /*const displayInputsReactions = () => {
        let array = [] as any
        if (paramValue.find(item => item === "action")) {
            console.log("action is find in paramValue")
        } else {
            array.push({action: paramValueTMP})
            setParamValue(array)
            console.log("paramvalue = ", paramValue)
        }
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
                    onChangeText={(paramValueTmp) => setParamValueTMP(paramValueTmp)}
                />
            </View>
        )
    }*/
    const createAREA = async () => {
        try {
            const action = {"id": selectedAction, "params": {"Track Uri": paramValueTMP}};
            const reaction = {"id": selectedReaction, "params": {"Track Uri": paramReactionValue}};
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
                            onSelect={checkSelectedAction}
                            save="key"
                            placeholder='Select Action'
                        />
                    {selectedAction &&
                        <View>
                            {displayInputsActions()}
                            <Text>Available Reactions</Text>
                            <SelectList
                                setSelected={(val: any) => setSelectedReaction(val)}
                                data={dataReactions}
                                save="value"
                                placeholder='Select Reaction'
                            />
                            {selectedReaction &&
                                <View>
                                    <TextInput
                                        placeholder={"Enter value if needed"}
                                        style={{
                                            fontFamily: 'SpaceMono-Regular',
                                            fontSize: 20,
                                            marginTop: 20,
                                            marginBottom: 10,
                                            textAlign: 'center',
                                            borderWidth: 2,
                                            width: 150,
                                        }}
                                        onChangeText={(paramReactionValue) => setParamReactionValue(paramReactionValue)}
                                    />
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
                                </View>
                            }
                        </View>
                    }
                    </View>
                }
            </View>
        </SafeAreaView>
    )
}