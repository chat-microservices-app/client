import { useRouter } from "expo-router";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import {
  useGetPublicRoomsQuery,
  useGetRoomsJoinedQuery,
} from "../../Api/RoomApi";
import { useGetSessionQuery } from "../../Api/SessionApi";
import { selectUsername } from "../../store/reducer/AuthSlice";
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
  roomId,
  page,
  size,
  hasUserJoinedTheRoom,
  setHasUserJoinedTheRoom,
  updateRoomJoined,
  roomJoined,
}: {
  roomId: string;
  page: number;
  size: number;
  hasUserJoinedTheRoom: boolean;
  updateRoomJoined: (id: string) => void;
  roomJoined: string | undefined;
  setHasUserJoinedTheRoom: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const username = useSelector(selectUsername);
  const { data: session } = useGetSessionQuery(username as string);
  const { room: joinedRoom } = useGetRoomsJoinedQuery(
    {
      page,
      size,
      userId: session?.userId as string,
    },
    {
      selectFromResult: ({ data }) => ({
        room: data?.entities[roomId] as Room,
      }),
    }
  );

  const { publicRoom } = useGetPublicRoomsQuery(
    {
      page,
      size,
      userId: session?.userId as string,
    },
    {
      selectFromResult: ({ data }) => ({
        publicRoom: data?.entities[roomId] as Room,
      }),
    }
  );

  async function handleJoinRoom() {
    updateRoomJoined(roomId);
    router.push({
      pathname: `/channel/${joinedRoom.roomId}`,
      params: { roomName: joinedRoom.name },
    });
  }

  async function handleRequestJoinPublicRoom() {
    setHasUserJoinedTheRoom(!hasUserJoinedTheRoom);
    router.push({
      params: {
        roomId: publicRoom.roomId,
        roomName: publicRoom.name,
      },
      pathname: `/channel/join`,
    });
  }

  const handlePressAction = hasUserJoinedTheRoom
    ? handleJoinRoom
    : handleRequestJoinPublicRoom;

  const roomToShow = hasUserJoinedTheRoom ? joinedRoom : publicRoom;

  return (
    <Pressable
      style={[
        styles.columnContainer,
        roomJoined === roomToShow?.roomId && {
          borderColor: "#7289da",
          backgroundColor: "#7289aa",
        },
      ]}
      onPress={handlePressAction}
    >
      <View style={styles.imageContainer}>
        <Image
          style={styles.itemImage}
          source={{ uri: roomToShow?.pictureUrl }}
        />
      </View>
      <Text
        style={styles.itemText}
        textBreakStrategy="highQuality"
        lineBreakMode="tail"
      >
        {roomToShow?.name}
      </Text>
    </Pressable>
  );
}
