import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AppScreen from "./src/screens/App";
import QRScanner from "./src/screens/Scanner";
import QRGenerator from "./src/screens/Generator";

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="App">
        <Stack.Screen name="App" component={AppScreen} />
        <Stack.Screen name="Generator" component={QRGenerator} />
        <Stack.Screen name="Scanner" component={QRScanner} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
