import { PostCard } from "./PostCard";
import { Post } from "../../state/";
import { NotFoundPosts } from "../post/components";

interface Props {
  posts: Post[];
}

export const PostsList = ({ posts }: Props) => {
  if (!posts.length) return <NotFoundPosts />;

  return (
    <div className="flex flex-col gap-5 p-1 py-5">
      {posts && posts.map((post) => <PostCard key={post.id} post={post} />)}
    </div>
  );
};
