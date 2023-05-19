import { Comment } from "../../../state";
import { ResponsesList } from ".";

interface Props {
  responses: Comment[];
}

export const Responses = ({ responses }: Props) => {
  return <ResponsesList responses={responses} />;
};
