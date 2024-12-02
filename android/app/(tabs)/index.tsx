import { Image, StyleSheet, Platform, Button, FlatList } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Axios from "axios";
import React, { useState } from "react";
import * as Network from "expo-network";


export default function HomeScreen() {
  const [users, setUsers] = useState();
  const [ip, setIp] = useState<any | null>();
  const ipAlert = async () => {
    const ip = await Network.getIpAddressAsync();
    setIp(ip);
    //alert(ip);
  };

  const getUsers = async () => {
    try {
      const config = {
        headers: {
            "Accept": 'application/json',
            //"Content-Type" : "application/json",
            "Content-Type": 'multipart/form-data',
        }
      }
      const response = await fetch(
        'http://10.84.106.223:3000/users/');
      const json = await response.json();
      console.log(json)
      //ipAlert();
      //console.log(ip)
      // const response = await Axios.get(`http://localhost:3000/users/`, config);
      // console.log("response is :", response)
      setUsers(json);
    } catch (error) {
      console.log(error)
      //return []
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.stepContainer}>
        <Button onPress={getUsers} title="Press me"></Button>
        {users != undefined && (
          <FlatList data={users} renderItem={({ item }) => <ThemedText>{item.username}</ThemedText>}></FlatList>
        )}
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12'
            })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Explore</ThemedText>
        <ThemedText>
          Tap the Explore tab to learn more about what's included in this starter app.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          When you're ready, run{' '}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
  },
});
