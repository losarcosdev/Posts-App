import { Comment } from "../../../state";
import { ResponseCard } from "./";

interface Props {
  responses: Comment[];
}

export const ResponsesList = ({ responses }: Props) => {
  return (
    <div className="flex flex-col gap-4 p-5 rounded-lg">
      {responses.map((response) => (
        <ResponseCard response={response} key={response.id} />
      ))}
    </div>
  );
};
