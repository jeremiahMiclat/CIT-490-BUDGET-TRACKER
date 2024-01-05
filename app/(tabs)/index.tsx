import { StyleSheet } from 'react-native';

import { Text, View } from '../../components/Themed';

import React from 'react';
import { Button } from 'react-native';
import auth from '@react-native-firebase/auth';
import { db } from '../../firebaseConfig';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
export default function HomeScreen() {
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

  getTestData()
    .then(testData => {
      console.log(testData);
    })
    .catch(error => {
      console.error(error.message);
    });
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
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
