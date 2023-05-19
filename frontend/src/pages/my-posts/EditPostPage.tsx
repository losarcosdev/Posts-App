import { useParams } from "react-router";
import { LoadingSpinner } from "../../components";
import { useCustomSelector } from "../../hooks";
import { useEffect } from "react";
import { useActions } from "../../hooks/useActions";
import { PostForm } from "./components/PostForm";

const EditPostPage = () => {
  const { slug } = useParams();
  const { post } = useCustomSelector(({ posts }) => posts);
  const { setPost } = useActions();

  if (!slug) {
    return <LoadingSpinner />;
  }

  useEffect(() => {
    if (!post) {
      setPost(slug);
    }
  }, []);

  return <PostForm post={post} />;
};

export default EditPostPage;
