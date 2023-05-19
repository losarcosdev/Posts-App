import {
  ADD_POST,
  ADD_POST_AUTH_USER,
  EDIT_POST,
  LOADING_POSTS,
  REMOVE_POST,
  SET_ERROR,
  SET_POST,
  SET_POSTS,
} from "../slices";
import { Dispatch } from "../store";
import { getUpdatedUser } from "./authThunk";
import { postApi } from "../../../api";

interface AddPost {
  description: string;
  slug: string;
  tag: string;
  title: string;
  token: string;
}

interface EditPost extends AddPost {
  postID: string;
}

/**
 * getPosts - function for fetching all the posts from an external API
 * @param {function} dispatch - Dispatch function from the 'redux' library to update the global state.
 */
export const setPosts = (query?: string) => async (dispatch: Dispatch) => {
  dispatch(LOADING_POSTS());

  try {
    const { data } = await postApi.get(`posts?${query}`);

    dispatch(SET_POSTS({ posts: data }));
  } catch (error: any) {
    dispatch(SET_ERROR(error));
  }
};

/**
 * getPost - function for fetching a single post from an external API
 * @param {string} slug - The slug of the post to fetch
 * @param {function} dispatch - Dispatch function from the 'redux' library to update the global state.
 */
export const setPost = (slug: string) => async (dispatch: Dispatch) => {
  dispatch(LOADING_POSTS());

  try {
    const { data } = await postApi.get(`posts/${slug}`);

    dispatch(SET_POST({ post: data }));
  } catch (error: any) {
    dispatch(SET_ERROR(error));
  }
};

export const addPost =
  ({ description, slug, tag, title, token }: AddPost) =>
  async (dispatch: Dispatch) => {
    try {
      const { data } = await postApi.post(
        "posts",
        {
          title,
          description,
          tag,
          slug,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      dispatch(ADD_POST({ post: data }));
      dispatch(ADD_POST_AUTH_USER({ post: data }));
      getUpdatedUser();
    } catch (error: any) {
      dispatch(SET_ERROR({ error: error.message }));
    }
  };

export const editPost =
  ({ description, postID, slug, tag, title, token }: EditPost) =>
  async (dispatch: Dispatch) => {
    try {
      const { data } = await postApi.patch(
        `posts/${postID}`,
        { description, tag, title, slug },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      getUpdatedUser();
      dispatch(EDIT_POST({ post: data }));
    } catch (error: any) {
      dispatch(SET_ERROR(error));
    }
  };

export const removePost =
  (postId: string, token: string) => async (dispatch: Dispatch) => {
    try {
      const { data } = await postApi.delete(`posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(REMOVE_POST({ post: data }));
      getUpdatedUser();
    } catch (error) {
      SET_ERROR({ error });
    }
  };
