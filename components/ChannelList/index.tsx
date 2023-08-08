import React from "react";
import { RoomState } from "../../types/Room";
import ChannelList from "./ChannelList";

export default function RoomsToShow({
  hasUserJoinedTheRoom,
  roomsJoined,
  publicRooms,
  setHasUserJoinedTheRoom,
  page,
  size,
}: {
  hasUserJoinedTheRoom: boolean;
  setHasUserJoinedTheRoom: React.Dispatch<React.SetStateAction<boolean>>;
  roomsJoined: RoomState | undefined;
  publicRooms: RoomState | undefined;
  page: number;
  size: number;
}) {
  return hasUserJoinedTheRoom ? (
    <ChannelList
      rooms={roomsJoined?.ids ?? []}
      hasUserJoinedTheRoom={hasUserJoinedTheRoom}
      setHasUserJoinedTheRoom={setHasUserJoinedTheRoom}
      page={page}
      size={size}
    />
  ) : (
    <ChannelList
      rooms={publicRooms?.ids ?? []}
      hasUserJoinedTheRoom={hasUserJoinedTheRoom}
      setHasUserJoinedTheRoom={setHasUserJoinedTheRoom}
      page={page}
      size={size}
    />
  );
}
