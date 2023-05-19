import { useLogin } from "./hooks/useLogin";
import { Formik, Form } from "formik";
import { CustomInput, LoadingSpinner } from "../../components";
import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";

const LoginPage = () => {
  const { error, initialValues, onSubmit, validationSchema, loading } =
    useLogin();

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {(formik) => (
        <Form className="p-5 bg-white flex flex-col items-center justify-center w-[90%] md:w-[410px] mx-auto mt-[150px] gap-5 rounded-md">
          <h1 className="font-semibold text-[18px]">Login to your account</h1>
          <CustomInput
            name="email"
            type="email"
            placeholder="youraccount@gmail.com"
            className="p-5 rounded-md w-full bg-gray-100"
          />
          <CustomInput
            name="password"
            type="password"
            placeholder="*******"
            className="p-5 rounded-md w-full bg-gray-100"
          />
          {error && (
            <span className="text-red-600 text-center p-3 w-full bg-gray-200 font-medium">
              {error}
            </span>
          )}

          {loading ? (
            <LoadingSpinner />
          ) : (
            <button
              type="submit"
              className={`w-full bg-violet-700 hover:bg-violet-900 transition-all duration-300 rounded-lg font-semibold text-gray-100 p-5 ${
                !!error ? "opacity-60" : "opacity-100"
              }`}
              disabled={!!error}
            >
              Login
            </button>
          )}

          <Link
            to={"/register"}
            className={"font-bold my-5 text-gray-600 underline text-center"}
          >
            You don't have an account? Register.
          </Link>
        </Form>
      )}
    </Formik>
  );
};

export default LoginPage;
