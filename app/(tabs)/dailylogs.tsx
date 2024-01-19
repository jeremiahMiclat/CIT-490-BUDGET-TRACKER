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

export default function DailyLogsScreen() {
  const { control, handleSubmit } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'dailylogs', // Specify the name for the field array
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Logs Screen</Text>
      <View>
        {fields.map((field, index) => (
          <View key={field.id}>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  onChangeText={text => onChange(text)}
                  value={value}
                  placeholder={`Date ${index + 1}`}
                />
              )}
              name={`dailylogs[${index}].date`}
            />

            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  onChangeText={text => onChange(text)}
                  value={value}
                  placeholder={`Amount ${index + 1}`}
                />
              )}
              name={`dailylogs[${index}].amount`}
            />

            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  onChangeText={text => onChange(text)}
                  value={value}
                  placeholder={`Description ${index + 1}`}
                />
              )}
              name={`dailylogs[${index}].description`}
            />

            <Button title="Remove" onPress={() => remove(index)} />
          </View>
        ))}
        <Button
          title="Add Expense"
          onPress={() => append({ date: '', amount: '', description: '' })}
        />
        <Button title="Submit" onPress={handleSubmit(onSubmit)} />
      </View>
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
