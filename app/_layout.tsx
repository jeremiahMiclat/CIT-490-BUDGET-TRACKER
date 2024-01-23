import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { Provider, useDispatch } from 'react-redux';
import { PayloadAction, configureStore, createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DataProps } from '../data/DataProps';

const initialState = {
  data: {
    identifier: '',
    value: [],
  },
  viewing: {},
  user: {
    isLoggedIn: false,
    id: null,
    existingData: [{ fieldName: 'no data' }],
  },
  formData: { data: {}, debtInfo: { description: 'no data' } },
  formDebtInfo: { debtInfo: [{ description: 'no data', debtlogs: [] }] },
  formSchedFunds: {},
  formBillsInfo: {},
  formDailyBudget: {},
  formSubmitted: false,
  dataOnEdit: undefined,
};

export const counterSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    updateData: (state, action) => {
      state.data = action.payload;
    },
    updateViewing: (state, action) => {
      state.viewing = action.payload;
    },
    updateUser: (state, action) => {
      state.user = action.payload;
    },
    updateFormData: (state, action) => {
      state.formData = action.payload;
    },
    updateDebtInfoForm: (state, action) => {
      state.formDebtInfo = action.payload;
    },
    updateSchedFundForm: (state, action) => {
      state.formSchedFunds = action.payload;
    },
    updateBillsInfoForm: (state, action) => {
      state.formBillsInfo = action.payload;
    },
    updateDailyBudgetForm: (state, action) => {
      state.formDailyBudget = action.payload;
    },
    updateFormSubmitted: (state, action) => {
      state.formSubmitted = action.payload;
    },
    upDateDataOnEdit: (state, action) => {
      state.dataOnEdit = action.payload;
    },
  },
});

const store = configureStore({
  reducer: counterSlice.reducer,
});

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)/index',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="signin" options={{ presentation: 'modal' }} />
        <Stack.Screen name="websignin" options={{ presentation: 'modal' }} />
      </Stack>
    </Provider>
  );
}
export type RootState = ReturnType<typeof store.getState>;
