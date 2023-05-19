import { Post, IComment, AuthUser, Comment } from "./";

// Posts
export interface SetPostsAction {
  posts: Post[];
}

export interface SetPostAction {
  post: Post;
}

export interface EditPostAction {
  post: Post;
}

export interface AddPostAction {
  post: Post;
}

export interface RemovePostAction {
  post: Post;
}

// Error
export interface SetErrorAction {
  error: any;
}

// Auth
export interface SetAuthAction {
  authUser: AuthUser | null;
}

// Comments
export interface AddCommentAction {
  comment: Comment;
}

export interface RemoveCommentAction {
  deletedCommentId: string;
}

export interface EditCommentAction {
  content: string;
  commentId: string;
}

export interface SetCommentAction {
  comments: IComment["comments"];
}
