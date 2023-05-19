import "./homepage.css";
import { useEffect, useState } from "react";
import { useActions, useCustomSelector } from "../hooks";
import { PostsList, PostFilters, HomeSidebar } from "./components";
import { LoadingSpinner, Sidebar } from "../components";
import { Post } from "../state";

const HomePage = () => {
  const { authUser } = useCustomSelector(({ auth }) => auth);
  const { setPosts } = useActions();
  const { posts, loading } = useCustomSelector(({ posts }) => posts);
  const [tagSelected, setTagSelected] = useState<string>();
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);

  useEffect(() => {
    setPosts("");
  }, []);

  const handleTagSelected = (tag: string) => {
    setTagSelected(tag);
  };

  useEffect(() => {
    if (tagSelected) {
      const filteredPosts = posts.filter((post) => post.tag === tagSelected);
      setFilteredPosts(filteredPosts);
    } else {
      setFilteredPosts(posts);
    }
  }, [tagSelected, posts]);

  return (
    <div className="flex flex-col md:flex-row justify-center md:gap-5 md:mt-10">
      {/* Sidebar */}
      <HomeSidebar handleTagSelected={handleTagSelected} authUser={authUser} />

      {/* Only Mobile */}
      <Sidebar handleTagSelected={handleTagSelected} />
      {/* Posts */}
      <div className="w-full md:w-[800px]">
        {/* Filters */}
        <PostFilters />
        {/* Post List */}
        {loading && <LoadingSpinner />}
        {tagSelected === "all" ? (
          <PostsList posts={posts} />
        ) : (
          <PostsList posts={filteredPosts} />
        )}
      </div>
    </div>
  );
};

export default HomePage;
