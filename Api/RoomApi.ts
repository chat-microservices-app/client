import baseApi from ".";
import REST from "../constants/Rest";
import Room from "../types/Room";
import RoomForm from "../types/RoomForm";
import { RoomPagination } from "../types/RoomPagination";

const roomApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
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
      providesTags: (result) =>
        result
          ? [
              // Provides a tag for each post in the current page,
              // as well as the 'PARTIAL-LIST' tag.
              ...result.rooms.map(({ roomId }) => ({
                type: "Rooms" as const,
                id: roomId,
              })),
              { type: "Rooms", id: "PARTIAL-LIST" },
            ]
          : [{ type: "Rooms", id: "PARTIAL-LIST" }],
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
        { type: "Rooms", id: "PARTIAL-LIST" },
        { type: "Rooms", roomId },
      ],
    }),
  }),
});

export const { useGetRoomsQuery, useCreateRoomMutation } = roomApi;
