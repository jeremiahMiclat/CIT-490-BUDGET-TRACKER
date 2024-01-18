import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm } from 'react-hook-form';

export default function CreateWebBPScreen() {
  const { handleSubmit } = useForm();
  return (
    <SafeAreaView>
      <View>
        <Text>Create Screen for WEb</Text>
      </View>
    </SafeAreaView>
  );
}
