import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, counterSlice } from '../app/_layout';

interface SignInScreenProps {
  signIn: any;
}

export default function SignInComponent({
  signIn,
  signOut,
  setLocal,
  deleteOnCloud,
}: SignInScreenProps & { signOut: () => Promise<void> } & { setLocal: any } & {
  deleteOnCloud: any;
}) {
  const userData = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const flData = userData.existingData;
  const renderItem = ({ item }: any) => (
    <View style={styles.itemContainer}>
      <Pressable style={styles.flPressable} onPress={() => setLocal(item)}>
        <Text>{item.fieldName}</Text>
      </Pressable>
      <Pressable style={styles.flPressable} onPress={() => deleteOnCloud(item)}>
        <Text>Delete</Text>
      </Pressable>
    </View>
  );
  const handleSignInPress = async () => {
    if (!userData.isLoggedIn) {
      try {
        const result = await signIn();
      } catch (error) {
        // Handle any errors that occurred during the authentication process
        console.error('Authentication error:', error);
      }
    } else {
      console.log('user already logged in');
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const renderFlatListHeader = () => (
    <View>
      <View>
        <Pressable onPress={handleSignInPress} style={styles.signInBtn}>
          <Text>Sign In with Google</Text>
        </Pressable>
      </View>

      <View>
        <Pressable onPress={handleSignOut} style={styles.signOutBtn}>
          <Text>Sign Out</Text>
        </Pressable>
      </View>

      <View style={styles.paddingTB30} />
    </View>
  );
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <FlatList
          ListHeaderComponent={renderFlatListHeader}
          data={flData}
          renderItem={renderItem}
          keyExtractor={item => item.fieldName}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  marginTop30: {
    marginTop: 30,
  },
  paddingTB30: {
    paddingTop: 30,
    paddingBottom: 30,
  },
  flPressable: {
    padding: 20,
    backgroundColor: 'red',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signInBtn: {
    padding: 30,
    backgroundColor: 'lightblue',
  },
  signOutBtn: {
    padding: 30,
    backgroundColor: 'lightblue',
    marginTop: 20,
  },
});
