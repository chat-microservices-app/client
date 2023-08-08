import React from "react";
import Room from "../../types/Room";
import ChannelList from "./ChannelList";

export default function RoomsToShow({
  isRoomJoined,
  roomsJoined,
  publicRooms,
  setIsRoomJoined,
}: {
  isRoomJoined: boolean;
  setIsRoomJoined: React.Dispatch<React.SetStateAction<boolean>>;
  roomsJoined: Room[] | undefined;
  publicRooms: Room[] | undefined;
}) {
  return isRoomJoined ? (
    <ChannelList
      rooms={publicRooms ?? []}
      isRoomJoined={isRoomJoined}
      setIsRoomJoined={setIsRoomJoined}
    />
  ) : (
    <ChannelList
      rooms={roomsJoined ?? []}
      isRoomJoined={isRoomJoined}
      setIsRoomJoined={setIsRoomJoined}
    />
  );
}
