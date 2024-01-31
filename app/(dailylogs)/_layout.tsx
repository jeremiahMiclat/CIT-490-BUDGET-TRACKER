import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Platform, Pressable, useColorScheme } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Colors from '../../constants/Colors';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Spent',
          tabBarHideOnKeyboard: true,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="received"
        options={{
          title: 'Received',
          tabBarHideOnKeyboard: true,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
