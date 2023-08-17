import baseApi from ".";
import REST from "../constants/Rest";
import LoginForm from "../types/LoginForm";
import RegisterForm from "../types/RegisterForm";
import Token from "../types/Token";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<Token, RegisterForm>({
      query: (body: RegisterForm) => ({
        url: `${REST.AUTH.ROOT}${REST.AUTH.REGISTER}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }),
      invalidatesTags: ["Auth"],
    }),
    refreshToken: builder.mutation<Token, string>({
      query: (refreshToken: string) => ({
        url: `${REST.AUTH.ROOT}${REST.AUTH.REFRESH_TOKEN}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: refreshToken,
      }),
      invalidatesTags: ["Auth"],
    }),
    login: builder.mutation<Token, LoginForm>({
      query: (body: LoginForm) => ({
        url: `${REST.AUTH.ROOT}${REST.AUTH.LOGIN}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useRefreshTokenMutation,
  useLoginMutation,
} = authApi;
