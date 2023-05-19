import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

interface Props {
  Component: () => JSX.Element;
  redirectPath: string;
}

export const AuthGuard = ({ Component, redirectPath }: Props) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      navigate(redirectPath, { replace: true });
    }
  }, [token, navigate]);

  return <Component />;
};
