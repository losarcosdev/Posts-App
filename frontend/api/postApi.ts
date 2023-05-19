import axios from "axios";

const API_URL = "https://posts-app.site/api/";

export const postApi = axios.create({
  baseURL: API_URL,
});
