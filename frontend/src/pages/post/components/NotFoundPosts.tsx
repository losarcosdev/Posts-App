import { useNavigate } from "react-router-dom";
import { useCustomSelector } from "../../../hooks";
import Swal from "sweetalert2";

export const NotFoundPosts = () => {
  const { authUser } = useCustomSelector(({ auth }) => auth);
  const navigate = useNavigate();

  const handleClick = () => {
    if (!authUser || !authUser.token) {
      Swal.fire({
        text: "Login or create an account before creating a post.",
      });
      return;
    }

    navigate("/post/create");
  };

  return (
    <div className="flex flex-col justify-center items-center gap-5 mt-[200px]">
      <h1 className="font-bold text-violet-900 text-[20px] text-center md:text-center">
        No posts found,try with another query.
      </h1>
      <button
        onClick={handleClick}
        className="p-3 text-white bg-purple-600 rounded-lg hover:bg-purple-700 duration-200"
      >
        + Add Post
      </button>
    </div>
  );
};
