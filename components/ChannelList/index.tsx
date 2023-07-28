import { useState } from "react";
import { StyleSheet, View } from "react-native";

import Room from "../../types/Room";
import ChannelToRender from "./ChannelToRender";

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingVertical: 10,
    gap: 10,
  },
});

export default function ChannelList({
  rooms,
  isRoomJoined,
  setIsRoomJoined,
}: {
  rooms: Room[];
  isRoomJoined: boolean;
  setIsRoomJoined: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [roomJoined, setRoomJoined] = useState<string | undefined>(undefined);
  const updateRoomJoined = (roomId: string) => {
    setRoomJoined(roomId);
  };
  return (
    <View style={styles.container}>
      {rooms.map((room) => (
        <ChannelToRender
          roomJoined={roomJoined}
          updateRoomJoined={updateRoomJoined}
          item={room}
          key={room.roomId}
          setIsRoomJoined={setIsRoomJoined}
          isRoomJoined={isRoomJoined}
        />
      ))}
    </View>
  );
}
