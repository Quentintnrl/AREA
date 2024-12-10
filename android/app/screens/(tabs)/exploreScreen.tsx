import { View, Text, StyleSheet } from 'react-native';
import Card from "../../../components/Card"

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
  const makeCardsAction = () => {
    return actions.map((data, i) => <Card key={i} data={data}/>)
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
