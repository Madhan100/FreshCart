import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { AppProvider } from './src/context/AppContext';
import RootNavigator from './src/navigation/RootNavigator';
import NotificationBanner from './src/components/NotificationBanner';

export default function App() {
  return (
    <SafeAreaProvider style={styles.container}>
      <AppProvider>
        <NavigationContainer>
          <RootNavigator />
          <NotificationBanner />
          <StatusBar style="dark" backgroundColor="#F8FAF6" />
        </NavigationContainer>
      </AppProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAF6',
  },
});
