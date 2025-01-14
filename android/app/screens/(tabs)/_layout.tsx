import { Tabs } from 'expo-router';
import React from 'react';

import { IconSymbol } from '@/components/ui/IconSymbol';
//import { Colors } from '@/constants/Colors';
//import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  //const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "blue"
      }}>
      <Tabs.Screen
        name="appletsScreen"
        options={{
          title: 'My applets',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="rectangle.dock" color={color} />,
        }}
      />
      <Tabs.Screen
        name="exploreScreen"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="magnifyingglass" color={color} />,
        }}
      />
      <Tabs.Screen
        name="createScreen"
        options={{
          title: 'Create',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="plus.circle" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profileScreen"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.circle" color={color} />,
        }}
      />
    </Tabs>
  );
}
