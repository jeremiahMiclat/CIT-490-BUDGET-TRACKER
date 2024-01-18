import { Platform } from 'react-native';
import SignInScreen from '../../accountsRoute/signin';
import WebSignInScreen from '../../accountsRoute/websignin';

export default function AccountScreen() {
  return <WebSignInScreen />;
  //   Platform.OS === 'android' ? <SignInScreen /> :
}
