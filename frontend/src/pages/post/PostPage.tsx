import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import { LikeButton } from "../components";
import { LoadingSpinner } from "../../components";
import { useCustomSelector, useActions } from "../../hooks";
import { Comments } from "./components";
import Swal from "sweetalert2";

const PostPage = () => {
  // TODO: FIX TYPES
  const { authUser } = useCustomSelector(({ auth }) => auth);
  const { post } = useCustomSelector(({ posts }) => posts);
  const { comments, loading } = useCustomSelector(({ comments }) => comments);
  const { slug } = useParams();
  const { setPost, setComments, removePost } = useActions();
  const navigate = useNavigate();

  if (!slug) {
    return <LoadingSpinner />;
  }

  useEffect(() => {
    if (!post) {
      setPost(slug);
    }
  }, []);

  useEffect(() => {
    if (post) {
      setComments(post.id);
    }
  }, [post]);

  if (!post || loading) return <LoadingSpinner />;

  const handleDeletePost = () => {
    Swal.fire({
      text: "Are you sure you want to delete your post?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#e74c3c",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        // Código a ejecutar al hacer clic en "Aceptar"
        if (authUser) {
          removePost(post.id, authUser.token);
          navigate(`/profile/${authUser.id}`);
        }
      }
    });
  };
  return (
    <div className="p-3 flex flex-col gap-5 w-full md:w-[70%] mx-auto">
      <div className="flex justify-between items-center">
        <Link
          to={"/"}
          className="flex gap-2 items-center hover:bg-gray-200 duration-200 p-2 rounded-lg"
        >
          <i className="bi bi-arrow-left-short text-blue-500 text-[20px]"></i>
          <p className="text-gray-500 font-semibold">Go Back</p>
        </Link>
        {authUser && authUser.username === post.user.username && (
          <div className="flex gap-3">
            <Link
              to={`/post/edit/${post.slug}`}
              className="p-4 rounded-xl text-white font-semibold bg-blue-700 hover:bg-blue-900 duration-200"
            >
              Edit Post
            </Link>
            <button
              onClick={handleDeletePost}
              className="p-4 rounded-xl text-white font-semibold bg-red-700 hover:bg-red-900 duration-200"
            >
              Delete post
            </button>
          </div>
        )}
      </div>

      <div className="bg-white  shadow-gray-100 shadow-sm rounded-xl p-5">
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
              <LikeButton id={post.id} postLikes={post.likeCount} />
              <h1 className="text-[18px] font-bold text-gray-600">
                {`${post.title.slice(0, 1).toUpperCase()}${post.title.slice(
                  1
                )}`}
              </h1>
            </div>
          </div>
          <p className="text-gray-700 mt-6">{post.description}</p>
        </div>
      </div>
      <Comments comments={comments} postId={post.id} />
    </div>
  );
};

export default PostPage;
