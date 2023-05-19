import { Comment } from "../state";

export const countComments = (comments: Comment[]) => {
  let count = 0; // The actual comment

  comments.forEach((comment) => {
    if (!comment.responses) return;

    count++;

    if (comment.responses.length > 0) {
      count += countComments(comment.responses);
    }
  });

  return count;
};
