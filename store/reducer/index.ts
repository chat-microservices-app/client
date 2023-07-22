import { combineReducers } from "@reduxjs/toolkit";
import baseApi from "../../Api";
import authReducer from "./AuthSlice";

const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  auth: authReducer,
});

export default rootReducer;
