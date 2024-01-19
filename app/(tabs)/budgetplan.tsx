import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootState, counterSlice } from '../_layout';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

interface ItemType {
  planName: string;
  dailyBudgetInfo: { description: string }[];
  dateAdded: string;
  description: string;
  initialBudget: string;
  targetDate: string;
}

export default function BudgetPlanScreen() {
  const itemOnView = useSelector((state: RootState) => state.viewing);
  const planName = (itemOnView as ItemType).planName;
  const dateAdded = (itemOnView as ItemType).dateAdded;
  const description = (itemOnView as ItemType).description;
  const initialBudget = (itemOnView as ItemType).initialBudget;
  const targetDate = (itemOnView as ItemType).targetDate;

  return (
    <SafeAreaView>
      <View>
        <Text>{planName}</Text>
        <Text>{description}</Text>
        <Text>{initialBudget}</Text>
        <Text>{dayjs(targetDate).format('MMMM DD, YYYY')}</Text>
      </View>
    </SafeAreaView>
  );
}
