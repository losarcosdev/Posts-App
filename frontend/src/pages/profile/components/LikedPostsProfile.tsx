import { Link } from "react-router-dom";
import { LikeButton } from "../../components";
import { UserLikedPost } from "../interfaces";

interface Props {
  userLikedPosts: UserLikedPost[];
}

export const LikedPostsProfile = ({ userLikedPosts }: Props) => {
  return (
    <div className="flex flex-col gap-5 mt-10 pb-5">
      {!userLikedPosts.length ? (
        <h3 className="text-center text-[20px]">
          This user has No liked posts yet.
        </h3>
      ) : (
        userLikedPosts.map(({ id, post }) => (
          <div
            className="bg-white  shadow-gray-100 shadow-sm rounded-xl p-5"
            key={id}
          >
            <div className="rounded-md flex items-center">
              <img
                src={post.user.avatar}
                alt={post.title}
                className="w-[100px] h-[100px]"
              />
              <Link
                to={`/profile/${post.user.id}`}
                className="text-[18px] font-bold text-gray-600 hover:underline w-fit"
              >
                @{post.user.username}
              </Link>
            </div>
            <div className="bg-gray-50 rounded-xl p-7 shadow-gray-100 shadow-sm">
              {/* Title,likes & comments */}
              <div className="flex gap-5 items-center justify-between">
                <div className="flex gap-5 items-center">
                  <LikeButton id={post.id} postLikes={post.likes} />
                  <Link
                    to={`/post/${post.slug}`}
                    className="text-[18px] font-bold text-gray-600 hover:underline"
                  >
                    {`${post.title.slice(0, 1).toUpperCase()}${post.title.slice(
                      1
                    )}`}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
