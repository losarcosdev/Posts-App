import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AddCommentAction,
  Comment,
  EditCommentAction,
  RemoveCommentAction,
  SetCommentAction,
  SetErrorAction,
} from "../interfaces";

interface CommentsInitialState {
  comments: Comment[];
  error: string | null;
  loading: boolean;
}

const initialState: CommentsInitialState = {
  comments: [],
  error: null,
  loading: false,
};

export const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    LOADING_COMMENTS: (state) => {
      state.loading = true;
      state.error = null;
    },

    SET_ERROR_COMMENTS: (state, { payload }: PayloadAction<SetErrorAction>) => {
      state.loading = false;
      state.error = payload.error;
      state.comments = [];
    },

    SET_COMMENTS: (state, { payload }: PayloadAction<SetCommentAction>) => {
      state.loading = false;
      state.error = null;
      state.comments = payload.comments;
    },

    ADD_COMMENT: (state, { payload }: PayloadAction<AddCommentAction>) => {
      state.loading = false;
      state.error = null;
      state.comments = [payload.comment, ...state.comments];
    },

    REPLY_COMMENT: (state, { payload }: PayloadAction<AddCommentAction>) => {
      state.error = null;
      state.loading = false;

      const addResponse = (comment: Comment) => {
        if (comment.id === payload.comment.parentId) {
          if (!comment.responses) {
            comment.responses = [];
          }
          comment.responses.unshift(payload.comment);
          return;
        }
        if (comment.responses && comment.responses.length > 0) {
          comment.responses.forEach((response) => addResponse(response));
        }
      };

      state.comments.forEach((comment) => addResponse(comment));
    },

    REMOVE_COMMENT: (
      state,
      { payload }: PayloadAction<RemoveCommentAction>
    ) => {
      state.error = null;
      state.loading = false;

      const deleteComment = (comment: Comment) => {
        if (comment.id === payload.deletedCommentId) {
          return null;
        } else {
          const responses = comment.responses
            .map((response) => deleteComment(response))
            .filter((r) => r !== null) as Comment[];
          return { ...comment, responses };
        }
      };

      const newComments = state.comments
        .map((comment) => deleteComment(comment))
        .filter((c) => c !== null);
      state.comments = newComments as Comment[];
    },

    EDIT_COMMENT: (state, { payload }: PayloadAction<EditCommentAction>) => {
      state.error = null;
      state.loading = false;

      const updateComment = (comment: Comment) => {
        if (comment.id === payload.commentId) {
          comment.content = payload.content;
        } else if (comment.responses.length > 0) {
          comment.responses.forEach((response) => updateComment(response));
        }
      };

      state.comments.forEach((comment) => updateComment(comment));
    },
  },
});

export const {
  ADD_COMMENT,
  LOADING_COMMENTS,
  REMOVE_COMMENT,
  SET_COMMENTS,
  SET_ERROR_COMMENTS,
  EDIT_COMMENT,
  REPLY_COMMENT,
} = commentsSlice.actions;
