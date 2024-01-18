import { Platform } from 'react-native';
import SignInScreen from '../../accountsRoute/signin';
import WebSignInScreen from '../../webComponents/websignin';

export default function AccountScreen() {
  if (Platform.OS === 'web') {
    return <WebSignInScreen />;
  }
  if (Platform.OS === 'android') {
    return <SignInScreen />;
  }

  // return Platform.OS === 'web' ? <WebSignInScreen /> : <></>;
}
