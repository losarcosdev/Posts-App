import {
  LOADING_AUTH,
  LOGIN_USER,
  RESET_ERROR,
  SET_ERROR_AUTH,
} from "../slices";
import { Dispatch } from "../store";
import { AuthUser } from "../interfaces";
import { postApi } from "../../../api";

export const loginUser =
  (email: string, password: string) => async (dispatch: Dispatch) => {
    dispatch(LOADING_AUTH());

    try {
      const { data, status } = await postApi.post("auth/login", {
        email,
        password,
      });

      if (status === 500) {
        throw new Error("Not found user with those credentials");
      }

      const user: AuthUser = data;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", user.token);

      setTimeout(() => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.location.reload();
      }, 2 * 60 * 60 * 1000); // 2 hs

      dispatch(LOGIN_USER({ authUser: user }));
    } catch (error: any) {
      if (error.response.status === 500) {
        dispatch(
          SET_ERROR_AUTH({ error: "Not found user with those credentials." })
        );
        setTimeout(() => {
          dispatch(RESET_ERROR());
        }, 3500);
      } else {
        dispatch(SET_ERROR_AUTH({ error: error.response.data.message[0] }));
        setTimeout(() => {
          dispatch(RESET_ERROR());
        }, 8500);
      }
    }
  };

export const getUpdatedUser = () => async (dispatch: Dispatch) => {
  try {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      throw new Error("Unauthorized user");
    }

    const { id }: AuthUser = JSON.parse(user);

    const { data } = await postApi.get(`/user/${id}`);

    const updatedUser: AuthUser = data;

    localStorage.setItem("user", JSON.stringify(updatedUser));
    localStorage.setItem("token", token);

    dispatch(LOGIN_USER({ authUser: updatedUser }));
  } catch (error: any) {
    dispatch(SET_ERROR_AUTH({ error }));
  }
};

export const registerUser =
  (
    avatar: string,
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    username: string
  ) =>
  async (dispatch: Dispatch) => {
    dispatch(LOADING_AUTH());

    try {
      const { data, status } = await postApi.post("auth/signin", {
        avatar,
        email,
        firstName,
        lastName,
        password,
        username,
      });

      if (status === 500) {
        throw new Error("User already exist");
      }

      const user: AuthUser = data;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", user.token);

      setTimeout(() => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }, 2 * 60 * 60 * 1000); // 2 hs

      dispatch(LOGIN_USER({ authUser: user }));
    } catch (error: any) {
      if (error.response.status === 500) {
        dispatch(SET_ERROR_AUTH({ error: "User already exist." }));
        setTimeout(() => {
          dispatch(RESET_ERROR());
        }, 3500);
      } else {
        dispatch(SET_ERROR_AUTH({ error: error.response.data.message[0] }));
        setTimeout(() => {
          dispatch(RESET_ERROR());
        }, 8500);
      }
    }
  };
