import { EntityState } from "@reduxjs/toolkit";

export default interface Room {
  roomId: string;
  name: string;
  pictureUrl: string;
}

export interface RoomState extends EntityState<Room> {
  page: number;
  numberOfElements: number;
  size: number;
  totalPages: number;
}
