import {
  ADD_COMMENT,
  EDIT_COMMENT,
  LOADING_COMMENTS,
  REMOVE_COMMENT,
  REPLY_COMMENT,
  SET_COMMENTS,
  SET_ERROR_COMMENTS,
} from "../slices";
import { Dispatch } from "../store";
import { postApi } from "../../../api";

export const setComments = (postID: string) => async (dispatch: Dispatch) => {
  dispatch(LOADING_COMMENTS());
  try {
    const { data } = await postApi.get(`comments/post/${postID}`);

    dispatch(SET_COMMENTS({ comments: data }));
  } catch (error: any) {
    dispatch(SET_ERROR_COMMENTS(error));
  }
};

export const addComment =
  ({
    postID,
    content,
    token,
  }: {
    postID: string;
    content: string;
    token: string;
  }) =>
  async (dispatch: Dispatch) => {
    try {
      if (!token) {
        throw new Error("Unauthorized user");
      }

      const { data } = await postApi.post(
        `/comments/post/${postID}`,
        {
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(ADD_COMMENT({ comment: data }));
    } catch (error: any) {
      dispatch(SET_ERROR_COMMENTS({ error: error.message }));
    }
  };

export const removeComment =
  (commentId: string, token: string) => async (dispatch: Dispatch) => {
    try {
      if (!token) {
        throw new Error("Unauthorized");
      }

      const { data } = await postApi.delete(`/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const deletedCommentId = data.id;

      dispatch(REMOVE_COMMENT({ deletedCommentId }));
    } catch (error) {}
  };

export const editComment =
  (commentId: string, content: string, token: string) =>
  async (dispatch: Dispatch) => {
    try {
      const { data } = await postApi.patch(
        `/comments/${commentId}`,
        {
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(EDIT_COMMENT({ commentId, content }));
    } catch (error) {
      console.log({ error });
    }
  };

export const replyComment =
  ({
    commentId,
    content,
    token,
  }: {
    commentId: string;
    content: string;
    token: string;
  }) =>
  async (dispatch: Dispatch) => {
    try {
      const { data } = await postApi.post(
        `comments/reply/${commentId}`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      dispatch(REPLY_COMMENT({ comment: data }));
    } catch (error: any) {
      dispatch(SET_ERROR_COMMENTS(error));
    }
  };
