import {
  FlatList,
  GestureResponderEvent,
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
import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

type RootStackParamList = {
  Home: undefined;
  debtlogs: undefined;
};
type CreateScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'debtlogs'
>;

export default function DebtsScreen() {
  const navigator = useNavigation<CreateScreenNavigationProp>();
  const dispatch = useDispatch();
  const handleNavToLogs = () => {
    navigator.navigate('debtlogs' as any);
  };
  const dataList = useSelector((state: RootState) => state.data.value);
  const dataIdentifier = useSelector(
    (state: RootState) => state.data.identifier
  );
  const itemOnView = useSelector((state: RootState) => state.viewing);
  const logs = itemOnView;

  const [showLogs, setShowLogs] = useState<boolean[]>([]);

  const toggleLogs = (index: number) => {
    const newShowLogs = [...showLogs];
    newShowLogs[index] = !newShowLogs[index];
    setShowLogs(newShowLogs);
  };

  const toggleSaveLogs = (index: number) => {
    // saving implementaion
  };

  const renderLogs = (item: any) => {
    return (
      <View style={styles.logItemContainer}>
        <Text style={styles.logItemText}>
          {JSON.stringify(item.item.notes)}
        </Text>
        <Text style={styles.logItemText}>
          {JSON.stringify(item.item.amountPaid)}
        </Text>
        <Text style={styles.logItemText}>{JSON.stringify(item.item.date)}</Text>
      </View>
    );
  };

  const handleDeleteDebtInfo = (item: any) => {
    const updatedDebtInfo = [...(itemOnView as any).debtInfo];
    updatedDebtInfo.splice(item.index, 1);
    const updatedItemOnView = {
      ...itemOnView,
      debtInfo: updatedDebtInfo,
    };
    const itemOnViewIndex = (dataList as []).findIndex(
      (obj: any) => obj.dateAdded === (itemOnView as any).dateAdded
    );
    const upDatedDataList = [...dataList];
    (upDatedDataList as any)[itemOnViewIndex] = updatedItemOnView;
    dispatch(counterSlice.actions.updateViewing({ ...updatedItemOnView }));
    dispatch(
      counterSlice.actions.updateData({
        identifier: dataIdentifier,
        value: upDatedDataList,
      })
    );
  };

  const renderItem = (item: any) => {
    return (
      <View style={styles.flatListContainer}>
        <View style={[styles.row, styles.itemContainer]}>
          <Text>Description: </Text>
          <Text>{item.item.description + ''}</Text>
        </View>

        <View style={[styles.row, styles.itemContainer]}>
          <Text>Amount: </Text>
          <Text>{item.item.amount + ''}</Text>
        </View>

        <View style={[styles.row, styles.itemContainer]}>
          <Text>Date Incurred: </Text>
          <Text>
            {dayjs(item.item.dateIncurred).format('MMMM DD, YYYY') + ''}
          </Text>
        </View>

        <View style={[styles.row, styles.itemContainer]}>
          <Text>Due Date: </Text>
          <Text>{dayjs(item.item.dueDate).format('MMMM DD, YYYY') + ''}</Text>
        </View>

        <Pressable
          style={[styles.row, styles.itemContainer]}
          onPress={() => {
            toggleLogs(item.index);
          }}
        >
          <Text>Logs</Text>
          <Entypo name="select-arrows" size={24} color="black" />
        </Pressable>

        {showLogs[item.index] && (
          <View>
            <Link href={'/debtlogs'} asChild style={styles.addLogBtn}>
              <Pressable
                onPress={() => {
                  dispatch(
                    counterSlice.actions.upDateDataOnEdit({
                      onView: itemOnView,
                      debtInfo: item.item,
                      index: item.index,
                    })
                  );
                }}
              >
                <Ionicons name="add-circle" size={24} color="black" />
              </Pressable>
            </Link>
            <FlatList
              data={item.item.debtlogs}
              renderItem={renderLogs}
              keyExtractor={(item: any, index: any) => index}
            />
          </View>
        )}

        <Pressable
          style={styles.delDebtInfo}
          onPress={(event: GestureResponderEvent) => handleDeleteDebtInfo(item)}
        >
          <MaterialIcons name="delete" size={24} color="blue" />
        </Pressable>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <FlatList
          // style={styles.flContainer}
          // ListHeaderComponent={renderHeader}
          // ListFooterComponent={renderFLFooter}
          data={(itemOnView as any).debtInfo}
          renderItem={renderItem}
          keyExtractor={(item: any, index: any) => index}
        />
      </View>
      <View style={styles.addBtn}>
        <Link href={'/adddebtinfo'} asChild>
          <Pressable>
            <Ionicons name="add-circle" size={40} color="black" />
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  row: {
    flexDirection: 'row',
  },
  itemContainer: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'blue',
    borderRadius: 10,
  },
  itemTitle: {},
  itemText: {},
  addBtn: {
    alignSelf: 'center',
    padding: 10,
    margin: 10,
  },
  addLogBtn: {
    alignSelf: 'center',
  },
  logItemContainer: {
    padding: 10,
    margin: 10,
    borderColor: 'pink',
    borderWidth: 1,
    borderRadius: 10,
  },
  logItemText: {
    borderColor: 'pink',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    margin: 10,
  },
  flatListContainer: {
    borderColor: 'blue',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    margin: 10,
  },
  delDebtInfo: {
    alignSelf: 'center',
    padding: 10,
  },
});
