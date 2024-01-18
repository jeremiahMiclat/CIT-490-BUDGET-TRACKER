import { Platform } from 'react-native';
import CreateWebBPScreen from '../../../webComponents/create'; // for web

let CreatePlan: any;
export default function CreateBPScreen() {
  return Platform.OS === 'web' ? <CreateWebBPScreen /> : <></>;
}
