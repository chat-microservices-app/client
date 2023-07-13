import baseApi from ".";
import REST from "../constants/Rest";
import User from "../types/User";

const sessionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSession: builder.query<User, string>({
      query: (username: string) => ({
        url: `${REST.SESSION.ROOT}/${username}`,
        method: "GET",
      }),
      providesTags: ["Session"],
    }),
  }),
});

export const {
  useGetSessionQuery,
  reducer: sessionReducer,
  util: sessionUtils,
} = sessionApi;
