import { useState, ChangeEvent } from "react";
import { useActions } from "../../hooks";

export const PostFilters = () => {
  const [select, setSelect] = useState<string>("");
  const { setPosts } = useActions();

  const handleSelect = ({ target }: ChangeEvent<HTMLSelectElement>) => {
    const value = target.value;
    setSelect(value);
    setPosts(`${value}`);
  };

  return (
    <div className="bg-[#373e68] text-white md:rounded-xl p-5 flex flex-col md:flex-row gap-5 items-center justify-between">
      <h3 className="font-semibold text-[20px]">Showing all Posts</h3>
      <div className="flex gap-3">
        <label htmlFor="">Sort by:</label>
        <select
          className="bg-[#373e68] font-semibold cursor-pointer"
          value={select}
          onChange={handleSelect}
        >
          <option value="order_likes=desc">Most Upvotes</option>
          <option value="order_likes=asc">Less Upvotes</option>
          <option value="order_title=asc">A-Z</option>
          <option value="order_title=desc">Z-A</option>
        </select>
      </div>
    </div>
  );
};
