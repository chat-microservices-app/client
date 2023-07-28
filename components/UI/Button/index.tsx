import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2f95dc",
    margin: 10,
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
  },
  onPressed: {
    opacity: 0.5,
  },
  text: {
    color: "white",
    fontWeight: "bold",
  },
});

export default function Button({
  title = "Button",
  onPress = () => {},
}: {
  title: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.onPressed]}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}
