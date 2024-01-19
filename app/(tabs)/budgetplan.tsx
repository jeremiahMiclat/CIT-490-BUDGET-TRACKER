import { StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootState, counterSlice } from '../_layout';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
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
                  setPlanNameOnEdit(true);
                }}
              />
            </View>
          ) : (
            <View style={[styles.row, styles.item]}>
              <TextInput
                style={styles.item}
                value={editedPlanName}
                placeholder="Set Plan Name"
                onChangeText={value => setEditedPlanName(value)}
              />
              <AntDesign
                name="checkcircle"
                size={24}
                color="black"
                onPress={handleSavePlanName}
              />
            </View>
          )}
        </View>
        <View style={styles.itemContainer}>
          <Text style={styles.item}>Description</Text>
          <Text style={styles.item}>{description}</Text>
          <Feather name="edit" size={24} color="black" />
        </View>
        <View style={styles.itemContainer}>
          <Text style={styles.item}>Initial Budget</Text>
          <Text style={styles.item}>{initialBudget}</Text>
          <Feather name="edit" size={24} color="black" />
        </View>
        <View style={styles.itemContainer}>
          <Text style={styles.item}>Target Date</Text>
          <Text style={styles.item}>
            {dayjs(targetDate).format('MMMM DD, YYYY')}
          </Text>
          <Feather name="edit" size={24} color="black" />
        </View>
      </View>
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
});
