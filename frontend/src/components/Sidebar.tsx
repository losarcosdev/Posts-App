import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { tags } from "../constants";
import { useCustomSelector, useActions } from "../hooks";

interface Props {
  handleTagSelected: (tag: string) => void;
}

export const Sidebar = ({ handleTagSelected }: Props) => {
  const { isSideMenuVisible } = useCustomSelector((state) => state.UI);
  const { isAuthenticated, authUser } = useCustomSelector(
    (state) => state.auth
  );
  const { TOGGLE_VISIBILITY, LOGOUT_USER } = useActions();
  const [isCategoriesVisible, setIsCategoriesVisible] =
    useState<boolean>(false);

  const navigate = useNavigate();

  const handleCategorySelected = (tag: string) => {
    handleTagSelected(tag);
    TOGGLE_VISIBILITY();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    LOGOUT_USER();
    TOGGLE_VISIBILITY();
    window.location.reload();
  };

  const handleNavigation = (route: string) => {
    navigate(route);
    TOGGLE_VISIBILITY();
  };

  return (
    <div
      className={`{sidebar fixed top-0 bottom-0  ${
        isSideMenuVisible ? "right-0" : "right-[-300px]"
      } duration-500
    p-2 w-[200px] overflow-y-auto text-center bg-gray-900 shadow h-screen}`}
    >
      <i
        className="bi bi-x-lg cursor-pointer text-white absolute top-3 right-3 text-[20px]"
        onClick={() => TOGGLE_VISIBILITY()}
      />
      <div className="text-gray-100 text-xl">
        {isAuthenticated && (
          <>
            <div className="p-2.5 mt-1 flex flex-col items-center rounded-md justify-between">
              <img src={authUser?.avatar} alt="" />
              <button
                className="text-[15px]  ml-3 text-xl text-gray-200 font-bold w-full hover:underline"
                onClick={() => handleNavigation(`/profile/${authUser?.id}`)}
              >
                @{authUser?.username}
              </button>
            </div>
            <hr className="my-2 text-gray-600" />
          </>
        )}
        <button
          className="p-2.5 mt-10 flex items-center rounded-md px-4 duration-300 cursor-pointer  hover:bg-blue-600 w-full"
          onClick={() => handleNavigation("/")}
        >
          <i className="bi bi-house-door-fill"></i>
          <span className="text-[15px] ml-4 text-gray-200">Home</span>
        </button>
        {isAuthenticated && (
          <button
            className="p-2.5 mt-2 flex items-center rounded-md w-full px-4 duration-300 cursor-pointer  hover:bg-blue-600"
            onClick={() => handleNavigation(`/profile/${authUser?.id}`)}
          >
            <i className="bi bi-person-fill" />
            <span className="text-[15px] ml-4 text-gray-200">Profile</span>
          </button>
        )}
        <hr className="my-4 text-gray-600" />

        <div
          className="p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer  hover:bg-blue-600"
          onClick={() => setIsCategoriesVisible(() => !isCategoriesVisible)}
        >
          <i className="bi bi-tags" />
          <div className="flex justify-between w-full items-center">
            <span className="text-[15px] ml-4 text-gray-200">Categories</span>
            <i
              className={`${
                isCategoriesVisible ? "bi bi-chevron-up" : "bi bi-chevron-down"
              } text-sm`}
            />
          </div>
        </div>
        <div
          className={`text-sm font-thin mt-2 mx-auto items-start p-4 ${
            isCategoriesVisible ? "flex flex-col " : "hidden"
          }`}
        >
          {tags.map((tag) => (
            <button
              key={tag}
              value={tag.toLowerCase()}
              className="cursor-pointer p-2 hover:bg-gray-700 rounded-md mt-1"
              onClick={() => handleCategorySelected(tag.toLowerCase())}
            >
              {tag}
            </button>
          ))}
        </div>
        {isAuthenticated ? (
          <button
            className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer  hover:bg-blue-600 w-full"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-in-left"></i>
            <span className="text-[15px] ml-4 text-gray-200">Logout</span>
          </button>
        ) : (
          <>
            <button
              className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer  hover:bg-blue-600 w-full"
              onClick={() => handleNavigation("/login")}
            >
              <i className="bi bi-box-arrow-in-right"></i>
              <span className="text-[15px] ml-4 text-gray-200">Login</span>
            </button>
            <button
              className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer  hover:bg-blue-600 w-full"
              onClick={() => handleNavigation("/register")}
            >
              <i className="bi bi-person-square" />
              <span className="text-[15px] ml-4 text-gray-200">
                Create account
              </span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
