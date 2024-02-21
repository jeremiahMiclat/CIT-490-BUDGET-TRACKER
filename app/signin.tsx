import { ActivityIndicator, StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';

import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';

import React, { useEffect, useState } from 'react';
import { Button } from 'react-native';
import auth from '@react-native-firebase/auth';
import SignInComponent from '../components/SignIn';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, counterSlice } from './_layout';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import { useFocusEffect, useRouter } from 'expo-router';

GoogleSignin.configure({
  webClientId:
    '774298954456-q1pplt57a5ho93g44512jjdofr8gfkja.apps.googleusercontent.com',
});

async function onGoogleButtonPress() {
  try {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  } catch (error) {
    console.log(error);
  }
}

interface DataProps {
  planName: string;
}

export default function SignInScreen() {
  const userData = useSelector((state: RootState) => state.user);
  const localData = useSelector((state: RootState) => state.data);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // when screen is loaded
  const [dataFetched, setDataFetched] = useState(false);

  const saveData = async (data: string) => {
    await AsyncStorage.setItem('btData', data);
    setDataFetched(true);
  };

  useEffect(() => {
    saveData(JSON.stringify(localData));
  }, [localData, dataFetched]);

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
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
              userProfile: userData.userProfile,
            };
            dispatch(counterSlice.actions.updateUser(newUserData));
            setDataFetched(true); // Mark data as fetched
          }
        } catch (error) {
          // Handle error
        } finally {
          setLoading(false);
        }
      };

      fetchInitialData();
    }, [userData, dataFetched])
  );

  async function handleSignIn() {
    if (userData.isLoggedIn) {
      console.log('User already logged');
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      // Sign in user
      const res = await onGoogleButtonPress();
      let fieldData = localData as any;
      const fieldName = fieldData.identifier;

      // Save user info
      if (res && res.user && res.user.uid) {
        const uid = res.user.uid;
        const userProfile = res.additionalUserInfo?.profile;
        const userData = {
          isLoggedIn: true,
          id: uid,
          userProfile: userProfile,
        };
        dispatch(counterSlice.actions.updateUser(userData));
        await AsyncStorage.setItem('user', JSON.stringify(userData));

        // Upload existing data to cloud
        const upload = async () => {
          const todate = dayjs();
          const newFieldName =
            'Date uploaded' +
            ' - (' +
            todate.format('MMMM D, YYYY h:mm:ss A') +
            ')';
          await firestore()
            .collection('Users')
            .doc(uid)
            .set(
              { [newFieldName]: JSON.stringify(fieldData) },
              { merge: true }
            );
          console.log('Data uploaded!');
        };

        const isEmpty =
          !localData.value || Object.keys(localData.value).length === 0;
        if (localData && !isEmpty) {
          await upload();
        } else {
          console.log('no data to upload');
        }
      }

      setDataFetched(false);
      return res;
    } catch (error) {
      console.error('Error signing in:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSignOut = async () => {
    if (userData.isLoggedIn) {
      setLoading(true);
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
      } finally {
        setLoading(false);
      }
    }
  };

  const setLocalData = async (item: any) => {
    setLoading(true);
    try {
      const newValue = JSON.parse(item.value);
      const newData = {
        identifier:
          'From cloud (' + dayjs().format('MMMM D, YYYY h:mm:ss A') + ')',
        value: newValue.value,
      };
      const startTime = Date.now();

      dispatch(counterSlice.actions.updateData(newData));

      const timeElapsed = Date.now() - startTime;

      if (timeElapsed < 1000) {
        await new Promise(resolve => setTimeout(resolve, 1000 - timeElapsed));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      router.replace('/');
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
    <>
      {loading ? (
        <ActivityIndicator style={{ flex: 1, backgroundColor: '#8DA750' }} />
      ) : (
        <SignInComponent
          signIn={handleSignIn}
          signOut={handleSignOut}
          setLocal={setLocalData}
          deleteOnCloud={deleteCloudData}
        />
      )}
    </>
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
