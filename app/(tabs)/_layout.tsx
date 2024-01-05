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
          title: 'Home',
          headerRight: () => (
            <Link
              href={Platform.OS === 'android' ? '/signin' : '/webSignin'}
              asChild
            >
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
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
