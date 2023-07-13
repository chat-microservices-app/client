import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import REST from "../constants/Rest";

const BASE_ENDPOINT = REST.BASE_URL + REST.BASE_ENDPOINT;

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_ENDPOINT,
  headers: {
    "Content-Type": "application/json",
    credentials: "include",
  },
});

const baseApi = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["Auth", "Rooms", "Messages", "Session"],
  endpoints: () => ({}),
});

export default baseApi;
