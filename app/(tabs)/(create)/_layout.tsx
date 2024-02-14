import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Platform, Pressable, useColorScheme } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: '#537B2F',
        },
        headerTintColor: '#DCEDC8',
        tabBarStyle: {
          backgroundColor: '#537B2F',
        },
        tabBarActiveTintColor: '#003300',
        tabBarInactiveTintColor: '#eaf7da',
        tabBarActiveBackgroundColor: '#eaf7da',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Submit',
          tabBarHideOnKeyboard: true,
          headerRight: () => (
            <Link href={'/(tabs)/'} asChild>
              <Pressable>
                {({ pressed }) => (
                  <MaterialCommunityIcons
                    name="home"
                    size={24}
                    color="#eaf7da"
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="plannedbudgetinfo"
        options={{
          title: 'Planned Budget',
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
