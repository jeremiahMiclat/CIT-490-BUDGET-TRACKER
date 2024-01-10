import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Platform, Pressable, useColorScheme } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Create Screen',
          tabBarHideOnKeyboard: true,
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
        name="sf"
        options={{
          title: 'Scheduled Funds',
        }}
      />
    </Tabs>
  );
}
