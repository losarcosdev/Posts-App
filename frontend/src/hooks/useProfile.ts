import { useState, useEffect } from "react";
import {
  UserProfile,
  UserPost,
  UserComment,
  UserLikedPost,
} from "../pages/profile/interfaces";
import { postApi } from "../../api";

export const useProfile = (id?: string) => {
  const [activeValue, setActiveValue] = useState<string>("posts");
  const [user, setUser] = useState<UserProfile>();
  const [userPosts, setUserPosts] = useState<UserPost[]>([]);
  const [userComments, setUserComments] = useState<UserComment[]>([]);
  const [userLikedPosts, setUserLikedPosts] = useState<UserLikedPost[]>([]);

  // Set user info
  useEffect(() => {
    const getUser = async () => {
      const { data } = await postApi.get(`user/${id}`);
      setUser(data);
    };

    getUser();
  }, [id]);

  // Set user posts
  useEffect(() => {
    const getUserPosts = async () => {
      const { data } = await postApi.get(`user/${id}/posts`);
      setUserPosts(data);
    };

    getUserPosts();
  }, [id]);

  // Set user comments
  useEffect(() => {
    const getUserComments = async () => {
      const { data } = await postApi.get(`user/${id}/comments`);
      setUserComments(data);
    };

    getUserComments();
  }, [id]);

  // Set user liked posts
  useEffect(() => {
    const getUserLikedPosts = async () => {
      const { data } = await postApi.get(`user/${id}/liked-posts`);
      setUserLikedPosts(data);
    };

    getUserLikedPosts();
  }, [id]);

  const handleActive = (value: string) => {
    setActiveValue(value);
  };

  return {
    activeValue,
    user,
    userComments,
    userLikedPosts,
    userPosts,
    handleActive,
  };
};
