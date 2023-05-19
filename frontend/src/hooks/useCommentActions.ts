import Swal from "sweetalert2";
import { Comment } from "../state";
import { useState } from "react";
import { useActions } from "./useActions";
import { useCustomSelector } from "./useCustomSelector";
import { countComments } from "../helpers";
import { toast } from "react-toastify";

interface Props {
  comment: Comment;
}

export const useCommentActions = ({ comment }: Props) => {
  const [commentValue, setCommentValue] = useState<string>(comment.content);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [responseValue, setResponseValue] = useState<string>("");
  const [showMenu, setShowMenu] = useState<boolean>(true);
  const [showReplyInput, setShowReplyInput] = useState<boolean>(false);
  const { authUser } = useCustomSelector(({ auth }) => auth);
  const { removeComment, editComment, replyComment } = useActions();

  const handleAddResponse = () => {
    if (!responseValue) return;
    setShowReplyInput(false);
    setResponseValue(() => "");
    setShowMenu(true);

    if (authUser) {
      replyComment({
        commentId: comment.id,
        content: responseValue,
        token: authUser.token,
      });
    }

    toast.success("Reply added", { autoClose: 1000 });
  };

  const handleReply = () => {
    setShowMenu(() => false);
    setShowReplyInput(() => true);
  };

  const handleRemove = (commentId: string) => {
    Swal.fire({
      text: "Are you sure you want to delete your comment?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#e74c3c",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        // Código a ejecutar al hacer clic en "Aceptar"
        if (authUser) {
          removeComment(commentId, authUser.token);
        }

        toast.success("Comment deleted", { autoClose: 1000 });
      }
    });
  };

  const handleEdit = () => {
    setIsEditing(() => true);
    setShowMenu(() => false);
  };

  const handleCommentChange = (value: string) => {
    setCommentValue(() => value);
  };

  const handleEditSave = () => {
    if (authUser) {
      console.log("editando");
      editComment(comment.id, commentValue, authUser.token);
      setShowMenu(() => true);
      setIsEditing(() => false);
    }
    toast.success("Comment edited", { autoClose: 1000 });
  };

  return {
    handleAddResponse,
    handleCommentChange,
    handleEdit,
    handleEditSave,
    handleRemove,
    handleReply,
    setCommentValue,
    setIsEditing,
    setResponseValue,
    setShowMenu,
    setShowReplyInput,
    authUser,
    responseValue,
    commentValue,
    isEditing,
    showMenu,
    showReplyInput,
  };
};
