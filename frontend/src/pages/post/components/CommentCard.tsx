import { useState } from "react";
import { Link } from "react-router-dom";
import { Comment } from "../../../state";
import { DropDownMenu, LoadingSpinner } from "../../../components";
import { Responses } from "./";
import { useCommentActions, useCustomSelector } from "../../../hooks";
import { countComments } from "../../../helpers";

interface Props {
  comment: Comment;
}

export const CommentCard = ({ comment }: Props) => {
  const {
    handleAddResponse,
    handleCommentChange,
    handleEdit,
    handleEditSave,
    handleRemove,
    handleReply,
    setCommentValue,
    setIsEditing,
    setResponseValue,
    setShowMenu,
    setShowReplyInput,
    commentValue,
    isEditing,
    responseValue,
    showMenu,
    showReplyInput,
  } = useCommentActions({ comment });
  const { authUser } = useCustomSelector(({ auth }) => auth);
  const [showReplies, setShowReplies] = useState<boolean>(false);

  if (!comment) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className="flex justify-between">
        {isEditing ? (
          <div className="flex gap-3">
            {/* User image */}
            <img
              src={comment.user.avatar}
              alt="avatar"
              className="w-[100px] h-[100px] hidden md:flex"
            />
            {/* Name and username */}
            <div className="flex flex-col">
              <Link
                to={`/profile/${comment.user.id}`}
                className="text-[18px] font-bold text-gray-600 hover:underline w-fit"
              >
                {`${comment.user.firstName} ${comment.user.lastName}`}
              </Link>
              <span className="text-gray-500">@{comment.user.username}</span>
              <form className="w-full flex flex-col gap-3" noValidate>
                <textarea
                  value={commentValue}
                  onChange={({ target }) => handleCommentChange(target.value)}
                  className="text-gray-600 mt-3 bg-gray-100 p-5 rounded-lg resize-none w-[800px]"
                />
                <div className="flex gap-3 justify-end">
                  <button
                    className="p-3 bg-blue-100 rounded-lg hover:bg-blue-400 duration-300 text-blue-800"
                    type="button"
                    onClick={handleEditSave}
                  >
                    Save
                  </button>
                  <button
                    className="duration-300 text-red-700 hover:underline"
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setShowMenu(true);
                      setCommentValue(comment.content);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex gap-3">
            {/* User image */}
            <img
              src={comment.user.avatar}
              alt="avatar"
              className="w-[100px] h-[100px] hidden md:flex"
            />
            {/* Name and username */}
            <div className="flex flex-col">
              <Link
                to={`/profile/${comment.user.id}`}
                className="text-[18px] font-bold text-gray-600 hover:underline w-fit"
              >
                {`${comment.user.firstName} ${comment.user.lastName}`}
              </Link>
              <span className="text-gray-500">@{comment.user.username}</span>
              <p className="text-gray-600 mt-3 w-full">{comment.content}</p>
            </div>
          </div>
        )}
        {/* Comments menu actions */}
        {showMenu && (
          <div>
            {authUser && (
              <DropDownMenu
                comment={comment}
                authUser={authUser}
                handleReply={handleReply}
                handleRemove={handleRemove}
                handleEdit={handleEdit}
              />
            )}
          </div>
        )}
      </div>

      {/* Reply input */}
      {showReplyInput && (
        <form className="flex flex-col w-[90%] mx-auto gap-2 mt-5">
          <textarea
            className="rounded-lg p-3 resize-none border-b-blue-500 bg-gray-50"
            value={responseValue}
            onChange={({ target }) => setResponseValue(() => target.value)}
          />
          <div className="flex gap-3 justify-end">
            <button
              className={`p-2 duration-300 rounded-lg text-blue-800 ${
                !responseValue
                  ? "opacity-40 bg-blue-200"
                  : "bg-blue-100  hover:bg-blue-400 "
              }`}
              type="button"
              onClick={handleAddResponse}
              disabled={!responseValue}
            >
              Add reply
            </button>
            <button
              className="duration-300 text-red-700 hover:underline"
              type="button"
              onClick={() => {
                setShowReplyInput(false);
                setShowMenu(true);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {showReplies && <Responses responses={comment.responses} />}
      {comment.responses.length > 0 && (
        <button
          className="text-center justify-center p-3 rounded-lg duration-300 text-blue-600 hover:bg-blue-200 w-fit mx-auto active:bg-blue-400 mt-[-10px]"
          onClick={() => setShowReplies(!showReplies)}
        >
          {`${showReplies ? "Hide replies" : "Show replies"}`}
        </button>
      )}

      <hr />
    </>
  );
};
