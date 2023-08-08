import { useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import {
  useEditMessageMutation,
  useSendMessageMutation,
} from "../../../Api/MessageApi";
import { useGetSessionQuery } from "../../../Api/SessionApi";
import MessageBox from "../../../components/MessageBox";
import ChatField from "../../../components/UI/ChatField";
import useMessageData from "../../../hooks/useMessageData";
import Drawer from "../../../navigation/Drawer";
import { selectUsername } from "../../../store/reducer/AuthSlice";
import MessageForm from "../../../types/MessageForm";

const styles = StyleSheet.create({
  boxContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    gap: 0,
  },
});

const image = {
  uri: "https://img.freepik.com/free-vector/seamless-vector-luxury-floral-background-gray-dark_1284-47500.jpg?t=st=1689582521~exp=1689583121~hmac=f222fb2f51f2d1323f556d91e2c0771b1c420f01bad2a15106b30fa3335f3141",
};

export default function Channel() {
  const { id, roomName } = useLocalSearchParams();
  const { width, height } = useWindowDimensions();
  const isEditMessage = useRef<string | undefined>(undefined);
  const [message, setMessage] = useState<string>("");
  const [keyboardVisible, setKeyboardVisible] = useState<boolean>(false);
  const username = useSelector(selectUsername);
  const { data: session } = useGetSessionQuery(username);
  const [sendMessage, { isLoading: isMessageSentLoading }] =
    useSendMessageMutation();
  const [editMessage, { isLoading: isMessageEditLoading }] =
    useEditMessageMutation();
  const {
    handleLoadMoreMessages,
    messageList,
    isLoading,
    isGetMoreMessagesLoading,
  } = useMessageData({ id: id as string });

  const handleSendMessage = async (): Promise<void> => {
    if (isEditMessage.current) {
      const messageData: MessageForm = {
        message,
        roomId: id as string,
        userId: session?.userId as string,
        messageId: isEditMessage.current,
      };
      editMessage({
        roomId: messageData.roomId,
        messageId: messageData?.messageId as string,
        message: messageData,
      });
      isEditMessage.current = undefined;
      return;
    }
    sendMessage({
      roomId: id as string,
      message: {
        message,
        userId: session?.userId as string,
        roomId: id as string,
      },
    });
  };

  const handleEditMessage = (messageData: MessageForm) => {
    isEditMessage.current = messageData.messageId;
    setMessage(messageData.message);
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
        <ImageBackground source={image} style={{ flex: 1, opacity: 0.5 }} />
        <ActivityIndicator size="large" color="#00ff00" />
      </ScrollView>
    );
  }
  const messageUpdates = isMessageEditLoading || isMessageSentLoading;

  return (
    <ImageBackground source={image} style={[styles.boxContainer]}>
      <Drawer.Screen
        options={{ title: `${roomName}`, headerTitle: `${roomName}` }}
      />
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 5,
          paddingBottom: height * 0.075,
          height:
            Platform.OS === "ios" && keyboardVisible ? height * 0.4 : "100%",
        }}
      >
        <FlatList
          inverted
          scrollToOverflowEnabled
          centerContent
          alwaysBounceVertical
          bounces
          onEndReached={() => {
            if (isLoading || isGetMoreMessagesLoading) return;
            handleLoadMoreMessages();
          }}
          onEndReachedThreshold={0.03}
          contentContainerStyle={{
            rowGap: 3,
          }}
          ListFooterComponent={() =>
            isGetMoreMessagesLoading ||
            messageList.totalPages !== messageList.page + 1 ? (
              <ActivityIndicator size="large" color="#00ff00" />
            ) : (
              <View
                style={{
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ fontSize: 20, fontWeight: "400", color: "gray" }}
                >
                  Reach the end of the messages
                </Text>
              </View>
            )
          }
          data={(messageList?.ids as string[]) || []}
          renderItem={({ item }) => (
            <MessageBox
              editMessage={handleEditMessage}
              messageId={item}
              size={messageList.size}
              roomId={id as string}
            />
          )}
          keyExtractor={(item: string) => item}
        />
      </View>

      <View
        style={{
          position: "absolute",
          bottom: 0,
          height:
            Platform.OS === "ios" && keyboardVisible ? height * 0.443 : "auto",
        }}
      >
        <ChatField
          canUseChat={messageList?.canUseChat as boolean}
          isEditMessage={isEditMessage}
          setMessage={setMessage}
          message={message}
          setKeyboardVisible={setKeyboardVisible}
          width={width}
          isMessageSentLoading={messageUpdates}
          onPress={handleSendMessage}
        />
      </View>
    </ImageBackground>
  );
}
