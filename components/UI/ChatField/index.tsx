import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Keyboard, StyleSheet, View } from "react-native";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    bottom: 0,
    padding: 5,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 45,
    height: 45,
    backgroundColor: "white",
    borderRadius: 25,
    elevation: 2,
  },
  inputFieldContainer: {
    backgroundColor: "white",
    borderRadius: 25,
    elevation: 2,
  },
  inputField: {
    fontSize: 16,
    paddingHorizontal: 10,
    height: "100%",
  },
});

export default function ChatField({
  setKeyboardVisible,
  width,
  onPress,
  isMessageSentLoading,
}: {
  onPress: (message: string) => Promise<void>;
  width: number;
  isMessageSentLoading: boolean;
  setKeyboardVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [message, setMessage] = useState<string>("");
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    // Clean up the event listeners when the component is unmounted
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  });

  return (
    <>
      <View
        style={[
          {
            width,
            borderTopColor: "#171915",
            borderWidth: 3,
            position: "absolute",
            bottom: 0,
          },
        ]}
      />
      <View style={[styles.container, { width, position: "absolute" }]}>
        <View style={[styles.inputFieldContainer, { width: width - 60 }]}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            style={styles.inputField}
            placeholder="Enter a message..."
            multiline
          />
        </View>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => {
            if (message.length === 0) return;
            onPress(message);
            setMessage("");
          }}
          disabled={isMessageSentLoading}
        >
          <Feather name="send" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </>
  );
}
