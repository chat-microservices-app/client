import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2f95dc",
    padding: 8,
    minWidth: "100%",
    alignItems: "center",
    borderRadius: 5,
  },
  onPress: {
    backgroundColor: "#2f95dd",
    opacity: 0.5,
    borderRadius: 5,
  },
  textItem: {
    fontSize: 15,
    color: "white",
    fontWeight: "bold",
  },
});
// create a new button to click on to create a channel
export default function CreateChannelButton() {
  const router = useRouter();
  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.onPress]}
      onPress={() => {
        router.push("/channel/create");
      }}
    >
      <Text style={styles.textItem}>Create Channel</Text>
      <Ionicons name="add" size={50} color="white" />
    </Pressable>
  );
}
