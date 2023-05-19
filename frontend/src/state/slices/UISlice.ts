import { createSlice } from "@reduxjs/toolkit";

interface AuthInitialState {
  isSideMenuVisible: boolean;
}

const initialState: AuthInitialState = {
  isSideMenuVisible: false,
};

export const UISlice = createSlice({
  name: "UI",
  initialState,
  reducers: {
    TOGGLE_VISIBILITY: (state) => {
      state.isSideMenuVisible = !state.isSideMenuVisible;
    },
  },
});

export const { TOGGLE_VISIBILITY } = UISlice.actions;
