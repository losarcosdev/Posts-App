import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { useActions, useCustomSelector } from "../../hooks";
import confetti from "canvas-confetti";
import { postApi } from "../../../api";

interface Props {
  id: string;
  postLikes: number;
}

interface User {
  id: string;
  username: string;
}

interface Like {
  id: string;
  user: User;
}

export const LikeButton = ({ id, postLikes }: Props) => {
  const canvasRef = useRef(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [likes, setLikes] = useState<Like[]>([]);
  const [like, setLike] = useState<Like | undefined>();
  const { authUser, isAuthenticated } = useCustomSelector(
    (state) => state.auth
  );
  const { addLike, removeLike } = useActions();
  const [likesQuantity, setLikesQuantity] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(true);

  useEffect(() => {
    postApi.get(`likes/allLikes/${id}`).then(({ data }) => {
      setLikes(data);
      setLikesQuantity(data.length);

      const authUserLike = data.find(
        (like: Like) => like.user.id === authUser?.id
      );
      setIsLiked(!!authUserLike);
      setLike(authUserLike);
    });
  }, [id, authUser]);

  useEffect(() => {
    if (showConfetti) {
      setTimeout(() => {
        setShowConfetti(false);
      }, 2000);
    }
  }, [showConfetti]);

  const handleVoting = async () => {
    if (!isButtonEnabled) {
      return;
    }

    setIsButtonEnabled(false);

    if (!isAuthenticated || !authUser) {
      Swal.fire({
        text: "Create an account or login before adding a like.",
      });
      setIsButtonEnabled(true);
      return;
    }

    if (isLiked) {
      setLikesQuantity(likesQuantity - 1);
      removeLike(like?.id, authUser.token);
    } else {
      setLikesQuantity(likesQuantity + 1);
      addLike(id, authUser.token);
      setShowConfetti(true);
      confetti({
        particleCount: 200,
        spread: 50,
        origin: { y: 0.64, x: 0.37 },
      });
    }
    setIsLiked(!isLiked);

    // Habilitar el botón después de 1 segundo
    setTimeout(() => setIsButtonEnabled(true), 1500);
  };

  return (
    <div className="relative">
      {showConfetti && <canvas ref={canvasRef} className="absolute" />}
      <button
        className={`flex flex-col ${
          isLiked ? "bg-blue-200" : "bg-gray-100"
        } p-3 items-center rounded-lg hover:bg-blue-200 ${
          isButtonEnabled && "active:translate-y-[-5px]"
        }`}
        onClick={handleVoting}
        disabled={!isButtonEnabled}
      >
        <i
          className={`bi ${
            isLiked ? "bi bi-heart-fill" : "bi bi-heart"
          } text-blue-600 text-[20px]`}
        />
        <span className="font-semibold">{likesQuantity}</span>
      </button>
    </div>
  );
};
