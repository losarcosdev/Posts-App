import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { randomWord } from "../../../helpers";
import { useActions, useCustomSelector } from "../../../hooks";
import * as Yup from "yup";

interface InitialValues {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  username: string;
}

export const useRegister = () => {
  const { registerUser } = useActions();
  const { error, loading } = useCustomSelector((state) => state.auth);
  const [avatar, setAvatar] = useState(
    "https://api.dicebear.com/5.x/adventurer/svg?seed=Annie"
  );

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  const generateAvatar = () => {
    const word = randomWord();
    const avatarUrl = `https://api.dicebear.com/5.x/adventurer/svg?seed=${word}`;
    setAvatar(avatarUrl);
  };

  const initialValues: InitialValues = {
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    username: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email")
      .required("This field is required and has to be a valid email."),
    firstName: Yup.string().required("Required."),
    lastName: Yup.string().required("Required."),
    password: Yup.string().required("Required."),
    username: Yup.string().required("Required."),
  });

  const handleSubmit = ({
    email,
    firstName,
    lastName,
    password,
    username,
  }: InitialValues) => {
    registerUser(avatar, email, firstName, lastName, password, username);
  };

  return {
    avatar,
    error,
    initialValues,
    loading,
    validationSchema,
    generateAvatar,
    handleSubmit,
  };
};
