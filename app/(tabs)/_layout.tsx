import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Platform, Pressable, useColorScheme } from 'react-native';

import Colors from '../../constants/Colors';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          href: null,
          tabBarStyle: {
            display: 'none',
          },
          title: 'Budget Plans',
          headerRight: () => (
            <Link
              href={Platform.OS === 'android' ? '/signin' : '/websignin'}
              asChild
            >
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          tabBarHideOnKeyboard: true,
        }}
      />
      <Tabs.Screen
        name="dailylogs"
        options={{
          title: 'Daily Logs',
        }}
      />

      <Tabs.Screen
        name="scheduledfunds"
        options={{
          title: 'Scheduled Funds',
        }}
      />
    </Tabs>
  );
}
