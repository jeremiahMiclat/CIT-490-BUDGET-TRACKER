import {
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
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
import { useDispatch, useSelector } from 'react-redux';
import { RootState, counterSlice } from '../_layout';
import dayjs from 'dayjs';
import { useEffect } from 'react';

export default function CreatePlan() {
  const dispatch = useDispatch();
  const stateData = useSelector((state: RootState) => state.data);

  const saveData = async (data: string) => {
    await AsyncStorage.setItem('btData', data);
  };

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

  const onSubmit = (data: any) => {
    const lmValue =
      'Last modified: ' + dayjs().format('MMMM D, YYYY h:mm:ss A');
    setValue('dateAdded', dayjs().format('MMMM D, YYYY h:mm:ss A'));
    const updatedData = getValues();
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
    reset();
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={handlePressOnScreen}>
        <View style={styles.container}>
          <ScrollView>
            <View>
              <Text>Create Screen</Text>
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

              <Controller
                control={control}
                name="dateAdded"
                render={() => <></>}
              />
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
