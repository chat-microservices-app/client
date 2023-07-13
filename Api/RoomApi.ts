import baseApi from ".";
import REST from "../constants/Rest";
import Room from "../types/Room";

const roomApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRooms: builder.query<
      Room[],
      { page: number; size: number; sort: string }
    >({
      query: ({ page, size, sort }) => ({
        url: REST.ROOMS.ROOT,
        method: "GET",
        params: {
          page,
          size,
          sort,
        },
      }),
      providesTags: ["Rooms"],
    }),
  }),
});

export const { useGetRoomsQuery, reducer: roomReducer } = roomApi;
