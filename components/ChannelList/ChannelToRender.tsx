import { useRouter } from "expo-router";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Room from "../../types/Room";

const styles = StyleSheet.create({
  columnContainer: {
    display: "flex",
    backgroundColor: "#202225",
    flexDirection: "row",
    borderColor: "white",
    borderWidth: 2,
    padding: 10,
    columnGap: 20,
    width: "100%",
  },
  imageContainer: {
    alignSelf: "center",
  },
  itemText: {
    color: "white",
    fontWeight: "400",
    fontSize: 25,
    textAlign: "left",
    includeFontPadding: true,
    maxWidth: "65%",
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
});
export default function ChannelToRender({
  item,
  isRoomJoined,
  setIsRoomJoined,
  updateRoomJoined,
  roomJoined,
}: {
  item: Room;
  isRoomJoined: boolean;
  updateRoomJoined: (roomId: string) => void;
  roomJoined: string | undefined;
  setIsRoomJoined: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const router = useRouter();
  async function handleJoinRoom() {
    updateRoomJoined(item.roomId);
    router.push({
      pathname: `/channel/${item.roomId}`,
      params: { roomName: item.name },
    });
  }

  async function handleRequestJoinPublicRoom() {
    setIsRoomJoined(!isRoomJoined);
    router.push({
      params: {
        roomId: item.roomId,
      },
      pathname: `/channel/join`,
    });
  }

  const handlePressAction = isRoomJoined
    ? handleRequestJoinPublicRoom
    : handleJoinRoom;

  return (
    <Pressable
      style={[
        styles.columnContainer,
        roomJoined === item.roomId && {
          borderColor: "#7289da",
          backgroundColor: "#7289aa",
        },
      ]}
      onPress={handlePressAction}
    >
      <View style={styles.imageContainer}>
        <Image style={styles.itemImage} source={{ uri: item.pictureUrl }} />
      </View>
      <Text
        style={styles.itemText}
        textBreakStrategy="highQuality"
        lineBreakMode="tail"
      >
        {item.name}
      </Text>
    </Pressable>
  );
}
