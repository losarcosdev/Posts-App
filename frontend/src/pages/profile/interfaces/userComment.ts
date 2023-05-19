import { UserPost } from ".";

export interface UserComment {
  id:       string;
  parentId: null | string;
  content:  string;
  date:     string;
  post:     UserPost | null;
}

