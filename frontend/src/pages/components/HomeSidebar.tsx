import { Link } from "react-router-dom";
import { tags } from "../../constants";
import { AuthUser } from "../../state";
import { UserCard } from "./";
import { useActions } from "../../hooks";

interface Props {
  authUser: AuthUser | null;
  handleTagSelected: (tag: string) => void;
}

export const HomeSidebar = ({ authUser, handleTagSelected }: Props) => {
  const { TOGGLE_VISIBILITY } = useActions();

  const handleCategorySelected = (tag: string) => {
    handleTagSelected(tag);
  };

  return (
    <>
      {/* Small screens */}
      <div className="flex md:hidden p-3 bg-gradient-02 justify-between items-center">
        <h1 className="text-white font-bold"></h1>
        <i
          className="bi bi-list text-white text-[30px] font-bold cursor-pointer"
          onClick={() => TOGGLE_VISIBILITY()}
        />
      </div>
      {/* Medium and large screens */}
      <div className="flex-col gap-5 w-[250px] p-3 hidden md:flex md:p-0">
        {/* User */}
        {authUser ? (
          <UserCard authUser={authUser} />
        ) : (
          <>
            <Link
              to={"/login"}
              className={`flex flex-col items-center justify-center p-5 border-2 hover:bg-blue-200 border-blue-800 duration-300 
          text-blue-800 rounded-3xl shadow-md text-center text font-bold`}
            >
              Login
            </Link>
            <Link
              to={"/register"}
              className={`flex flex-col items-center justify-center p-5 bg-[#373e68] hover:bg-[#212a50]  duration-300 
          text-white rounded-3xl shadow-md text-center text font-bold`}
            >
              Create An Account
            </Link>
          </>
        )}

        <div className="p-5 rounded-3xl flex flex-wrap gap-3 bg-white shadow-gray-100 shadow-sm">
          {tags.map((tag) => (
            <button
              key={tag}
              value={tag.toLowerCase()}
              className="px-3 py-1 text-blue-600 bg-gray-100 rounded-xl font-semibold w-fit hover:bg-blue-300 duration-150"
              onClick={() => handleCategorySelected(tag.toLowerCase())}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};
