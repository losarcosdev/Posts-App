interface Props {
  comments: number;
}

export const QuantityComments = ({ comments }: Props) => {
  return (
    <div className="flex gap-1">
      <i className="bi bi-chat-fill text-gray-200" />
      <span className="font-semibold text-gray-600">{comments}</span>
    </div>
  );
};
