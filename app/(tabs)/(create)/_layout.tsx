import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Platform, Pressable, useColorScheme } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Submit',
          tabBarHideOnKeyboard: true,
          headerRight: () => (
            <Link href={'/(tabs)/account'} asChild>
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
        name="dailybudget"
        options={{
          title: 'Dailies',
          tabBarHideOnKeyboard: true,
        }}
      />
      <Tabs.Screen
        name="debtinfo"
        options={{
          title: 'Debts',
          tabBarHideOnKeyboard: true,
        }}
      />
      <Tabs.Screen
        name="billsinfo"
        options={{
          title: 'Bills',
          tabBarHideOnKeyboard: true,
        }}
      />
      <Tabs.Screen
        name="sf"
        options={{
          title: 'Scheduled',
          tabBarHideOnKeyboard: true,
        }}
      />
    </Tabs>
  );
}
