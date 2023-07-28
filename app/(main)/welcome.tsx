import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import React from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 30,
    color: "white",
    fontWeight: "900",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    minWidth: "80%",
    minHeight: 100,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
  },
});

const image = {
  uri: "https://img.freepik.com/free-vector/seamless-vector-luxury-floral-background-gray-dark_1284-47500.jpg?t=st=1689582521~exp=1689583121~hmac=f222fb2f51f2d1323f556d91e2c0771b1c420f01bad2a15106b30fa3335f3141",
};

export default function Welcome() {
  const navigation = useNavigation();
  return (
    <ImageBackground style={styles.container} source={image}>
      <Text style={styles.title}>Welcome to My Chat App</Text>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.button}
        onPress={() => {
          navigation.dispatch(DrawerActions.openDrawer());
        }}
      >
        <Text style={styles.buttonText}>Start Chatting</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}
