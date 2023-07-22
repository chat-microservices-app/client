/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";
import Token from "../../types/Token";

const initialState: Token = {
  accessToken: "",
  refreshToken: "",
  username: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state: Token, action) => {
      const { accessToken, refreshToken, username } = action.payload;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.username = username;
    },
    logout: (state: Token) => {
      state.accessToken = "";
      state.refreshToken = "";
      state.username = "";
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;

export const selectAccessToken = (state: { auth: Token }) =>
  state.auth.accessToken;

export const selectRefreshToken = (state: { auth: Token }) =>
  state.auth.refreshToken;

export const selectUsername = (state: { auth: Token }) => state.auth.username;
