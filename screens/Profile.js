import React, { useState, useEffect } from "react";
import { SafeAreaView, KeyboardAvoidingView, ScrollView, View, Text, TextInput, Image, Pressable, StyleSheet, Alert } from "react-native";
import Checkbox from "expo-checkbox";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";

import useUpdate from "../useUpdate";

import { validatePhoneNumber } from "../utils/index";

const Profile = ({ navigation }) => {
  // Add welcome screen code here.
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const [preferences, setPreferences] = useState({
    orderStatus: false,
    passwordChanges: false,
    specialOffers: false,
    newsletter: false,
  });
  const [image, setImage] = useState(null);

  useEffect(() => {
    //get username and email
    (async () => {
      try {
        const values = await AsyncStorage.multiGet(["firstname", "lastname", "email", "avatar"]);

        if (values[0][1]) {
          setFirstName(values[0][1]);
        }
        if (values[1][1]) {
          setLastName(values[1][1]);
        }
        if (values[2][1]) {
          setEmail(values[2][1]);
        }
        if (values[3][1]) {
          setImage(values[3][1]);
        }
      } catch (e) {
        Alert.alert(`An error occurred: ${e.message}`);
      }
    })();
    //get initial preferences
    (async () => {
      try {
        const values = await AsyncStorage.multiGet(Object.keys(preferences));

        const initialState = values.reduce((acc, curr) => {
          acc[curr[0]] = JSON.parse(curr[1]);
          return acc;
        }, {});
        setPreferences(initialState);
      } catch (e) {
        Alert.alert(`An error occurred: ${e.message}`);
      }
    })();
  }, []);

  useUpdate(() => {
    (async () => {
      const keyValues = Object.entries(preferences).map((entry) => {
        return [entry[0], String(entry[1])];
      });
      try {
        await AsyncStorage.multiSet(keyValues);
      } catch (e) {
        Alert.alert(`An error occurred: ${e.message}`);
      }
    })();
  }, [preferences]);

  const updateState = (key) => () =>
    setPreferences((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));

  const handlePhoneChange = (text) => {
    // Update phone state with the input
    setPhone(text);

    // Check if the input is a valid phone number
    if (validatePhoneNumber(text)) {
      setPhoneError(""); // Clear error if valid
    } else {
      setPhoneError("Invalid US number"); // Show error message if invalid
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const saveChanges = async () => {
    try {
      if (!image) {
        await AsyncStorage.removeItem("avatar");
      } else {
        AsyncStorage.setItem("avatar", image);
      }
    } catch (e) {
      Alert.alert(`An error occrred: ${e.message}`);
    }

    try {
      await AsyncStorage.multiSet([
        ["firstname", firstName],
        ["lastname", lastName],
        ["email", email],
        ["phone", phone],
      ]);
    } catch (e) {
      Alert.alert(`An error occurred: ${e.message}`);
    }
    try {
      const keys = await AsyncStorage.getAllKeys(); // Get all keys
      const result = await AsyncStorage.multiGet(keys); // Get key-value pairs
    } catch (error) {
      console.error("Error fetching data from AsyncStorage:", error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.clear();
      Alert.alert("Logout successful");
    } catch (error) {
      console.error("Error logging out:", error);
      Alert.alert("Error", "Failed to clear AsyncStorage.");
    }
    navigation.navigate("Login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.nav}>
        <Pressable style={styles.backBtn}>
          <Text style={styles.subscribeBtnText}>
            <Icon name="arrow-back" size={20} color="#fff" />
          </Text>
        </Pressable>
        <View style={styles.logo}>
          <Image style={styles.image} source={require("../assets/images/littlelemonlogo.png")} resizeMode="contain" />
          <Text style={styles.logoText}>Little lemon</Text>
        </View>
        {image ? (
          <Image source={{ uri: image }} style={styles.profileImage} resizeMode="contain" />
        ) : (
          <View style={styles.noImage}>
            <Text style={styles.sectionHeading}>
              {firstName[0]?.toLocaleUpperCase()}
              {lastName[0]?.toLocaleUpperCase()}
            </Text>
          </View>
        )}
      </View>
      <ScrollView style={styles.innerContainer}>
        <KeyboardAvoidingView behavior="position" style={styles.innerContainer}>
          <View>
            <View>
              <Text style={styles.sectionHeading}>Personal Information </Text>
            </View>
            <View style={styles.avatarSection}>
              {image ? (
                <Image source={{ uri: image }} style={styles.profileImage} resizeMode="contain" />
              ) : (
                <View style={styles.noImage}>
                  <Text style={styles.sectionHeading}>
                    {firstName[0]?.toLocaleUpperCase()}
                    {lastName[0]?.toLocaleUpperCase()}
                  </Text>
                </View>
              )}

              <Pressable style={styles.standardBtn} onPress={pickImage}>
                <Text style={styles.standardBtnText}>Change</Text>
              </Pressable>
              <Pressable style={styles.standardBtnGray} onPress={() => setImage(null)}>
                <Text style={styles.standardBtnTextGray}>Remove</Text>
              </Pressable>
            </View>

            <TextInput style={styles.input} value={firstName} placeholder={"first name"} onChangeText={setFirstName} />
            <TextInput style={styles.input} value={lastName} placeholder={"last name"} onChangeText={setLastName} />
            <TextInput style={styles.input} value={email} placeholder={"email"} keyboardType="email-address" onChangeText={setEmail} />
            <TextInput style={styles.input} value={phone} placeholder={"phone"} keyboardType="phone-pad" onChangeText={handlePhoneChange} />
            {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
          </View>
          <View>
            <View>
              <Text style={styles.sectionHeading}>Email notifications</Text>
            </View>
          </View>
          <View>
            <View style={styles.notificationPrefs}>
              <Text style={styles.formLabel}>
                <Checkbox style={styles.checkbox} value={preferences.orderStatus} onValueChange={updateState("orderStatus")} />
                Order statuses
              </Text>
              <Text style={styles.formLabel}>
                <Checkbox style={styles.checkbox} value={preferences.passwordChanges} onValueChange={updateState("passwordChanges")} />
                Password changes
              </Text>
              <Text style={styles.formLabel}>
                <Checkbox style={styles.checkbox} value={preferences.specialOffers} onValueChange={updateState("specialOffers")} />
                Special offers
              </Text>
              <Text style={styles.formLabel}>
                <Checkbox style={styles.checkbox} value={preferences.newsletter} onValueChange={updateState("newsletter")} />
                Newsletter
              </Text>
            </View>
            <View style={styles.btnGroup}>
              <Pressable style={styles.standardBtnGray}>
                <Text style={styles.standardBtnTextGray}>Discard Changes</Text>
              </Pressable>
              <Pressable style={styles.standardBtn} onPress={saveChanges}>
                <Text style={styles.standardBtnText}>Save changes</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
        <Pressable style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutBtnText}>Log out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  innerContainer: {
    marginHorizontal: 2,
    borderColor: "#edefee",
    borderWidth: 1,
    borderRadius: 22,
  },
  nav: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",

    paddingVertical: 16,
  },
  logo: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoText: {
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginTop: 5,
  },
  noImage: {
    backgroundColor: "#edefee",
    width: 75,
    height: 75,
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  grayHeadingText: {
    fontSize: 14,
    color: "gray",
  },
  checkbox: {
    marginHorizontal: 5,
  },
  backBtn: {
    backgroundColor: "#495E57",
    borderRadius: "50%",
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  btnGroup: {
    flexDirection: "row",
    justifyContent: "center",
  },
  standardBtn: {
    backgroundColor: "#495E57",
    borderRadius: 8,
    margin: 10,
    width: "auto",
    paddingHorizontal: 20,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  standardBtnGray: {
    backgroundColor: "#edefee",
    borderRadius: 0,
    margin: 10,
    width: "auto",
    paddingHorizontal: 20,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  standardBtnText: {
    color: "white",
    width: "100%",
    textAlign: "center",
  },
  standardBtnTextGray: {
    color: "black",
    width: "100%",
    textAlign: "center",
  },
  notificationPrefs: {
    marginHorizontal: 20,
  },
  formLabel: {
    fontSize: 16,
  },
  logoutBtn: {
    backgroundColor: "#F4CE14",
    borderRadius: 8,
    margin: 20,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutBtnText: {
    color: "black",
  },
  image: {
    width: 50,
    height: 50,
    margin: 12,
  },
  profileImage: {
    width: 75,
    height: 75,
    borderRadius: "50%",
    margin: 20,
  },
  input: {
    height: 40,
    backgroundColor: "#EDEFEE",
    margin: 20,
    padding: 10,
    borderRadius: 8,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 20,
    textAlign: "left",
  },
  subscribeBtn: {
    fontSize: 22,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 20,
    backgroundColor: "#004400",
    borderWidth: 2,
    borderRadius: 17,
    alignItems: "center",
    position: "relative",
    top: 50,
  },
  subscribeBtnText: {
    color: "#FFFFCC",
    fontSize: 15,
    fontWeight: "bold",
  },
});
