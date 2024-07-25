import React from "react";
import { View, Button, SafeAreaView } from "react-native";

function App({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Button
            title="Scan QR Code"
            onPress={() => navigation.navigate("Scanner")}
          />
          <Button
            title="Generate QR Code"
            onPress={() => navigation.navigate("Generator")}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

export default App;
