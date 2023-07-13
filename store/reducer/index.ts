import { combineReducers } from "@reduxjs/toolkit";
import { authReducer } from "../../Api/AuthApi";
import { sessionReducer } from "../../Api/SessionApi";
import { messageReducer } from "../../Api/MessageApi";
import { roomReducer } from "../../Api/RoomApi";
import baseApi from "../../Api";

const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  auth: authReducer,
  session: sessionReducer,
  message: messageReducer,
  room: roomReducer,
});

export default rootReducer;
