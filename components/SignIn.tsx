import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

interface SignInScreenProps {
  signIn: () => Promise<FirebaseAuthTypes.UserCredential> | any;
}

export default function SignInComponent({ signIn }: SignInScreenProps) {
  const handleSignInPress = async () => {
    try {
      const result = await signIn();

      // Log the result
      console.log('Authentication result:', result);

      // You can also access specific properties from the result
      if (result && (result.user || result.displayName)) {
        console.log(
          'User display name:',
          result.user?.displayName || result.displayName
        );
      }
    } catch (error) {
      // Handle any errors that occurred during the authentication process
      console.error('Authentication error:', error);
    }
  };

  return (
    <SafeAreaView>
      <View>
        <Pressable onPress={handleSignInPress}>
          <Text>Sign In with Google</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
