import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

type props = {
  isVisible: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

const styles = StyleSheet.create({
  messageBox: {
    flexDirection: "row",
    justifyContent: "flex-start",
    columnGap: 10,
  },
  container: {
    right: 10,
    top: 10,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    flexDirection: "row",
  },
  option: {
    padding: 5,
  },
  closeButton: {
    marginLeft: 10,
    backgroundColor: "red",
    padding: 5,
    borderRadius: 5,
  },
});

export default function EditDeleteBox({
  isVisible,
  onClose,
  onEdit,
  onDelete,
}: props) {
  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.option} onPress={onEdit}>
        <Text>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={onDelete}>
        <Text>Delete</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={{ color: "white" }}>Close</Text>
      </TouchableOpacity>
    </View>
  );
}
