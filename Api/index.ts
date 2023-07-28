import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import REST from "../constants/Rest";
import type { RootState } from "../store";

const BASE_ENDPOINT = REST.BASE_URL + REST.BASE_ENDPOINT;

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_ENDPOINT,
  prepareHeaders: (headers, { getState }) => {
    // get the access token
    const token = (getState() as RootState)?.auth?.accessToken;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    headers.set("content-type", "application/json");
    headers.set("accept", "application/json");
    return headers;
  },
});

const baseApi = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["Auth", "PublicRooms", "JoinedRooms", "Messages", "Session"],
  endpoints: () => ({}),
});

export default baseApi;
