import * as Yup from "yup";
import { useCustomSelector, useActions } from "../../../hooks";

interface InitialValues {
  email: string;
  password: string;
}

const initialValues = {
  email: "",
  password: "",
};

export const useLogin = () => {
  const { loginUser } = useActions();

  const { error, loading } = useCustomSelector(({ auth }) => auth);

  const onSubmit = async ({ email, password }: InitialValues) => {
    loginUser(email, password);
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().required("Required"),
  });

  return {
    error,
    initialValues,
    loading,
    validationSchema,
    onSubmit,
  };
};
