import { Link, useNavigate } from "react-router-dom";
import { Post } from "../../state";
import { uppercaseFirstLetter } from "../../helpers";
import { LikeButton } from "./LikeButton";
import { QuantityComments } from "../profile/components";
import { useActions } from "../../hooks";

interface Props {
  post: Post;
}

export const PostCard = ({ post }: Props) => {
  const { id, slug, tag, title, user, comments, likeCount } = post;
  const navigate = useNavigate();
  const { setPost } = useActions();

  const handleNavigate = () => {
    setPost(slug);
    navigate(`/post/${slug}`);
  };

  return (
    <div className="bg-white  shadow-gray-100 shadow-sm rounded-xl p-5">
      <div className="rounded-md flex items-center">
        <img
          src={post.user.avatar}
          alt={title}
          className="w-[100px] h-[100px]"
        />
        <Link
          to={`/profile/${user.id}`}
          className="text-[18px] font-bold text-gray-600 hover:underline w-fit"
        >
          @{user.username}
        </Link>
      </div>
      <div className="bg-gray-50 rounded-xl p-7 shadow-gray-100 shadow-sm">
        {/* Title,likes & comments */}
        <div className="flex gap-5 items-center justify-between">
          <div className="flex gap-5 items-center">
            <LikeButton id={id} postLikes={likeCount} />
            <h2
              onClick={handleNavigate}
              className="text-[18px] font-bold text-gray-600 hover:underline cursor-pointer"
            >
              {`${title.slice(0, 1).toUpperCase()}${title.slice(1)}`}
            </h2>
          </div>
          <QuantityComments comments={comments} />
        </div>
        <div className="mt-10">
          <span className="text-blue-500 bg-gray-100 p-3 rounded-lg font-bold">
            {` ${tag === "ux" ? "UX" : uppercaseFirstLetter(tag)}`}
          </span>
        </div>
      </div>
    </div>
  );
};
