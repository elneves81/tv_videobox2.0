import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import PlayerScreen from './screens/PlayerScreen';
import KioskModeScreen from './screens/KioskModeScreen';
import SettingsScreen from './screens/SettingsScreen';
import AutoPlayScreen from './screens/AutoPlayScreen';
import { StyleSheet } from 'react-native';

const Stack = createNativeStackNavigator();

export default function App() {
  // MODO AUTOMÁTICO PARA POSTOS DE SAÚDE (descomente a linha abaixo):
  // return <AutoPlayScreen />;
  
  // Para modo kiosk tradicional nos postos, descomente a linha abaixo:
  // return <KioskModeScreen />;
  
  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor="#000" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Player" component={PlayerScreen} />
        <Stack.Screen name="Kiosk" component={KioskModeScreen} />
        <Stack.Screen name="AutoPlay" component={AutoPlayScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
