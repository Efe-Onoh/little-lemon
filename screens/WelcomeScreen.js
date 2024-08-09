import * as React from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";

const WelcomeScreen = ({ navigation }) => {
  // Add welcome screen code here.
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Image style={styles.image} source={require("../assets/images/littlelemonlogo.png")} resizeMode="contain" />
        <Text style={styles.welcomeText}>Little Lemon, your local mediterranean bistro</Text>
      </View>
      <Pressable style={styles.subscribeBtn} onPress={() => navigation.navigate("Profile")}>
        <Text style={styles.subscribeBtnText}>Profile</Text>
      </Pressable>
    </View>
  );
};

export default WelcomeScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  innerContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 20,
    margin: 50,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    margin: 50,
    textAlign: "center",
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
