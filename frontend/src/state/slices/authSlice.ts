import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AddPostAction,
  AuthUser,
  SetAuthAction,
  SetErrorAction,
} from "../interfaces";

interface AuthInitialState {
  error: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  authUser: AuthUser | null;
  role: "user";
}

const initialState: AuthInitialState = {
  error: null,
  isAuthenticated: false,
  loading: false,
  authUser: null,
  role: "user",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    LOADING_AUTH: (state) => {
      state.loading = true;
      state.error = null;
    },

    LOGIN_USER: (state, { payload }: PayloadAction<SetAuthAction>) => {
      state.loading = false;
      state.error = null;
      state.isAuthenticated = true;
      state.authUser = payload.authUser;
    },

    SET_ERROR_AUTH: (state, { payload }: PayloadAction<SetErrorAction>) => {
      state.error = payload.error;
      state.isAuthenticated = false;
      state.loading = false;
      state.authUser = null;
    },

    RESET_ERROR: (state) => {
      state.error = null;
    },

    LOGOUT_USER: (state) => {
      state.authUser = null;
      state.error = null;
      state.isAuthenticated = false;
      state.loading = false;
    },

    ADD_POST_AUTH_USER: (state, { payload }: PayloadAction<AddPostAction>) => {
      state.error = null;
      state.isAuthenticated = true;
      state.loading = false;
      state.role = "user";
      if (state.authUser) {
        state.authUser.posts = [...state.authUser?.posts, payload.post];
      }
    },
  },
});

export const {
  LOADING_AUTH,
  LOGIN_USER,
  LOGOUT_USER,
  RESET_ERROR,
  SET_ERROR_AUTH,
  ADD_POST_AUTH_USER,
} = authSlice.actions;
