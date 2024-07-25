import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  Clipboard,
  Platform,
  PermissionsAndroid,
  ToastAndroid,
  Share,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
// import ViewShot from "react-native-view-shot";
// import FastImage from "react-native-fast-image";
// import RNGallery from "react-native-gallery";
// import RNFetchBlob from "react-native-fetch-blob";

const QRGenerator = () => {
  const [inputLink, setInputLink] = useState("");
  const [qrCodeValue, setQRCodeValue] = useState("");
  const [qrCodeRef, setQrCodeRef] = useState(null);

  const generateQRCode = () => {
    if (!inputLink) {
      alert("Please enter a link to generate a QR code.");
      return;
    }
    setQRCodeValue(inputLink);
  };

  const copyToClipboard = () => {
    // console.log("input link:", inputLink);
    if (inputLink) {
      Clipboard.setString(inputLink);
      alert("Link copied to clipboard!");
    } else {
      alert("Please enter a link to copy.");
    }
  };

  const saveQRCodeToGallery = () => {
    // Get the QR code image as a data URL.
    // const qrcodeDataURL = QRCode.generateDataURL(inputLink);

    // // Save the QR code image to the gallery.
    // ViewShot.capture().then((uri) => {
    //   CameraRoll.saveImage(uri, {
    //     title: "QR Code",
    //   });
    // });

    try {
      qrCodeRef.toDataURL((data) => {
        // const path =
        //   RNFetchBlob.fs.dirs.DownloadDir +
        //   `/${inputLink
        //     .replace("http", "")
        //     .replace("https", "")
        //     .replace("://", "a")
        //     .replace(".", "_")
        //     .slice(0, 20)}.png`;
        // // console.log("path:", path);
        // console.log("path:");
      });
    } catch (error) {
      alert("Could not save QR");
    }
  };

  const saveQrToDisk = async (item) => {
    if (Platform.OS === "android" && !(await hasAndroidPermission())) {
      console.log("failed");
      return;
    }
    console.log("after if", qrCodeRef.current); 
    if (qrCodeRef && qrCodeRef.current) {
      console.log("qrCodeRef available:", qrCodeRef);
      const qrCodeImage = await qrCodeRef.current.toImage();
      const uri = qrCodeImage.uri;
      console.log("2 consts");

      // Save the QR code image to the device's local storage.
      const blob = await RNFetchBlob.saveFile(uri);
      const localPath = blob.uri;
      console.log("all consts");

      alert("QR code saved to local storage!");
      // Save the image to the gallery.
      RNGallery.saveImageToGallery(localPath, (err) => {
        console.log("in saving to gallery");
        if (err) {
          alert(err);
        } else {
          alert("QR code saved to gallery!");
        }
      });
    } else {
      console.error("qrCodeRef is not defined or not properly initialized");
    }

    // if (productQRref) {
    //   productQRref.toDataURL((data) => {
    //     let filePath = RNFS.CachesDirectoryPath + `/${item.name}.png`;
    //     RNFS.writeFile(filePath, data, "base64")
    //       .then((success) => {
    //         // return CameraRoll.save(filePath, "photo");
    //         return FastImage.saveImage(filePath, (err, uri) => {
    //           if (err) {
    //             console.log(err);
    //             alert(err);
    //           } else {
    //             console.log("Image saved to gallery:", uri);
    //             alert("Image saved successfully saved");
    //           }
    //         });
    //       })
    //       .then(() => {
    //         ToastAndroid.show("QRCode saved to gallery", ToastAndroid.LONG);
    //       });
    //   });
    // }
  };
  const hasAndroidPermission = async () => {
    try {
      console.log("in persions");
      const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
      console.log("permisions");
      const granted = await PermissionsAndroid.request(permission);
      console.log("granted");

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Permission granted");
        return true;
      } else {
        console.log("Permission denied");
        return false;
      }
    } catch (error) {
      console.error("Error requesting permission:", error);
      return false;
    }
  };

  async function load() {
    if (!!qrCodeValue) {
      try {
        const image = await fetch(qrCodeValue);
        const imageBlob = await image.blob();
        const bURL = URL.createObjectURL(imageBlob);
        const anchor = document.createElement("a");
        anchor.href = bURL;
        anchor.target = "_blank";
        anchor.download = "qr.png";

        // Auto click on a element, trigger the file download
        anchor.click();

        // This is required
        URL.revokeObjectURL(bURL);
      } catch (err) {
        console.log(err);
      }
    }
  }

  const shareQRCode = () => {
    qrCodeRef.toDataURL((dataURL) => {
      let shareImageBase64 = {
        title: "React Native",
        url: `data:image/png;base64,${dataURL}`,
        subject: "Share Link", //  for email
      };
      const message = `Check out this QR code:\n${inputLink}`;
      Share.share({
        title: shareImageBase64.title,
        message: message,
        url: shareImageBase64.url,
      })
        .then((result) => {
          if (result.action === Share.sharedAction) {
            if (result.activityType) {
              // Shared with activity type of result.activityType
            } else {
              // Shared
              console.log("shared esle");
            }
          } else if (result.action === Share.dismissedAction) {
            alert("unable to share");
            console.log("Dismissed");
            // Dismissed
          }
        })
        .catch((error) => console.log(error));
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <TextInput
        style={{
          width: 300,
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 20,
          paddingHorizontal: 10,
        }}
        placeholder="Enter a link"
        value={inputLink}
        onChangeText={(text) => setInputLink(text)}
      />
      <TouchableOpacity
        style={{
          width: "50%",
          height: 40,
          borderColor: "gray",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "blue",
          borderWidth: 1,
          marginBottom: 20,
          paddingHorizontal: 10,
        }}
        onPress={generateQRCode}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          Generate QR Code
        </Text>
      </TouchableOpacity>
      {qrCodeValue ? (
        <>
          <QRCode
            value={qrCodeValue}
            size={200}
            color="black"
            backgroundColor="white"
            getRef={(ref) => setQrCodeRef(ref)}
          />
          <View
            style={{
              color: "white",
              fontWeight: "bold",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyItems: "center",
            }}
          >
            <TouchableOpacity onPress={copyToClipboard}>
              <Text>Copy Link</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={shareQRCode}>
              <Text>share Link</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                saveQrToDisk();
              }}
            >
              <Text style={styles.save}>Save to Gallery</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : null}
    </View>
  );
};

export default QRGenerator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  button: {
    borderRadius: 30,
    padding: 15,
    position: "relative",
    bottom: 0,
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    marginBottom: 30,
    color: "#fff",
    backgroundColor: "#273746",
  },

  save: {
    color: "#fff",
    fontSize: 16,
    textTransform: "capitalize",
  },
});
