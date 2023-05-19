import CreatePostPage from "../pages/my-posts/CreatePostPage";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/auth/LoginPage";
import PostPage from "../pages/post/PostPage";
import ProfilePage from "../pages/profile/ProfilePage";
import RegisterPage from "../pages/auth/RegisterPage";
import EditPostPage from "../pages/my-posts/EditPostPage";

interface IRoutes {
  Component: () => JSX.Element;
  name?: string;
  path: string;
  isPrivate?: boolean | "" | null;
}

const token = localStorage.getItem("token");

export const routes: IRoutes[] = [
  {
    Component: HomePage,
    name: "Home",
    path: "/",
  },
  {
    Component: PostPage,
    path: "/post/:slug",
  },
  {
    Component: ProfilePage,
    path: "/profile/:id",
  },
  {
    Component: EditPostPage,
    path: "/post/edit/:slug",
  },
  {
    Component: CreatePostPage,
    path: "/post/create",
  },
  {
    Component: LoginPage,
    name: "Login",
    path: "/login",
    isPrivate: token && true,
  },
  {
    Component: RegisterPage,
    name: "Create Account",
    path: "/register",
    isPrivate: token && true,
  },
];
