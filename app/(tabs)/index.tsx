import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useEffect } from 'react';
import { Button } from 'react-native';
import auth from '@react-native-firebase/auth';
import { db } from '../../firebaseConfig';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, counterSlice } from '../_layout';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { uploadToFirestore } from '../../functions/androidAutoUpload';
import dayjs from 'dayjs';

type RootStackParamList = {
  Home: undefined;
  create: undefined;
  budgetplan: undefined;
};
type CreateScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'create',
  'budgetplan'
>;

interface DataProps {
  planName: string;
}

export default function HomeScreen() {
  const data = useSelector((state: RootState) => state.data);
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigator = useNavigation<CreateScreenNavigationProp>();
  const handleNavToCreate = () => {
    navigator.navigate('create');
  };
  const handleNavToBudgetPlan = () => {
    navigator.navigate('budgetplan');
  };
  const handleDeleteItem = async (index: any) => {
    try {
      const newValue = [...data.value];
      newValue.splice(index, 1);
      const newData = {
        identifier:
          'Last Modified: ' + dayjs().format('MMMM D, YYYY h:mm:ss A'),
        value: newValue,
      };
      console.log('Before dispatch:', data);
      dispatch(counterSlice.actions.updateData(newData));
      console.log('After dispatch:', data);
      await AsyncStorage.setItem('btData', JSON.stringify(newData));
      console.log('After AsyncStorage update:', data);
    } catch (error) {
      console.log(error);
    }
  };

  const renderItem = ({ item, index }: any) => (
    <View>
      <Pressable>
        <Text>{item?.planName}</Text>
        <Text>{item?.dateAdded}</Text>
      </Pressable>
      <Pressable onPress={() => handleDeleteItem(index)}>
        <Text>Delete</Text>
      </Pressable>
    </View>
  );

  useEffect(() => {
    try {
      if (Platform.OS === 'android' && user.isLoggedIn) {
        uploadToFirestore(data, user);
      }
    } catch (error) {
      console.log(error);
    }
  }, [data]);

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

  return (
    <SafeAreaProvider style={styles.container}>
      {data.value.length > 0 ? (
        <FlatList
          data={data.value}
          renderItem={renderItem}
          keyExtractor={(item: any) => item.dateAdded}
        />
      ) : (
        <></>
      )}

      <View>
        <Pressable onPress={() => handleNavToCreate()}>
          <Text>Create New Plan</Text>
        </Pressable>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
