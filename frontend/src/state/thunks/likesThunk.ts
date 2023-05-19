import { postApi } from "../../../api";

export const addLike = (postID: string, token: string) => async () => {
  try {
    const { data } = await postApi.get(`likes/${postID}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return data as string;
  } catch (error) {
    console.log(error);
  }
};

export const removeLike = (voteID: any, token: string) => async () => {
  try {
    await postApi.delete(`likes/${voteID}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.log(error);
  }
};
