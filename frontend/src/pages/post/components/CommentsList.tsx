import { CommentCard } from "./CommentCard";
import { Comment } from "../../../state";

interface Props {
  comments: Comment[];
}

export const CommentsList = ({ comments }: Props) => {
  return (
    <div className="flex flex-col gap-5 mt-5">
      {comments.map((comment) => (
        <CommentCard key={comment.id} comment={comment} />
      ))}
    </div>
  );
};
