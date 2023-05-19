import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { LOGIN_USER } from "../state";

export const useLoadUserFromLocalStorage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Get the user from local storage
    const user = localStorage.getItem("user");

    // If there is a user in local storage, parse it to an object and dispatch an action to update the global state
    if (user) {
      const parsedUser = JSON.parse(user);
      dispatch(LOGIN_USER({ authUser: parsedUser }));
    }
  }, [dispatch]);
};
