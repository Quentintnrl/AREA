import { View, Text, StyleSheet } from 'react-native';

export default function ExploreTab() {
  return (
    <View style={styles.container}>
      <Text>Tab Explore</Text>
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
