import { Platform, StyleSheet } from 'react-native';

import { Text, View } from '../../components/Themed';

import React, { useEffect } from 'react';
import { Button } from 'react-native';
import auth from '@react-native-firebase/auth';
import { db } from '../../firebaseConfig';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, counterSlice } from '../_layout';

interface DataProps {
  planName: string;
}

export default function HomeScreen() {
  const data = useSelector((state: RootState) => state.data);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const testData = { planName: 'test' };
        const stringedTestData = JSON.stringify(testData);
        // await AsyncStorage.removeItem('btData');
        // await AsyncStorage.setItem('btData', stringedTestData);
        const localData = await AsyncStorage.getItem('btData');
        const localUser = await AsyncStorage.getItem('user');
        if (localData) {
          console.log('local data is', localData);
          dispatch(counterSlice.actions.updateData(JSON.parse(localData)));
        }
        if (localUser) {
          const parsedUserData = JSON.parse(localUser);
          dispatch(counterSlice.actions.updateUser(parsedUserData));
        }
      } catch (error) {}
    };
    fetchInitialData();
  }, []);

  async function getTestData() {
    let data;
    if (db) {
      try {
        const testDocRef = doc(db, 'Users', 'test');
        const testDocSnap = await getDoc(testDocRef);
        data = testDocSnap.data();
      } catch (error) {
        throw new Error('Firebase firestore error');
      }
    }

    if (data) {
      return data.data;
    }
  }

  if (Platform.OS === 'web') {
    getTestData()
      .then(testData => {
        console.log(testData);
      })
      .catch(error => {
        console.error(error.message);
      });
  }
  const screenData = data as DataProps;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{screenData.planName}</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
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
