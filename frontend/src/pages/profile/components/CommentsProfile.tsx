import { Link } from "react-router-dom";
import { UserComment } from "../interfaces/userComment";

interface Props {
  userComments: UserComment[];
}

export const CommentsProfile = ({ userComments }: Props) => {
  return (
    <div className="flex flex-col gap-5 mt-10 pb-5">
      {!userComments.length && (
        <h3 className="text-center text-[20px]">
          This user has no comments yet.
        </h3>
      )}
      {userComments.map(({ post, id, content }) => {
        if (!post) return;

        return (
          <div
            key={id}
            className="flex justify-between bg-white rounded-xl shadow-gray-100 shadow-sm p-5"
          >
            <div className="flex gap-5 items-center">
              <div className="flex flex-col gap-2">
                <Link
                  to={`/post/${post.slug}`}
                  className="text-[18px] font-bold text-gray-600 hover:underline flex"
                >
                  {content}
                </Link>
                <p className="font-medium text-gray-400  z-10">
                  {`${post.title.slice(0, 1).toUpperCase()}${post.title.slice(
                    1
                  )}`}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
