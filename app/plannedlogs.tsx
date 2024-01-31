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
import { RootState, counterSlice } from './_layout';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { Link, useRouter } from 'expo-router';
import Restart from 'react-native-restart';
import { router } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
type RootStackParamList = {
  Home: undefined;
  debts: undefined;
};
type CreateScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'debts'
>;

export default function AddPlannedLogsScreen() {
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
  const dataIdentifier = useSelector(
    (state: RootState) => state.data.identifier
  );
  const dataList = useSelector((state: RootState) => state.data.value);
  const itemOnView = useSelector((state: RootState) => state.viewing);
  const dataOnEdit = useSelector((state: RootState) => state.dataOnEdit);

  const dispatch = useDispatch();

  const navigator = useNavigation<CreateScreenNavigationProp>();
  const handleNavToLogs = () => {
    navigator.navigate('debts' as any);
  };

  const appData = useSelector((state: RootState) => state.data);
  const [appDataValue, setAppDataValue] = useState(appData.value as any);

  const onSubmit = (data: any) => {
    const plannedBudgetInfoItem = (itemOnView as any).plannedBudgetInfo;
    const plannedInfoIndex = (dataOnEdit as any).index;
    const plannedInfoItemOnEdit = (dataOnEdit as any).plannedBudgetInfo;

    const newPlannedInfoOnEdit = {
      ...plannedInfoItemOnEdit,
      plannedLogs: [...plannedInfoItemOnEdit.plannedLogs, data],
    };

    const newPbInfoItems = [...plannedBudgetInfoItem];
    newPbInfoItems[plannedInfoIndex] = newPlannedInfoOnEdit;

    const newItemOnView = {
      ...itemOnView,
      plannedBudgetInfo: newPbInfoItems,
    };

    dispatch(counterSlice.actions.updateViewing({ ...newItemOnView }));

    const itemOnViewIndex = (dataList as []).findIndex(
      (obj: any) => obj.dateAdded === (itemOnView as any).dateAdded
    );
    const newDataList = [...dataList];

    (newDataList as any)[itemOnViewIndex] = newItemOnView;
    console.log(newDataList);
    dispatch(
      counterSlice.actions.updateData({
        identifier: dataIdentifier,
        value: newDataList,
      })
    );
  };
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.controllerContainer}>
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
        </View>
        <View style={styles.controllerContainer}>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Amount"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType={'number-pad'}
              />
            )}
            name="amount"
          />
        </View>

        <View style={styles.controllerContainer}>
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
        <Link href={'/(tabs)/plannedbudget'} asChild style={styles.subtmitBtn}>
          <Pressable
            onPress={() => {
              setValue('date', date.toString());
              setValue('dateAdded', dayjs().toString());
              handleSubmit(onSubmit)();
            }}
          >
            <AntDesign name="checkcircle" size={50} color="green" />
          </Pressable>
        </Link>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  controllerContainer: {
    borderColor: 'blue',
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    margin: 10,
  },
  subtmitBtn: {
    alignSelf: 'center',
    padding: 10,
    margin: 50,
  },
});
