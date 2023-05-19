import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { Comment, AuthUser } from "../state";

interface Props {
  authUser: AuthUser;
  comment: Comment;
  handleRemove: (string: string) => void;
  handleEdit: () => void;
  handleReply: () => void;
}

export const DropDownMenu = ({
  authUser,
  comment,
  handleRemove,
  handleEdit,
  handleReply,
}: Props) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button>
          <i className="bi bi-three-dots cursor-pointer p-2 rounded-[100%] text-[20px] text-blue-700 hover:bg-blue-200 duration-300" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {authUser.username === comment.user.username && (
            <>
              <Menu.Item>
                <button
                  onClick={handleEdit}
                  className="block px-4 py-2 text-sm text-gray-600 cursor-pointer hover:bg-gray-50 w-full text-left"
                >
                  Edit
                </button>
              </Menu.Item>
              <Menu.Item>
                <button
                  onClick={() => handleRemove(comment.id)}
                  className="block px-4 py-2 text-sm text-gray-600 cursor-pointer hover:bg-gray-50 w-full text-left"
                >
                  Remove
                </button>
              </Menu.Item>
            </>
          )}
          <Menu.Item>
            <button
              className="block px-4 py-2 text-sm text-gray-600 cursor-pointer hover:bg-gray-50 w-full text-left"
              onClick={handleReply}
            >
              Reply
            </button>
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
