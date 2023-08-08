import React, { memo, useMemo, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import {
  useDeleteMessageMutation,
  useGetMessagesQuery,
} from "../../Api/MessageApi";
import { useGetSessionQuery } from "../../Api/SessionApi";
import {
  selectAccessToken,
  selectUsername,
} from "../../store/reducer/AuthSlice";
import Message from "../../types/Message";
import MessageForm from "../../types/MessageForm";
import EditDeleteBox from "../UI/EditDeleteBox";

const styles = StyleSheet.create({
  messageBox: {
    flexDirection: "row",
    justifyContent: "flex-start",
    columnGap: 10,
  },
});

type props = {
  messageId: string;
  roomId: string;
  size: number;
  editMessage: (messageData: MessageForm) => void;
};

function MessageBox({ messageId, roomId, size, editMessage }: props) {
  const token = useSelector(selectAccessToken);
  const username = useSelector(selectUsername);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [deleteMessage] = useDeleteMessageMutation();
  const { data: session } = useGetSessionQuery(username);
  const { message } = useGetMessagesQuery(
    { page: 0, roomId, size, token },
    {
      selectFromResult: ({ data }) => ({
        message: data?.entities[messageId] as Message,
      }),
    }
  );

  const handleDeleteMessage = () => {
    deleteMessage({
      messageId,
      roomId,
      userId: session?.userId as string,
    });
  };

  const isoDate = useMemo(() => {
    const date = new Date(message.messageData?.createdAt as string);
    // get the utc date and time
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  }, [message.messageData?.createdAt]);

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        columnGap: 20,
        rowGap: 0,
        alignContent: "flex-start",
        paddingVertical: 10,
      }}
    >
      <View
        style={{
          alignItems: "center",
          alignSelf: "flex-start",
        }}
      >
        <Image
          source={{
            uri: message?.userData?.pictureUrl,
            width: 50,
            height: 50,
          }}
          style={{
            borderRadius: 50,
          }}
        />
      </View>
      <View
        style={{
          flex: 1,
          rowGap: 10,
        }}
      >
        <View style={styles.messageBox}>
          <Text style={{ color: "#F0F8FF", fontSize: 15 }}>
            {message?.userData?.username}
          </Text>
          <Text style={{ color: "lightgray", fontSize: 15 }}>{isoDate}</Text>
        </View>
        <Pressable
          style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
          onLongPress={() => {
            if (message?.userData.username === username) setIsVisible(true);
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 16,
              padding: 0,
            }}
            textBreakStrategy="highQuality"
            allowFontScaling
            adjustsFontSizeToFit
          >
            {message?.messageData?.message}
          </Text>
        </Pressable>
        <EditDeleteBox
          isVisible={isVisible}
          onClose={() => {
            setIsVisible(false);
          }}
          onEdit={() => {
            editMessage(message.messageData);
            setIsVisible(false);
          }}
          onDelete={handleDeleteMessage}
        />
      </View>
    </View>
  );
}

export default memo(MessageBox);
