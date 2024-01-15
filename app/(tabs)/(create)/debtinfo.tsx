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

import { useDispatch, useSelector } from 'react-redux';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import DateTimePicker from 'react-native-ui-datepicker';
import { useEffect, useState } from 'react';
import { RootState, counterSlice } from '../../_layout';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';

export default function DebtInfoScreen() {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const formData = useSelector((state: RootState) => state.formData);
  const dispatch = useDispatch();
  const [formState, setFormState] = useState({});
  const navigation = useNavigation();
  const formIsSubmitted = useSelector(
    (state: RootState) => state.formSubmitted
  );

  const isFocused = useIsFocused();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    // Clean up listeners when component unmounts
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const {
    control,
    watch,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'debtInfo',
  });
  const watchedFields = watch();
  const onSubmit = (data: any) => {
    dispatch(counterSlice.actions.updateFormData(data));
  };

  const handlePressOnScreen = () => {
    Keyboard.dismiss();
  };

  useEffect(() => {
    if (isFocused) {
    } else {
      try {
        const a = watchedFields;
        dispatch(counterSlice.actions.updateFormData(watchedFields));
        reset({ debtInfo: a.debtInfo });
      } catch (error) {
        console.log('useEffect error');
      }
    }

    // Cleanup function (if needed)
    return () => {};
  }, [isFocused]);

  useEffect(() => {}, [formData]);

  return (
    <SafeAreaView style={styles.flex1}>
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={handlePressOnScreen}>
          <View>
            <Pressable onPress={() => append({})} style={styles.addNewBtn}>
              <Text style={styles.addNewBtnText}>Add</Text>
            </Pressable>
          </View>
        </TouchableWithoutFeedback>
        <ScrollView style={styles.sv} keyboardShouldPersistTaps="handled">
          <View style={styles.flex1}>
            {fields.map((field, index) => (
              <View key={field.id} style={styles.fields}>
                <Controller
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      onChangeText={text => onChange(text)}
                      value={value}
                      placeholder={'date'}
                      style={[styles.fieldInput]}
                    />
                  )}
                  name={`debtInfo[${index}].description`}
                />

                {/* <Controller
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      onChangeText={text => onChange(text)}
                      value={value}
                      placeholder={`Date Occured`}
                      style={styles.fieldInput}
                    />
                  )}
                  name={`debtInfo[${index}].dateOccured`}
                />

                <Controller
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      onChangeText={text => onChange(text)}
                      value={value}
                      placeholder={`Due Date`}
                      style={styles.fieldInput}
                    />
                  )}
                  name={`debtInfo[${index}].dueDate`}
                /> */}

                <Pressable
                  onPress={() => remove(index)}
                  style={styles.fieldRBtn}
                >
                  <Text style={styles.RBtnText}>Remove</Text>
                </Pressable>
              </View>
            ))}
          </View>
        </ScrollView>
        {/* {isKeyboardVisible ? null : (
          <Button title="Submit" onPress={handleSubmit(onSubmit)} />
        )} */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  addNewBtn: {
    backgroundColor: 'blue',
    padding: 20,
    alignSelf: 'center',
    borderRadius: 10,
  },
  addNewBtnText: {
    color: 'white',
  },
  fields: {
    margin: 20,
  },
  fieldInput: {
    padding: 10,
    margin: 10,
    borderColor: 'blue',
    borderWidth: 1,
    borderRadius: 10,
  },
  fieldRBtn: {
    backgroundColor: 'red',
    padding: 10,
    alignSelf: 'center',
    borderRadius: 10,
  },
  RBtnText: {
    color: 'white',
  },
  container: {
    flex: 1,
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
  sv: {
    flex: 1,
  },
  errors: {
    backgroundColor: 'red',
  },
});
