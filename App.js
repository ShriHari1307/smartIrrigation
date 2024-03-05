//import 'react-native-gesture-handler';
import React from 'react';
//import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ToggleButton from './ToggleButton2';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
    <Stack.Navigator>
      
      <Stack.Screen name="SmartIrrigation" component={ToggleButton} options={{headerShown: false}} />
    </Stack.Navigator>
  </NavigationContainer>
  );
}


