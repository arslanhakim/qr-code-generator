import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, Clipboard } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";

const QRScanner = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState("Not Yet Scanned");

  const askForCameraPermission = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status == "granted");
  };

  useEffect(() => {
    askForCameraPermission();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setText(data);
  };

  const handleRescan = () => {
    setScanned(false);
    setText("Not Yet Scanned");
  };

  const handleCopyLink = async () => {
    await Clipboard.setString(text);
    alert("Link copied to clipboard!");
  };

  return (
    <View style={styles.container}>
      {scanned ? (
        <View style={styles.barcodeResult}>
          <Text style={styles.mainText}>{text}</Text>
          <View style={styles.buttonContainer}>
            <Button title="Copy Link" onPress={handleCopyLink} />
            <View style={{ margin: 10 }} />
            <Button title="Rescan" onPress={handleRescan} />
          </View>
          <Button title="Back" onPress={() => navigation.goBack()} />
        </View>
      ) : (
        <View style={styles.barcodebox}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={{ height: 400, width: 400 }}
          />
        </View>
      )}
    </View>
  );
};

export default QRScanner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  barcodebox: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: 30,
    backgroundColor: "tomato",
    width: "100%",
    height: "100%",
  },

  barcodeResult: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  mainText: {
    fontSize: 16,
    margin: 20,
  },

  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
