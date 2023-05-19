import { Link } from "react-router-dom";
import { AuthUser } from "../../state";
import { useActions, useProfile } from "../../hooks";
import { LoadingSpinner } from "../../components";

interface Props {
  authUser: AuthUser;
}

export const UserCard = ({ authUser }: Props) => {
  const { user, userComments, userPosts } = useProfile(authUser.id);
  const { LOGOUT_USER } = useActions();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
    LOGOUT_USER();
  };

  if (!user) return <LoadingSpinner />;

  return (
    <>
      <div className="flex flex-col items-center justify-center p-5 gap-2 relative bg-gradient-02 rounded-3xl shadow-md">
        <img
          src={user && user.avatar}
          alt="avatar"
          className="w-[130px] h-[130px]"
        />
        <Link
          to={`/profile/${user && user.id}`}
          className="font-bold text-white text-[18px] hover:underline"
        >
          @{user && user.username}
        </Link>
        <Link
          to={"/post/create"}
          className={`px-3 py-1 rounded-lg text-white font-medium bg-violet-600 
      hover:bg-violet-900 transition-all duration-300`}
        >
          Add Post +
        </Link>
        <button
          className={`p-1 text-white absolute top-3 right-3 cursor-pointer hover:text-gray-200 transition-all duration-300 bg-violet-600 
          hover:bg-violet-900 rounded-lg`}
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      <div className="p-5 rounded-3xl flex flex-col gap-3 bg-white shadow-gray-100 shadow-sm">
        <div className="flex justify-between items-center">
          <h3 className="text-[18px] font-bold text-gray-600">Your activity</h3>
          <Link
            to={`/profile/${user && user.id}`}
            className="text-blue-600 underline hover:text-blue-800 transition-all duration-300"
          >
            View
          </Link>
        </div>
        <div className="flex justify-between items-center">
          <h3 className="font-normal">Posts</h3>
          <span className="font-bold">{userPosts.length}</span>
        </div>
        <div className="flex justify-between items-center">
          <h3 className="font-normal">Comments</h3>
          <span className="font-bold">{userComments.length}</span>
        </div>
      </div>
    </>
  );
};
