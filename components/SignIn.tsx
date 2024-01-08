import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, counterSlice } from '../app/_layout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserCredential } from 'firebase/auth';
import { useEffect } from 'react';

interface SignInScreenProps {
  signIn: any;
}

export default function SignInComponent({
  signIn,
  signOut,
}: SignInScreenProps & { signOut: () => Promise<void> }) {
  const userData = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const flData = userData.existingData;
  const renderItem = ({ item }: any) => (
    <Pressable style={styles.flPressable}>
      <Text>{item.fieldName}</Text>
    </Pressable>
  );
  const handleSignInPress = async () => {
    if (!userData.isLoggedIn) {
      try {
        const result = await signIn();
      } catch (error) {
        // Handle any errors that occurred during the authentication process
        console.error('Authentication error:', error);
      }
    } else {
      console.log('user already logged in');
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const renderFlatListHeader = () => (
    <View>
      <View>
        <Pressable onPress={handleSignInPress}>
          <Text>Sign In with Google</Text>
        </Pressable>
      </View>

      <View style={styles.marginTop30}>
        <Pressable onPress={handleSignOut}>
          <Text>Sign Out</Text>
        </Pressable>
      </View>

      <View style={styles.paddingTB30} />
    </View>
  );
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <FlatList
          ListHeaderComponent={renderFlatListHeader}
          data={flData}
          renderItem={renderItem}
          keyExtractor={item => item.fieldName}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  marginTop30: {
    marginTop: 30,
  },
  paddingTB30: {
    paddingTop: 30,
    paddingBottom: 30,
  },
  flPressable: {
    paddingTop: 10,
    paddingBottom: 10,
  },
});
