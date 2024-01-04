import { StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';

import { GoogleSignin } from '@react-native-google-signin/google-signin';

import React, { useEffect } from 'react';
import { Button } from 'react-native';
import auth from '@react-native-firebase/auth';

GoogleSignin.configure({
  webClientId:
    '774298954456-q1pplt57a5ho93g44512jjdofr8gfkja.apps.googleusercontent.com',
});

async function onGoogleButtonPress() {
  // Check if your device supports Google Play
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  // Get the users ID token
  const { idToken } = await GoogleSignin.signIn();

  // Create a Google credential with the token
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);

  // Sign-in the user with the credential
  return auth().signInWithCredential(googleCredential);
}
export default function SignInScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signin Screen</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />

      <Button
        title="Google Sign-In"
        onPress={() =>
          onGoogleButtonPress().then(() =>
            console.log('Signed in with Google!')
          )
        }
      />
    </View>
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
