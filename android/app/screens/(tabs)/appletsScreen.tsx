import { View, Text, StyleSheet } from 'react-native';

export default function AppletTab() {
    return (
      <View style={styles.container}>
        <Text>My applet tab</Text>
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
