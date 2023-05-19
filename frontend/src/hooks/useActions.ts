import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import {
  getUpdatedUser,
  addComment,
  addLike,
  addPost,
  editComment,
  editPost,
  loginUser,
  registerUser,
  removeComment,
  removeLike,
  removePost,
  replyComment,
  setComments,
  setPost,
  setPosts,
  LOGOUT_USER,
  SET_POSTS,
  TOGGLE_VISIBILITY,
} from "../state";

const actionCreators = {
  getUpdatedUser,
  addComment,
  addLike,
  addPost,
  editComment,
  editPost,
  loginUser,
  registerUser,
  removeComment,
  removeLike,
  removePost,
  replyComment,
  setComments,
  setPost,
  setPosts,
  LOGOUT_USER,
  SET_POSTS,
  TOGGLE_VISIBILITY,
};

export const useActions = () => {
  const dispatch = useDispatch();

  return useMemo(
    () => bindActionCreators(actionCreators, dispatch),
    [dispatch]
  );
};
