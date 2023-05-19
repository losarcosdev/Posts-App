import { Link } from "react-router-dom";
import { Comment } from "../../../state";
import { useCommentActions, useCustomSelector } from "../../../hooks";
import { DropDownMenu } from "../../../components";

interface Props {
  response: Comment;
}

export const ResponseCard = ({ response }: Props) => {
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
  } = useCommentActions({ comment: response });
  const { authUser } = useCustomSelector(({ auth }) => auth);

  return (
    <div className="bg-gray-50 rounded-xl p-5 flex flex-col border border-gray-00 m-1">
      <div className="flex justify-between w-[95%] mx-auto ">
        <div className="flex items-center">
          <img
            src={response.user.avatar}
            alt="avatar"
            className="w-[100px] h-[100px] hidden md:flex"
          />
          <div className="flex flex-col gap-2">
            <div className="flex flex-col">
              <Link
                to={`/profile/${response.user.id}`}
                className="text-[18px] font-bold text-gray-600 hover:underline w-fit"
              >
                {`${response.user.firstName} ${response.user.lastName}`}
              </Link>
              <span className="text-gray-500">@{response.user.username}</span>
            </div>
            {isEditing ? (
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
                      setCommentValue(response.content);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <p className="font-medium text-gray-600 z-10">
                {response.content}
              </p>
            )}
          </div>
        </div>
        {/* Reply button */}
        {showMenu && (
          <div>
            {authUser && (
              <DropDownMenu
                comment={response}
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
            className="rounded-lg p-3 resize-none border-b-blue-500"
            value={responseValue}
            onChange={({ target }) => setResponseValue(() => target.value)}
          />
          <div className="flex gap-3 justify-end">
            <button
              className={`p-2 rounded-lg ${
                !responseValue
                  ? " bg-gray-600 text-gray-400 opacity-80"
                  : "bg-blue-100  hover:bg-blue-400 text-blue-800"
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

      {response.responses &&
        response.responses.length > 0 &&
        response.responses.map((response) => (
          <ResponseCard response={response} key={response.id} />
        ))}
    </div>
  );
};
