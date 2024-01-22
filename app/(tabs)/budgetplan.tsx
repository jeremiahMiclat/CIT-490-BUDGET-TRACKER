import {
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootState, counterSlice } from '../_layout';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import DateTimePicker from 'react-native-ui-datepicker';

interface ItemType {
  planName: string;
  dailyBudgetInfo: { description: string }[];
  dateAdded: string;
  description: string;
  initialBudget: string;
  targetDate: string;
}

export default function BudgetPlanScreen() {
  const appData = useSelector((state: RootState) => state.data);
  const itemOnView = useSelector((state: RootState) => state.viewing);
  const planName = (itemOnView as ItemType).planName;
  const dateAdded = (itemOnView as ItemType).dateAdded;
  const description = (itemOnView as ItemType).description;
  const initialBudget = (itemOnView as ItemType).initialBudget;
  const targetDate = (itemOnView as ItemType).targetDate;
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  // edit plan name
  const [planNameOnEdit, setPlanNameOnEdit] = useState(false);
  const [editedPlanName, setEditedPlanName] = useState(
    (itemOnView as ItemType).planName
  );

  const handleSavePlanName = () => {
    const currData = appData;

    const updatedItemOnView = {
      ...itemOnView,
      planName: editedPlanName,
    };

    const indexToUpdate = currData.value.findIndex(
      item => (item as any).dateAdded === (itemOnView as any).dateAdded
    );

    if (indexToUpdate !== -1) {
      const updatedValue = [...currData.value];
      (updatedValue as any)[indexToUpdate] = updatedItemOnView;

      const newData = {
        identifier: currData.identifier,
        value: updatedValue,
      };

      dispatch(counterSlice.actions.updateData(newData));
      dispatch(
        counterSlice.actions.updateViewing((updatedValue as any)[indexToUpdate])
      );
      setPlanNameOnEdit(false);
    } else {
      console.error('save error');
    }
  };

  // edit description
  const [descriptionOnEdit, setDescriptionOnEdit] = useState(false);
  const [editedDesc, setEditedDesc] = useState(
    (itemOnView as ItemType).description
  );

  const handleSaveDesc = () => {
    const currData = appData;

    const updatedItemOnView = {
      ...itemOnView,
      description: editedDesc,
    };

    const indexToUpdate = currData.value.findIndex(
      item => (item as any).dateAdded === (itemOnView as any).dateAdded
    );

    if (indexToUpdate !== -1) {
      const updatedValue = [...currData.value];
      (updatedValue as any)[indexToUpdate] = updatedItemOnView;

      const newData = {
        identifier: currData.identifier,
        value: updatedValue,
      };

      dispatch(counterSlice.actions.updateData(newData));
      dispatch(
        counterSlice.actions.updateViewing((updatedValue as any)[indexToUpdate])
      );
      setDescriptionOnEdit(false);
    } else {
      console.error('save error');
    }
  };

  // edit initial budget
  const [ibOnEdit, setIbOnedit] = useState(false);
  const [editedIb, setEditedIb] = useState(
    (itemOnView as ItemType).description
  );

  const handleSaveIb = () => {
    const currData = appData;

    const updatedItemOnView = {
      ...itemOnView,
      initialBudget: editedIb,
    };

    const indexToUpdate = currData.value.findIndex(
      item => (item as any).dateAdded === (itemOnView as any).dateAdded
    );

    if (indexToUpdate !== -1) {
      const updatedValue = [...currData.value];
      (updatedValue as any)[indexToUpdate] = updatedItemOnView;

      const newData = {
        identifier: currData.identifier,
        value: updatedValue,
      };

      dispatch(counterSlice.actions.updateData(newData));
      dispatch(
        counterSlice.actions.updateViewing((updatedValue as any)[indexToUpdate])
      );
      setIbOnedit(false);
    } else {
      console.error('save error');
    }
  };

  // edit target date
  const [targetDateOnEdit, setTargetDateOnEdit] = useState(false);
  const [editedTargetDate, setEditedTargetDate] = useState(
    (itemOnView as ItemType).targetDate
  );
  const handleSaveTargetDate = () => {
    const currData = appData;
    const updatedItemOnView = {
      ...itemOnView,
      targetDate: editedTargetDate,
    };

    const indexToUpdate = currData.value.findIndex(
      item => (item as any).dateAdded === (itemOnView as any).dateAdded
    );

    if (indexToUpdate !== -1) {
      const updatedValue = [...currData.value];
      (updatedValue as any)[indexToUpdate] = updatedItemOnView;

      const newData = {
        identifier: currData.identifier,
        value: updatedValue,
      };

      dispatch(counterSlice.actions.updateData(newData));
      dispatch(
        counterSlice.actions.updateViewing((updatedValue as any)[indexToUpdate])
      );

      setTargetDateOnEdit(false);
    } else {
      console.error('save error');
    }
  };

  useEffect(() => {
    handleSaveTargetDate();
  }, [editedTargetDate]);

  // edits code ends
  const handleScreenPress = () => {
    Keyboard.dismiss();
    setPlanNameOnEdit(false);
    setDescriptionOnEdit(false);
    setIbOnedit(false);
    setTargetDateOnEdit(false);
  };

  useEffect(() => {
    if (!isFocused) {
      setPlanNameOnEdit(false);
      setDescriptionOnEdit(false);
      setIbOnedit(false);
      setTargetDateOnEdit(false);
    }
    return () => {};
  }, [isFocused]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setTargetDateOnEdit(false);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {}
    );

    // Clean up listeners when component unmounts
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* <TouchableWithoutFeedback onPress={handleScreenPress}> */}
      <ScrollView>
        <Pressable style={styles.container} onPress={handleScreenPress}>
          <View style={styles.itemContainer}>
            <Text style={styles.item}>Plan Name</Text>
            {planNameOnEdit != true ? (
              <View style={[styles.row, styles.item]}>
                <Text style={styles.item}>{planName}</Text>
                <Feather
                  name="edit"
                  size={24}
                  color="black"
                  onPress={() => {
                    setEditedPlanName(planName);
                    setPlanNameOnEdit(true);
                  }}
                />
              </View>
            ) : (
              <View
                style={[styles.row, styles.item, styles.itemInputContainer]}
              >
                <TextInput
                  style={[styles.item, styles.itemInput]}
                  value={editedPlanName}
                  placeholder="Set Plan Name"
                  onChangeText={value => setEditedPlanName(value)}
                />
                <AntDesign
                  name="checkcircle"
                  size={24}
                  color="green"
                  onPress={handleSavePlanName}
                />
              </View>
            )}
          </View>
          <View style={styles.itemContainer}>
            <Text style={styles.item}>Description</Text>
            {descriptionOnEdit != true ? (
              <View style={[styles.row, styles.item]}>
                <Text style={styles.item}>{description}</Text>
                <Feather
                  name="edit"
                  size={24}
                  color="black"
                  onPress={() => {
                    setEditedDesc(description);
                    setDescriptionOnEdit(true);
                  }}
                />
              </View>
            ) : (
              <View
                style={[styles.row, styles.item, styles.itemInputContainer]}
              >
                <TextInput
                  style={[styles.item, styles.itemInput]}
                  value={editedDesc}
                  placeholder="Set Description"
                  onChangeText={value => setEditedDesc(value)}
                />
                <AntDesign
                  name="checkcircle"
                  size={24}
                  color="green"
                  onPress={handleSaveDesc}
                />
              </View>
            )}
          </View>
          <View style={styles.itemContainer}>
            <Text style={styles.item}>Initial Budget</Text>
            {ibOnEdit != true ? (
              <View style={[styles.row, styles.item]}>
                <Text style={styles.item}>{initialBudget}</Text>
                <Feather
                  name="edit"
                  size={24}
                  color="black"
                  onPress={() => {
                    setEditedIb(initialBudget);
                    setIbOnedit(true);
                  }}
                />
              </View>
            ) : (
              <View
                style={[styles.row, styles.item, styles.itemInputContainer]}
              >
                <TextInput
                  style={[styles.item, styles.itemInput]}
                  value={editedIb}
                  placeholder="Set Initial Budget"
                  keyboardType={'number-pad'}
                  onChangeText={value => setEditedIb(value)}
                />
                <AntDesign
                  name="checkcircle"
                  size={24}
                  color="green"
                  onPress={() => {
                    handleSaveIb();
                  }}
                />
              </View>
            )}
          </View>
          <View style={styles.itemContainer}>
            <Text style={styles.item}>Target Date</Text>

            {targetDateOnEdit ? (
              <DateTimePicker
                value={editedTargetDate}
                onValueChange={(date: any) => {
                  setEditedTargetDate(date);
                  setTargetDateOnEdit(false);
                }}
                mode="date"
              />
            ) : (
              <View style={[styles.row, styles.item]}>
                <Text style={styles.item}>
                  {dayjs(targetDate).format('MMMM DD, YYYY')}
                </Text>
                <Feather
                  name="edit"
                  size={24}
                  color="black"
                  onPress={() => {
                    setTargetDateOnEdit(true);
                    // setEditedTargetDate(dayjs(targetDate));
                  }}
                />
              </View>
            )}
          </View>
        </Pressable>
      </ScrollView>
      {/* </TouchableWithoutFeedback> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  itemContainer: {
    flexDirection: 'row',
    margin: 10,
    padding: 10,
    borderColor: 'blue',
    borderWidth: 1,
    borderRadius: 10,
  },
  item: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  itemInput: {
    color: 'gray',
  },
  itemInputContainer: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'pink',
    padding: 5,
  },
});