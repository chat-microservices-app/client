/* eslint-disable react/require-default-props */
import React from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";

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
  disabled: {
    backgroundColor: "gray",
  },
});

export default function Button({
  title = "Button",
  onPress = () => {},
  style = {},
  disableButton = false,
}: {
  title: string;
  disableButton?: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      disabled={disableButton}
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.onPressed,
        style,
        disableButton && styles.disabled,
      ]}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}
