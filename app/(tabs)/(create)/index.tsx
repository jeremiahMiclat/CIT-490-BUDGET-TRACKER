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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import DateTimePicker from 'react-native-ui-datepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { RootState, counterSlice } from '../../_layout';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';

type RootStackParamList = {
  index: undefined;
  Home: undefined;
  create: undefined;
  budgetplan: undefined;
};
type CreateScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'create',
  'budgetplan'
>;

export default function CreatePlan() {
  const dispatch = useDispatch();
  const stateData = useSelector((state: RootState) => state.data);
  const formData = useSelector((state: RootState) => state.formData);
  const [showTDPicker, setShowTDPicker] = useState(false);
  const initialTargetDateVal = dayjs().add(30, 'day');
  const [targetDateVal, setTargetDateVal] = useState(initialTargetDateVal);
  const saveData = async (data: string) => {
    await AsyncStorage.setItem('btData', data);
  };
  const navigator = useNavigation<CreateScreenNavigationProp>();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    try {
      console.log(stateData);
      saveData(JSON.stringify(stateData));
    } catch (error) {
      console.log(error);
    }
  }, [stateData]);

  const onSubmit = (data: any) => {
    const day = dayjs().format('MMMM D, YYYY h:mm:ss A');
    const targetDate = dayjs(targetDateVal);

    const dateString = targetDate.toString();
    setValue('targetDate', dateString);
    setValue('dateAdded', day);

    const updatedData = getValues();
    const newData = { ...updatedData, ...formData };
    dispatch(
      counterSlice.actions.updateData(
        // { value: [...localData.value, data] }
        stateData.value.length < 1
          ? {
              identifier:
                'Date Created: ' + dayjs().format('MMMM D, YYYY h:mm:ss A'),
              value: [...stateData.value, newData],
            }
          : {
              identifier:
                'Last Modified: ' + dayjs().format('MMMM D, YYYY h:mm:ss A'),
              value: [...stateData.value, newData],
            }
      )
    );
    dispatch(counterSlice.actions.updateFormSubmitted(true));
    reset();
    router.replace('/(tabs)/');
  };

  const handlePressOnScreen = () => {
    Keyboard.dismiss();
    setShowTDPicker(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <TouchableWithoutFeedback onPress={handlePressOnScreen}> */}
      <View style={styles.container}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <View style={styles.scrollViewContainer}>
            {/* DATE ADDED & TARGET DATE*/}
            <View style={styles.scrollViewItems}>
              <Controller
                control={control}
                name="dateAdded"
                render={() => <></>}
              />
              <Pressable onPress={() => setShowTDPicker(!showTDPicker)}>
                <Text>{dayjs(targetDateVal).format('MMMM DD, YYYY')}</Text>
              </Pressable>
              {showTDPicker && (
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <DateTimePicker
                      value={targetDateVal}
                      onValueChange={(date: any) => {
                        setTargetDateVal(date);
                        setShowTDPicker(false);
                      }}
                      mode="date"
                    />
                  )}
                  name="targetDate"
                />
              )}
              {errors.targetDate && <Text>This is required.</Text>}
            </View>
            {/* PLAN NAME*/}
            <View style={styles.scrollViewItems}>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Plan Name"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="planName"
              />

              {errors.planName && <Text>This is required.</Text>}
            </View>

            {/* DESCRIPTION*/}
            <View style={styles.scrollViewItems}>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Description"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                )}
                name="description"
              />
            </View>

            {/* INITIAL BUDGET*/}
            <View style={styles.scrollViewItems}>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Initial Budget"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    keyboardType={'number-pad'}
                  />
                )}
                name="initialBudget"
              />

              {errors.initialBudget && <Text>This is required.</Text>}
            </View>
          </View>
          <Pressable style={styles.submitBtn} onPress={handleSubmit(onSubmit)}>
            <Text style={styles.submitBtnTxt}>Submit</Text>
          </Pressable>
        </ScrollView>
      </View>
      {/* </TouchableWithoutFeedback> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContainer: {
    flex: 1,
    justifyContent: 'space-around',
  },
  scrollViewItems: {
    padding: 15,
    borderBlockColor: 'blue',
    borderWidth: 1,
    borderRadius: 5,
    margin: 20,
  },
  submitBtn: {
    backgroundColor: 'blue',
    padding: 20,
    margin: 50,
    borderRadius: 10,
  },
  submitBtnTxt: {
    color: '#ffffff',
    alignSelf: 'center',
    fontSize: 20,
  },
});
