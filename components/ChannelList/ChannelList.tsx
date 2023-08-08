import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { EntityId } from "@reduxjs/toolkit";
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
  hasUserJoinedTheRoom,
  setHasUserJoinedTheRoom,
  page,
  size,
}: {
  rooms: EntityId[];
  hasUserJoinedTheRoom: boolean;
  setHasUserJoinedTheRoom: React.Dispatch<React.SetStateAction<boolean>>;
  page: number;
  size: number;
}) {
  const [roomJoined, setRoomJoined] = useState<string | undefined>(undefined);
  const updateRoomJoined = (roomId: string) => {
    setRoomJoined(roomId);
  };
  return (
    <View style={styles.container}>
      {rooms.map((id) => (
        <ChannelToRender
          roomJoined={roomJoined}
          page={page}
          size={size}
          updateRoomJoined={updateRoomJoined}
          roomId={id as string}
          key={id}
          setHasUserJoinedTheRoom={setHasUserJoinedTheRoom}
          hasUserJoinedTheRoom={hasUserJoinedTheRoom}
        />
      ))}
    </View>
  );
}
