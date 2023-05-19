import { Comment } from "../../../state";
import { AddComment, CommentsList } from "./";

interface Props {
  comments: Comment[];
  postId: string;
}

export const Comments = ({ comments, postId }: Props) => {
  return (
    <div className="bg-white rounded-xl p-5 shadow-gray-100 shadow-sm flex flex-col gap-5">
      <h1 className="text-gray-600 text-[20px] font-bold">Comments</h1>
      <AddComment postId={postId} />
      <CommentsList comments={comments} />
    </div>
  );
};
