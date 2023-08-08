import { createEntityAdapter } from "@reduxjs/toolkit";
import baseApi from ".";
import REST from "../constants/Rest";
import Room, { RoomState } from "../types/Room";
import RoomForm from "../types/RoomForm";
import { RoomPagination } from "../types/RoomPagination";

const roomAdapter = createEntityAdapter<Room>({
  selectId: (room) => room.roomId as string,
});

const initialState = roomAdapter.getInitialState({
  page: 0,
  numberOfElements: 0,
  size: 0,
  totalPages: 0,
});

const roomApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRoomsJoined: builder.query<
      RoomState,
      { page: number; size: number; userId: string }
    >({
      query: ({ page, size, userId }) => ({
        url: `${REST.ROOMS.ROOT}${REST.ROOMS.JOIN}/${userId}`,
        method: "GET",
        params: {
          page,
          size,
        },
      }),
      transformResponse: (apiResponse) => {
        const { content, totalPages, number, size, numberOfElements } =
          apiResponse as RoomPagination;

        return roomAdapter.upsertMany(
          { ...initialState, totalPages, page: number, numberOfElements, size },
          content
        );
      },
      providesTags: (result) =>
        result
          ? [
              ...result.ids.map((id) => ({
                type: "JoinedRooms" as const,
                id,
              })),
              { type: "JoinedRooms", id: "PARTIAL-LIST" },
            ]
          : [{ type: "JoinedRooms", id: "PARTIAL-LIST" }],
    }),
    getPublicRooms: builder.query<
      RoomState,
      { page: number; size: number; userId: string }
    >({
      query: ({ page, size, userId }) => ({
        url: `${REST.ROOMS.ROOT}${REST.ROOMS.PUBLIC}/${userId}`,
        method: "GET",
        params: {
          page,
          size,
        },
      }),
      transformResponse: (apiResponse) => {
        const { content, totalPages, number, size, numberOfElements } =
          apiResponse as RoomPagination;
        initialState.page = number;
        initialState.size = size;
        initialState.totalPages = totalPages;
        initialState.numberOfElements = numberOfElements;

        return roomAdapter.upsertMany(
          { ...initialState, totalPages, page: number, numberOfElements, size },
          content
        );
      },
      providesTags: (result) =>
        result
          ? [
              ...result.ids.map((id) => ({
                type: "PublicRooms" as const,
                id,
              })),
              { type: "PublicRooms", id: "PARTIAL-LIST" },
            ]
          : [{ type: "PublicRooms", id: "PARTIAL-LIST" }],
    }),
    getRooms: builder.query<
      { rooms: Room[]; size: number; totalPages: number; page: number },
      { page: number; size: number }
    >({
      query: ({ page, size }) => ({
        url: REST.ROOMS.ROOT,
        method: "GET",
        params: {
          page,
          size,
        },
      }),
      transformResponse: (apiResponse) => {
        const { content, totalPages, number, size } =
          apiResponse as RoomPagination;
        return {
          rooms: content,
          totalPages,
          page: number,
          size,
        };
      },
    }),
    createRoom: builder.mutation<string, RoomForm>({
      query: (body: RoomForm) => ({
        url: REST.ROOMS.ROOT,
        method: "POST",
        body: JSON.stringify(body),
      }),
      transformResponse: (apiResponse, meta) =>
        meta?.response?.headers.get("Location")?.split("/").pop() ?? "",
      invalidatesTags: (result, error, roomId) => [
        { type: "JoinedRooms", id: "PARTIAL-LIST" },
        { type: "JoinedRooms", roomId },
      ],
    }),
    joinRoom: builder.mutation<void, { roomId: string; userId: string }>({
      query: ({ roomId, userId }) => ({
        url: `${REST.ROOMS.ROOT}/${roomId}${REST.ROOMS.JOIN}`,
        method: "PUT",
        params: {
          userId,
        },
      }),
      invalidatesTags: (result, error, roomId) => [
        { type: "PublicRooms", id: "PARTIAL-LIST" },
        { type: "PublicRooms", roomId },
        { type: "JoinedRooms", id: "PARTIAL-LIST" },
        { type: "JoinedRooms", roomId },
      ],
    }),
  }),
});

export const {
  useGetRoomsQuery,
  useCreateRoomMutation,
  useLazyGetRoomsJoinedQuery,
  useLazyGetPublicRoomsQuery,
  useGetRoomsJoinedQuery,
  useGetPublicRoomsQuery,
  useJoinRoomMutation,
} = roomApi;
