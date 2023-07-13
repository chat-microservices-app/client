import baseApi from ".";
import Token from "../types/Token";
import RegisterForm from "../types/RegisterForm";
import LoginForm from "../types/LoginForm";
import REST from "../constants/Rest";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<Token, RegisterForm>({
      query: (body: RegisterForm) => ({
        url: `${REST.AUTH.ROOT}${REST.AUTH.REGISTER}}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),
    refreshToken: builder.mutation<Token, string>({
      query: (refreshToken: string) => ({
        url: `${REST.AUTH.ROOT}${REST.AUTH.REFRESH_TOKEN}`,
        method: "POST",
        body: { refreshToken },
      }),
      invalidatesTags: ["Auth"],
    }),
    login: builder.mutation<Token, LoginForm>({
      query: (body: LoginForm) => ({
        url: `${REST.AUTH.ROOT}${REST.AUTH.LOGIN}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useRefreshTokenMutation,
  useLoginMutation,
  reducer: authReducer,
} = authApi;
