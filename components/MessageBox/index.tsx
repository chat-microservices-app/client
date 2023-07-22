import React, { useMemo } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { useGetMessagesQuery } from "../../Api/MessageApi";
import { selectAccessToken } from "../../store/reducer/AuthSlice";
import Message from "../../types/Message";

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
};

export default function MessageBox({ messageId, roomId, size }: props) {
  const token = useSelector(selectAccessToken);
  const { message } = useGetMessagesQuery(
    { page: 0, roomId, size, token },
    {
      selectFromResult: ({ data }) => ({
        message: data?.entities[messageId] as Message,
      }),
    }
  );
  const isoDate = useMemo(() => {
    const date = new Date(message.messageData.createdAt as string);
    // get the utc date and time
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  }, [message.messageData?.createdAt]);
  // use time zone offset to convert to local time
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
            uri: message.userData.pictureUrl,
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
            {message.userData.username}
          </Text>
          <Text style={{ color: "lightgray", fontSize: 15 }}>{isoDate}</Text>
        </View>
        <Text
          style={{
            color: "white",
            fontSize: 17,
          }}
          textBreakStrategy="highQuality"
          allowFontScaling
          adjustsFontSizeToFit
        >
          {message.messageData.message}
        </Text>
      </View>
    </View>
  );
}
