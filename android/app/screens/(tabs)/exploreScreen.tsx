import { View, Text, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react'
import Card from "../../../components/Card"
import config from "../../../config"
import { useIsFocused } from '@react-navigation/native';

export default function ExploreTab() {
  const [dataActions, setDataActions] = useState([]);
  const isFocused = useIsFocused();

  const makeCardsAction = () => {
    if (dataActions.length === 0) {
      return <Text>No AREAs found</Text>
    }
    return dataActions.map((data, i) => <Card key={i} data={data}/>)
  }

  useEffect(() => {
    if (isFocused) {
      getAREAs();
    }
  }, [isFocused]);

  const getAREAs = async() => {
      try {
          const response = await fetch('http://' + config.IP + ':8080/getAREAs/')
          const json = await response.json();
          console.log("response is : ", json)
          const promises = json.map(async (elt: any) => {
            const action = await fetch('http://' + config.IP + ':8080/getAction/' + elt.action.id);
            const jsonAction = await action.json();
            const reaction = await fetch('http://' + config.IP + ':8080/getReaction/' + elt.reaction.id);
            const jsonReaction = await reaction.json();

            return { key: elt.id, nameAction: jsonAction.action[0].name, nameReaction: jsonReaction.reaction[0].name };
          });
          const newArray = await Promise.all(promises);
          setDataActions(newArray as any)
      } catch (error) {
          console.log(error)
      }
  }


  return (
    <View style={styles.container}>
      {makeCardsAction()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
