import { Post, Comment } from "./";

export interface AuthUser {
  token    : string;
  id       : string;
  posts    : Post[];
  comments : Comment[];
  email    : string;
  firstName: string;
  lastName : string;
  username : string;
  avatar   : string;
}
