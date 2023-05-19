import { FormEvent, useState } from "react";
import { useActions, useCustomSelector } from "../../../hooks";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

interface Props {
  postId: string;
}

export const AddComment = ({ postId }: Props) => {
  const { addComment } = useActions();
  const [input, setInput] = useState<string>("");
  const [chartsLength, setChartsLength] = useState(1000);
  const { isAuthenticated, authUser } = useCustomSelector(
    (state) => state.auth
  );
  const [notAuthenticatedError, setNotAuthenticatedError] = useState<string>();

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setChartsLength(() => 1000 - text.length);
    setInput(() => text);
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    if (!isAuthenticated || !authUser) {
      e.preventDefault();
      setNotAuthenticatedError(
        "Login or create an account before adding a comment!"
      );
      setTimeout(() => {
        setNotAuthenticatedError("");
      }, 5000);
      return;
    }
    e.preventDefault();
    setInput(() => "");
    setChartsLength(1000);
    if (!input.length) return;
    addComment({ postID: postId, content: input, token: authUser.token });
    toast.success("Comment added", { autoClose: 1000 });
  };

  return (
    <div className="bg-white rounded-xl shadow-gray-100 shadow-sm flex flex-col gap-5 md:p-5">
      <h3 className="text-[18px] font-bold text-gray-600 text-center md:text-left">
        Add Comment
      </h3>
      <form className="flex flex-col gap-7" onSubmit={(e) => onSubmit(e)}>
        <textarea
          className="w-full rounded-xl bg-gray-100 p-5 resize-none"
          placeholder="Type your comment here..."
          onChange={onChange}
          maxLength={1000}
          value={input}
          disabled={!isAuthenticated}
        />
        {notAuthenticatedError && (
          <span className="text-center text-red-500 bg-red-100 p-3 rounded-sm">
            {notAuthenticatedError}
          </span>
        )}
        <div className="flex flex-col gap-5 md:gap-0 md:flex-row items-center justify-between">
          <span
            className={`font-semibold ${
              chartsLength < 1 ? "text-red-600" : "text-gray-400"
            }`}
          >
            {`${chartsLength} ${
              chartsLength === 1 ? "Character" : "Characters"
            } Left`}
          </span>
          {isAuthenticated ? (
            <button
              type="submit"
              className={`p-3 w-full md:w-[20%] text-white font-semibold  rounded-xl ${
                input
                  ? " hover:bg-purple-700 bg-purple-500 duration-200"
                  : "opacity-40 bg-gray-700"
              }`}
              disabled={!input}
            >
              Add Comment
            </button>
          ) : (
            <Link
              to={"/login"}
              className={`flex flex-col items-center justify-center p-5 bg-blue-700 hover:bg-blue-900 duration-300 
        text-white rounded-3xl text-center text font-bold`}
            >
              Login to add a comment
            </Link>
          )}
        </div>
      </form>
    </div>
  );
};
