import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { tags } from "../../constants/index";
import {
  AddPostAction,
  EditPostAction,
  RemovePostAction,
  SetErrorAction,
  SetPostAction,
  SetPostsAction,
  Post,
} from "../interfaces";

interface PostsInitialState {
  error: string | null;
  loading: boolean;
  post: Post | undefined;
  posts: Post[];
}

const initialState: PostsInitialState = {
  error: null,
  loading: false,
  post: undefined,
  posts: [],
};

export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    LOADING_POSTS: (state: PostsInitialState) => {
      state.loading = true;
      state.error = null;
    },

    SET_POSTS: (
      state: PostsInitialState,
      { payload }: PayloadAction<SetPostsAction>
    ) => {
      state.loading = false;
      state.error = null;
      state.post = undefined;
      state.posts = payload.posts;
    },

    ADD_POST: (state, { payload }: PayloadAction<AddPostAction>) => {
      state.loading = false;
      state.error = null;
      state.posts = [...state.posts, payload.post];
    },

    SET_POST: (state, { payload }: PayloadAction<SetPostAction>) => {
      state.loading = false;
      state.error = null;
      state.post = payload.post;
    },

    EDIT_POST: (state, { payload }: PayloadAction<EditPostAction>) => {
      state.loading = false;
      state.error = null;
      if (state.post) {
        state.post.title = payload.post.title;
        state.post.description = payload.post.description;
        state.post.tag = payload.post.tag;
        state.post.slug = payload.post.slug;
      }
    },

    REMOVE_POST: (state, { payload }: PayloadAction<RemovePostAction>) => {
      state.loading = false;
      state.error = null;
      state.posts = state.posts.filter((post) => post.id !== payload.post.id);
    },

    SET_ERROR: (state, { payload }: PayloadAction<SetErrorAction>) => {
      state.loading = false;
      state.error = payload.error;
      state.posts = [];
      state.error = null;
    },
  },
});

export const {
  ADD_POST,
  EDIT_POST,
  LOADING_POSTS,
  SET_ERROR,
  SET_POST,
  SET_POSTS,
  REMOVE_POST,
} = postsSlice.actions;
