import {
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import DateTimePicker from 'react-native-ui-datepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { RootState, counterSlice } from '../_layout';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { Link, useRouter } from 'expo-router';
import Restart from 'react-native-restart';
import { router } from 'expo-router';

type RootStackParamList = {
  Home: undefined;
  debts: undefined;
};
type CreateScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'debts'
>;

export default function AddDebtLogScreen() {
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm();
  const [showDTPicker, setShowDTPicker] = useState(false);
  const [date, setDate] = useState(dayjs());
  const dataList = useSelector((state: RootState) => state.data.value);
  const itemOnView = useSelector((state: RootState) => state.viewing);
  const dataOnEdit = useSelector((state: RootState) => state.dataOnEdit);
  const [debtlogs, setdebtLogs] = useState(
    (dataOnEdit as any).debtInfo.debtlogs
  );
  const [updatedItem, setUpdatedItem] = useState((dataOnEdit as any).debtInfo);
  const [updatedDebtInfo, setUpdatedInfo] = useState(
    (itemOnView as any).debtInfo
  );
  const dispatch = useDispatch();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigator = useNavigation<CreateScreenNavigationProp>();
  const handleNavToLogs = () => {
    navigator.navigate('debts' as any);
  };

  const appData = useSelector((state: RootState) => state.data);
  const [appDataValue, setAppDataValue] = useState(appData.value as any);
  const replaceObjectAtIndex2 = (index: any, newObject: any) => {
    setAppDataValue((prevList: any) => {
      // Create a new array with the replaced object
      const newList = [...prevList];
      newList[index] = newObject;
      return newList;
    });
  };

  const replaceObjectAtIndex = (index: any, newObject: any) => {
    setUpdatedInfo((prevList: any) => {
      // Create a new array with the replaced object
      const newList = [...prevList];
      newList[index] = newObject;
      return newList;
    });
  };

  useEffect(() => {
    setUpdatedItem({
      ...updatedItem,
      debtlogs: debtlogs,
    });

    reset();
    handleNavToLogs();
  }, [debtlogs]);

  useEffect(() => {
    replaceObjectAtIndex((dataOnEdit as any).index, updatedItem);
  }, [updatedItem]);

  useEffect(() => {
    dispatch(
      counterSlice.actions.updateViewing({
        ...itemOnView,
        debtInfo: updatedDebtInfo,
      })
    );
  }, [updatedDebtInfo]);

  useEffect(() => {
    setIsSubmitted(true);
  }, [itemOnView]);

  useEffect(() => {
    const index = (appData.value as []).findIndex(
      (obj: any) => obj.dateAdded == (itemOnView as any).dateAdded
    );

    replaceObjectAtIndex2(index, itemOnView);
    setIsSubmitted(false);
  }, [isSubmitted]);

  useEffect(() => {
    dispatch(
      counterSlice.actions.updateData({
        data: appData.identifier,
        value: appDataValue,
      })
    );
  }, [appDataValue]);

  const onSubmit = (data: any) => {
    try {
      const day = dayjs().format('MMMM D, YYYY h:mm:ss A');
      const inputDate = dayjs(date);
      const dateString = date.toString();

      setValue('date', dateString);
      setValue('dateAdded', day);

      const dataToAdd = getValues();

      setdebtLogs([...debtlogs, dataToAdd]);
    } catch (error) {
      console.error('An error occurred:', error);
      // Handle errors here
    }
  };
  return (
    <SafeAreaView>
      <ScrollView>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Notes"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="notes"
        />
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Amount Paid"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType={'number-pad'}
            />
          )}
          name="amountPaid"
        />

        <View>
          <Controller control={control} name="date" render={() => <></>} />
          <Pressable onPress={() => setShowDTPicker(!showDTPicker)}>
            <Text>{'Date:        ' + dayjs(date).format('MMMM DD, YYYY')}</Text>
          </Pressable>
          {showDTPicker && (
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <DateTimePicker
                  value={date}
                  onValueChange={(date: any) => {
                    setDate(date);
                    setShowDTPicker(false);
                  }}
                  mode="date"
                />
              )}
              name="date"
            />
          )}
        </View>

        <Pressable onPress={handleSubmit(onSubmit)}>
          <Text>Submit</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
