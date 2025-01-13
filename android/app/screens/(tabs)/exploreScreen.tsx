import { View, Text, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react'
import Card from "../../../components/Card"
import config from "../../../config"

const actions = [
  {
    id: 1,
    name: 'Add songs you like on Spotify to a specific playlist',
  },
  {
    id: 2,
    name: 'Play a song on Spotify',
  }
]

export default function ExploreTab() {
  const [dataActions, setDataActions] = useState([]);

  const makeCardsAction = () => {
    console.log(dataActions)
    if (dataActions.length === 0) {
      return <Text>No AREAs found</Text>
    }
    return dataActions.map((data, i) => <Card key={i} data={data}/>)
  }

  useEffect(() => {
    const getAREAs = async() => {
        let newArray = [] as any
        try {
            const response = await fetch('http://' + config.IP + ':8080/getAREAs/')
            const json = await response.json();
            json.forEach((elt: any) => {
                console.log(elt)
                newArray.push({key: elt.id, value: elt.name})
            });
            setDataActions(newArray)
        } catch (error) {
            console.log(error)
        }
    }
    getAREAs();
}, [])


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
