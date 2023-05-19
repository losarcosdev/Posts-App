import { Link } from "react-router-dom";
import { uppercaseFirstLetter } from "../../../helpers";
import { LikeButton } from "../../components";
import { QuantityComments } from "./";
import { UserPost } from "../interfaces";

interface Props {
  userPosts: UserPost[];
}

export const PostsProfile = ({ userPosts }: Props) => {
  return (
    <div className="flex flex-col gap-5 mt-10 pb-5">
      {!userPosts.length && (
        <h3 className="text-center text-[20px]">No posts yet.</h3>
      )}
      {userPosts.map(({ title, slug, tag, id, likes, comments }) => (
        <div
          className="bg-gray-50 rounded-xl p-7 shadow-gray-100 shadow-sm"
          key={id}
        >
          {/* Title,likes & comments */}
          <div className="flex gap-5 items-center justify-between">
            <div className="flex gap-5 items-center">
              <LikeButton id={id} postLikes={likes} />
              <Link
                to={`/post/${slug}`}
                className="text-[18px] font-bold text-gray-600 hover:underline"
              >
                {`${title.slice(0, 1).toUpperCase()}${title.slice(1)}`}
              </Link>
            </div>
            <QuantityComments comments={comments} />
          </div>
          <div className="mt-10">
            <span className="text-blue-500 bg-gray-100 p-3 rounded-lg font-bold">
              {` ${tag === "ux" ? "UX" : uppercaseFirstLetter(tag)}`}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
