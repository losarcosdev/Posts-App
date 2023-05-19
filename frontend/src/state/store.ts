import { configureStore } from "@reduxjs/toolkit";
import { authSlice, commentsSlice, postsSlice, UISlice } from "./slices";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    comments: commentsSlice.reducer,
    posts: postsSlice.reducer,
    UI: UISlice.reducer,
  },
});

export type Dispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
