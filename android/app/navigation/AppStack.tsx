import { Stack } from "expo-router";

export default function AppStack() {
    return (
        <Stack screenOptions={{headerShown: false}} >
          <Stack.Screen name="screens/(tabs)" />
        </Stack>
    );
};