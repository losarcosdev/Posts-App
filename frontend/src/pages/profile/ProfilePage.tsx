import { Link } from "react-router-dom";
import { useParams } from "react-router";
import { LoadingSpinner } from "../../components";
import { LikedPostsProfile, CommentsProfile, PostsProfile } from "./components";
import { useCustomSelector, useProfile } from "../../hooks";

const ProfilePage = () => {
  const { id } = useParams();
  const { posts } = useCustomSelector((state) => state.posts);

  const {
    activeValue,
    user,
    userComments,
    userLikedPosts,
    userPosts,
    handleActive,
  } = useProfile(id);

  if (!id || !user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-[95%] md:w-[75%] mx-auto p-3 flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <Link
          to={"/"}
          className="flex gap-2 items-center hover:bg-gray-200 duration-200 p-2 rounded-lg"
        >
          <i className="bi bi-arrow-left-short text-blue-500 text-[20px]"></i>
          <p className="text-gray-500 font-semibold">Go Home</p>
        </Link>
      </div>
      {/*User profile card*/}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-white rounded-xl p-5 shadow-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3 items-center">
          <img
            src={user.avatar}
            alt="avatar"
            width={"200px"}
            height={"200px"}
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-600">{`${user.firstName} ${user.lastName}`}</h2>
            <span className="text-gray-400">@{user.username}</span>
          </div>
        </div>
        <div className="gap-3 hidden md:flex">
          <div>
            <p className="text-2xl font-bold text-gray-600">Posts</p>
            <span className="text-gray-400">{userPosts.length}</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-600">Comments</p>
            <span className="text-gray-400">{userComments.length}</span>
          </div>
        </div>
        <div className="flex gap-3 md:hidden">
          <div className="flex flex-row items-center justify-center gap-3">
            <p className="text-2xl font-bold text-gray-600">Posts</p>
            <span className="text-gray-400">{userPosts.length}</span>
          </div>
          <div className="flex flex-row items-center justify-center gap-3">
            <p className="text-2xl font-bold text-gray-600">Comments</p>
            <span className="text-gray-400">{userComments.length}</span>
          </div>
        </div>
      </div>
      {/* Posts , Comments && Liked Posts*/}
      <div className="flex flex-col gap-5 bg-gray-100 p-5 rounded-xl shadow-gray-100 shadow-sm">
        <div className="flex gap-5 items-center justify-center">
          <button
            value="posts"
            onClick={({ target }: any) => handleActive(target.value)}
            className={`p-2 rounded-xl font-semibold text-[20px] ${
              activeValue === "posts" && "bg-blue-600 text-white"
            }`}
          >
            Posts
          </button>
          <button
            value="comments"
            onClick={({ target }: any) => handleActive(target.value)}
            className={`p-2 rounded-xl font-semibold text-[20px] ${
              activeValue === "comments" && "bg-blue-600 text-white"
            }`}
          >
            Comments
          </button>
          <button
            value="liked-posts"
            onClick={({ target }: any) => handleActive(target.value)}
            className={`p-2 rounded-xl font-semibold text-[20px] ${
              activeValue === "liked-posts" && "bg-blue-600 text-white"
            }`}
          >
            Liked Posts
          </button>
        </div>

        {/* Posts*/}
        {activeValue === "posts" && <PostsProfile userPosts={userPosts} />}
        {/* Comments */}
        {activeValue === "comments" && (
          <CommentsProfile userComments={userComments} />
        )}

        {/* Liked posts */}
        {activeValue === "liked-posts" && (
          <LikedPostsProfile userLikedPosts={userLikedPosts} />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
