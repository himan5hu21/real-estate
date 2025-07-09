import { createSlice } from "@reduxjs/toolkit";
import { isTokenExpired } from "../../utils/auth";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
  token: localStorage.getItem("token") || null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    requestStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    requestFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    requestCancelled: (state) => {
      state.loading = false;
      state.error = null;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload.user;
      state.token = action.payload.token; // Save token to localStorage
      state.loading = false;
      state.error = null;
      localStorage.setItem("token", action.payload.token); // Save token to localStorage
    },
    signUpSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload.user;
      state.loading = false;
      state.error = null;
    },
    updatePasswordSuccess: (state, action) => {
      state.currentUser = action.payload.user;
      state.loading = false;
      state.error = null;
    },
    signOutSuccess: (state) => {
      state.loading = false;
      state.error = null;
      state.currentUser = null;
      state.token = null;
      localStorage.removeItem("token");
    },
    checkTokenExpiry: (state) => {
      if (isTokenExpired(state.token)) {
        state.currentUser = null;
        state.token = null;
        localStorage.removeItem("token"); // Remove token from localStorage
      }
    },
  },
});

export const {
  requestStart,
  requestFailure,
  requestCancelled,
  signInSuccess,
  signUpSuccess,
  updateUserSuccess,
  updatePasswordSuccess,
  signOutSuccess,
  checkTokenExpiry,
} = userSlice.actions;

export default userSlice.reducer;
