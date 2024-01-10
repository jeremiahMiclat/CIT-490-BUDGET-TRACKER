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
import { RootState, counterSlice } from '../_layout';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

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
      saveData(JSON.stringify(stateData));
    } catch (error) {
      console.log(error);
    }
  }, [stateData]);

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const onSubmit = (data: any) => {
    const targetDate = dayjs(targetDateVal);

    const dateString = targetDate.toString();
    setValue('date1', dateString);
    setValue('dateAdded', dayjs().format('MMMM D, YYYY h:mm:ss A'));

    const updatedData = getValues();
    dispatch(counterSlice.actions.updateFormData(updatedData));

    dispatch(
      counterSlice.actions.updateData(
        // { value: [...localData.value, data] }
        stateData.value.length < 1
          ? {
              identifier:
                'Date Created: ' + dayjs().format('MMMM D, YYYY h:mm:ss A'),
              value: [...stateData.value, updatedData],
            }
          : {
              identifier:
                'Last Modified: ' + dayjs().format('MMMM D, YYYY h:mm:ss A'),
              value: [...stateData.value, updatedData],
            }
      )
    );
    navigator.navigate('index');
    reset();
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={handlePressOnScreen}>
        <View style={styles.container}>
          <ScrollView>
            <View>
              <Text>Create Screen</Text>

              <View>
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
                      <>
                        <DateTimePicker
                          value={targetDateVal}
                          onValueChange={(date: any) => {
                            setTargetDateVal(date);
                            setShowTDPicker(false);
                          }}
                          mode="date"
                        />
                        {errors.date1 && <Text>This is required.</Text>}
                      </>
                    )}
                    name="date1"
                  />
                )}
              </View>

              <View>
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

              <View>
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
          </ScrollView>
          <Button title="Submit" onPress={handleSubmit(onSubmit)} />
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const handlePressOnScreen = () => {
  Keyboard.dismiss();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
