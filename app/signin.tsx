import { StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';

import { GoogleSignin } from '@react-native-google-signin/google-signin';

import React, { useEffect, useState } from 'react';
import { Button } from 'react-native';
import auth from '@react-native-firebase/auth';
import SignInComponent from '../components/SignIn';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, counterSlice } from './_layout';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import { useFocusEffect } from 'expo-router';

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
  let cloudUserData;

  // when screen is loaded
  const [dataFetched, setDataFetched] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const fetchInitialData = async () => {
        try {
          if (userData && userData.id && !dataFetched) {
            const cloudUserData = (
              await firestore().collection('Users').doc(userData.id).get()
            ).data();
            const transformedData = Object.entries(cloudUserData as {}).map(
              ([fieldName, value]) => ({
                fieldName,
                value,
              })
            );
            let newUserData = {
              isLoggedIn: true,
              id: userData.id,
              existingData: transformedData as [],
            };
            dispatch(counterSlice.actions.updateUser(newUserData));
            setDataFetched(true); // Mark data as fetched
          }
        } catch (error) {
          // Handle error
        }
      };

      fetchInitialData();
    }, [userData, dataFetched])
  );
  async function handleSignIn() {
    if (userData.isLoggedIn) {
      console.log('User already logged');
    }
    if (userData.isLoggedIn === false) {
      //sign in user
      const res = await onGoogleButtonPress();
      let fieldData = localData as DataProps;
      const fieldName = fieldData.planName;

      // save user info starts
      if (res && res.user && res.user.uid) {
        const uid = res.user.uid;
        const userData = {
          isLoggedIn: true,
          id: uid,
        };
        dispatch(counterSlice.actions.updateUser(userData));
        await AsyncStorage.setItem('user', JSON.stringify(userData));

        // end of saving user info

        // upload existing to cloud

        const todate = dayjs();
        const newFieldName =
          fieldName + ' - (' + todate.format('MMMM D, YYYY h:mm:ss A') + ')';
        firestore()
          .collection('Users')
          .doc(uid)
          .set({ [newFieldName]: JSON.stringify(fieldData) }, { merge: true })
          .then(() => {
            console.log('Data uploaded!');
          });
      }
      setDataFetched(false);
      return res;
    }
  }

  const handleSignOut = async () => {
    if (userData.isLoggedIn) {
      try {
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
      } catch (error) {
        console.log(error);
      }
    }
  };

  const setLocalData = async (item: any) => {
    try {
      const parsedVal = JSON.parse(item.value);
      console.log('parsedUserData', parsedVal);
      dispatch(counterSlice.actions.updateData(parsedVal));
      await AsyncStorage.setItem('btData', item.value);
    } catch (error) {
      console.log('no data or invalid data');
    }
  };

  const deleteCloudData = async (itemToDelete: any) => {
    const collectionName = 'Users';
    const documentId = userData.id as unknown as string;
    const fieldName = itemToDelete.fieldName;

    if (userData.isLoggedIn) {
      try {
        const documentRef = firestore()
          .collection(collectionName)
          .doc(documentId);

        // Use update method to remove the field
        await documentRef.update({
          [fieldName]: firestore.FieldValue.delete(),
        });
        setDataFetched(false);
        console.log('Field deleted successfully.');
      } catch (error) {
        console.error('Error deleting field:', error);
      }
    }
  };

  return (
    <SignInComponent
      signIn={handleSignIn}
      signOut={handleSignOut}
      setLocal={setLocalData}
      deleteOnCloud={deleteCloudData}
    />
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
