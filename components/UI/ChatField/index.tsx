/* eslint-disable no-param-reassign */
import { Feather } from "@expo/vector-icons";
import { useLayoutEffect } from "react";
import { Keyboard, StyleSheet, View } from "react-native";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    padding: 5,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 45,
    height: 45,
    backgroundColor: "white",
    borderRadius: 25,
    elevation: 4,
  },
  inputFieldContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 25,
    elevation: 4,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  inputField: {
    fontSize: 16,
    paddingHorizontal: 10,
    height: "100%",
    flex: 1,
  },
});

type props = {
  onPress: () => Promise<void>;
  width: number;
  isMessageSentLoading: boolean;
  setKeyboardVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  message: string;
  isEditMessage: React.MutableRefObject<string | undefined>;
  canUseChat: boolean;
};

export default function ChatField({
  setKeyboardVisible,
  width,
  onPress,
  isMessageSentLoading,
  setMessage,
  message,
  isEditMessage,
  canUseChat,
}: props) {
  useLayoutEffect(() => {
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
    <View
      style={[
        styles.container,
        {
          width,
        },
      ]}
    >
      <View style={[styles.inputFieldContainer, { width: width - 60 }]}>
        <TextInput
          enablesReturnKeyAutomatically
          value={message}
          onChangeText={setMessage}
          style={styles.inputField}
          placeholder="Enter a message..."
          multiline
          editable={canUseChat}
        />
        {isEditMessage.current && (
          <TouchableOpacity
            onPress={() => {
              isEditMessage.current = undefined;
              setMessage("");
            }}
          >
            <Feather name="delete" size={24} color="black" />
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => {
          if (message.length === 0) return;
          onPress();
          setMessage("");
        }}
        disabled={isMessageSentLoading || !canUseChat}
      >
        <Feather
          name={isEditMessage.current ? "edit" : "send"}
          size={24}
          color="black"
        />
      </TouchableOpacity>
    </View>
  );
}
