import { StyleSheet, View, Text } from 'react-native';
import React, { useEffect } from 'react';
import { Button } from 'react-native';
// import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
// import { auth, provider } from '../firebaseConfig';
import SignInComponent from '../components/SignIn';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WebSignInScreen() {
  // async function signIn() {
  //   let user;

  //   try {
  //     if (auth && provider) {
  //       const result = await signInWithPopup(auth, provider);

  //       // The signed-in user info.
  //       user = result.user;
  //       // IdP data available using getAdditionalUserInfo(result)
  //       // ...

  //       return user;
  //     } else {
  //       throw new Error('Authentication object is null. Unable to sign in.');
  //     }
  //   } catch (error) {
  //     // Handle Errors here.
  //     console.error('Sign-in failed:', error);
  //     throw error; // Re-throw the error for the caller to handle if needed
  //   }
  // }

  return (
    // <SignInComponent
    //   signIn={signIn}
    //   signOut={function (): Promise<void> {
    //     throw new Error('Function not implemented.');
    //   }}
    //   setLocal={undefined}
    //   deleteOnCloud={undefined}
    // />
    <SafeAreaView>
      <View>
        <Text>Accounts Page</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
