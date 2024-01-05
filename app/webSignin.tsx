import { StyleSheet } from 'react-native';
import { Text, View } from '../components/Themed';
import React, { useEffect } from 'react';
import { Button } from 'react-native';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebaseConfig';

export default function SignInScreen() {
  function signIn() {
    if (auth && provider) {
      signInWithPopup(auth, provider)
        .then(result => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          // const credential = GoogleAuthProvider.credentialFromResult(result);
          // const token = credential.accessToken;
          // The signed-in user info.
          const user = result.user;
          // IdP data available using getAdditionalUserInfo(result)
          // ...
          console.log(user.displayName);
        })
        .catch(error => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;

          console.log(errorMessage);
        });
    } else {
      console.error('Authentication object is null. Unable to sign in.');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signin Screen</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Button title="Google Sign-In" onPress={() => signIn()} />
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
