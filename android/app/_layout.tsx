import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";

import AuthStack from './navigation/AuthStack'

export default function RootLayout() {

      // <Stack>
      //   <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      // </Stack>
  return (
      <AuthStack />
  );
}
