import { StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';

import { GoogleSignin } from '@react-native-google-signin/google-signin';

import React, { useEffect } from 'react';
import { Button } from 'react-native';
import auth from '@react-native-firebase/auth';
import SignInComponent from '../components/SignIn';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, counterSlice } from './_layout';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';

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

interface DataProps {
  planName: string;
}

export default function SignInScreen() {
  const userData = useSelector((state: RootState) => state.user);
  const localData = useSelector((state: RootState) => state.data);
  const dispatch = useDispatch();
  let flData;
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const localUser = await AsyncStorage.getItem('user');
        if (localUser) {
          const parsedUserData = JSON.parse(localUser);
          dispatch(counterSlice.actions.updateUser(parsedUserData));
          flData = userData.existingData;
          console.log('fldata is', flData);
        }
      } catch (error) {}
    };
    fetchInitialData();
  }, []);

  async function handleSignIn() {
    const res = await onGoogleButtonPress();
    let fieldData = localData as DataProps;
    const fieldName = fieldData.planName;

    if (res && res.user && res.user.uid) {
      const uid = res.user.uid;

      const fsUserData = await firestore().collection('Users').doc(uid).get();
      const uData = fsUserData.data();
      const userObj = uData as {};
      const userObjLen = Object.keys(userObj).length;
      const transformedData = Object.entries(uData as {}).map(
        ([fieldName, value]) => ({
          fieldName,
          value,
        })
      );
      let userData = {
        isLoggedIn: true,
        id: uid,
        existingData: transformedData as [],
      };

      // upload when no data on cloud
      if (userObjLen == 0 && Object.keys(localData).length > 0) {
        firestore()
          .collection('Users')
          .doc(uid)
          .set({
            [fieldName]: JSON.stringify(localData),
          })
          .then(() => {
            console.log('User added!');
          });
      }

      // download all existing data in cloud
      if (userObjLen > 0 && Object.keys(localData).length === 0) {
        dispatch(counterSlice.actions.updateUser(userData));
        await AsyncStorage.setItem('user', JSON.stringify(userData));
      }

      // upload existing to cloud
      if (userObjLen > 0 && Object.keys(localData).length > 0) {
        const todate = dayjs();
        const newFieldName =
          fieldName + ' - (' + todate.format('MMMM D, YYYY h:mm:ss A') + ')';
        firestore()
          .collection('Users')
          .doc(uid)
          .set({ [newFieldName]: JSON.stringify(fieldData) }, { merge: true })
          .then(() => {
            console.log('User updated!');
          });

        const fsUserDataUpdated = await firestore()
          .collection('Users')
          .doc(uid)
          .get();
        const uDataUpdated = fsUserDataUpdated.data();
        const transformedDataUpdated = Object.entries(uDataUpdated as {}).map(
          ([fieldName, value]) => ({
            fieldName,
            value,
          })
        );
        let userDataUpdated = {
          isLoggedIn: true,
          id: uid,
          existingData: transformedDataUpdated as [],
        };
        dispatch(counterSlice.actions.updateUser(userDataUpdated));
        await AsyncStorage.setItem('user', JSON.stringify(userDataUpdated));
      }
    }
    return res;
  }

  const handleSignOut = async () => {
    if (userData.isLoggedIn) {
      const newUserData = {
        isLoggedIn: false,
        id: null,
        existingData: [{ fieldName: 'no data' }],
      };
      dispatch(counterSlice.actions.updateUser(newUserData));
      const jsonValue = JSON.stringify(newUserData);
      await AsyncStorage.setItem('user', jsonValue);
      await auth()
        .signOut()
        .then(() => console.log('User signed out!'));
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    }
  };

  return <SignInComponent signIn={handleSignIn} signOut={handleSignOut} />;
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
