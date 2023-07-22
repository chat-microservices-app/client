import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import { useSendMessageMutation } from "../../../Api/MessageApi";
import { useGetSessionQuery } from "../../../Api/SessionApi";
import MessageBox from "../../../components/MessageBox";
import ChatField from "../../../components/UI/ChatField";
import useMessageData from "../../../hooks/useMessageData";
import { selectUsername } from "../../../store/reducer/AuthSlice";

const styles = StyleSheet.create({
  boxContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
});

export default function Channel() {
  const { id } = useLocalSearchParams();
  const { width, height } = useWindowDimensions();
  const [keyboardVisible, setKeyboardVisible] = useState<boolean>(false);
  const username = useSelector(selectUsername);
  const { data: session } = useGetSessionQuery(username);
  const [sendMessage, { isLoading: isMessageSentLoading }] =
    useSendMessageMutation();
  const {
    handleLoadMoreMessages,
    messageList,
    isLoading,
    isGetMoreMessagesLoading,
  } = useMessageData({ id: id as string });

  const handleSendMessage = async (message: string): Promise<void> => {
    sendMessage({
      roomId: id as string,
      message: {
        message,
        userId: session?.userId as string,
        roomId: id as string,
      },
    });
  };

  if (isLoading) {
    return (
      <ScrollView
        overScrollMode="always"
        bounces
        automaticallyAdjustContentInsets
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={{
          flex: 1,
        }}
      >
        <ImageBackground
          source={{
            uri: "https://img.freepik.com/free-vector/seamless-vector-luxury-floral-background-gray-dark_1284-47500.jpg?t=st=1689582521~exp=1689583121~hmac=f222fb2f51f2d1323f556d91e2c0771b1c420f01bad2a15106b30fa3335f3141",
          }}
          style={{ flex: 1, opacity: 0.5 }}
        />
        <ActivityIndicator size="large" color="#00ff00" />
      </ScrollView>
    );
  }

  return (
    <ImageBackground
      source={{
        uri: "https://img.freepik.com/free-vector/seamless-vector-luxury-floral-background-gray-dark_1284-47500.jpg?t=st=1689582521~exp=1689583121~hmac=f222fb2f51f2d1323f556d91e2c0771b1c420f01bad2a15106b30fa3335f3141",
      }}
      style={[styles.boxContainer]}
    >
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 10,
          maxHeight: height - 134,
        }}
      >
        <FlatList
          inverted
          centerContent
          alwaysBounceVertical
          bounces
          onEndReached={() => {
            if (isLoading || isGetMoreMessagesLoading) return;
            handleLoadMoreMessages();
          }}
          onEndReachedThreshold={0.01}
          ListFooterComponent={() =>
            isGetMoreMessagesLoading || isLoading ? (
              <ActivityIndicator size="large" color="#00ff00" />
            ) : null
          }
          style={[keyboardVisible && { marginBottom: height / 15 }]}
          data={(messageList?.ids as string[]) || []}
          renderItem={({ item }) => (
            <MessageBox
              messageId={item}
              size={messageList.size}
              roomId={id as string}
            />
          )}
          keyExtractor={(item: string) => item}
        />
      </View>
      <ChatField
        setKeyboardVisible={setKeyboardVisible}
        width={width}
        isMessageSentLoading={isMessageSentLoading}
        onPress={handleSendMessage}
      />
    </ImageBackground>
  );
}
