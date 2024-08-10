import * as React from "react";
import { View, KeyboardAvoidingView, Text, TextInput, Image, Pressable, Platform, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { validateEmail, validateName } from "../utils/index";

const OnboardingScreen = ({ navigation }) => {
  const [firstName, setFirstName] = React.useState("");

  const [email, setEmail] = React.useState("");

  const handleOnboardingCompleted = async (firstName, email) => {
    try {
      await AsyncStorage.multiSet([
        ["firstname", firstName],
        ["email", email],
      ]);
    } catch (e) {
      Alert.alert(`An error occurred: ${e.message}`);
    }
  };

  return (
    <KeyboardAvoidingView behavior="position" style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headingText}>Little lemon</Text>
        <Image style={styles.image} source={require("../assets/images/littlelemonlogo.png")} resizeMode="contain" />
      </View>
      <View>
        <Text style={styles.welcomeText}>Welcome to the little lemon </Text>
      </View>
      <TextInput style={styles.input} placeholder={"firstname"} onChangeText={setFirstName} />
      <TextInput style={styles.input} placeholder={"email"} keyboardType="email-address" onChangeText={setEmail} />

      {validateEmail(email) && validateName(firstName) ? (
        <Pressable
          style={styles.subscribeBtn}
          onPress={() => {
            handleOnboardingCompleted(firstName, email);
            Alert.alert("", "Thanks for signing up! Stay tuned!");
            navigation.navigate("Welcome");
          }}
        >
          <Text style={styles.subscribeBtnText}>Next</Text>
        </Pressable>
      ) : (
        <Pressable style={styles.subscribeBtnDisabled}>
          <Text style={styles.subscribeBtnText}>Next</Text>
        </Pressable>
      )}
    </KeyboardAvoidingView>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  headingText: {
    fontSize: 24,
    margin: 12,
    textAlign: "center",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 20,
  },
  welcomeText: {
    fontSize: 20,
    margin: 25,
    textAlign: "center",
  },
  input: {
    height: 40,
    backgroundColor: "#EDEFEE",
    margin: 20,
    padding: 10,
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
  subscribeBtnDisabled: {
    fontSize: 22,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 20,
    backgroundColor: "#cccccc",
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
