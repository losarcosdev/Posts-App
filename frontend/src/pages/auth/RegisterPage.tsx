import { Formik, Form } from "formik";
import { CustomInput, LoadingSpinner } from "../../components";
import { useRegister } from "./hooks";
import { Link } from "react-router-dom";

const RegisterPage = () => {
  const {
    avatar,
    error,
    initialValues,
    loading,
    validationSchema,
    generateAvatar,
    handleSubmit,
  } = useRegister();

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      {(formik) => (
        <div>
          <Form className="p-5 bg-white flex flex-col items-center justify-center w-[90%] md:w-[700px] mx-auto mt-[50px] gap-3 rounded-md">
            <h1 className="font-semibold text-[30px]">Create account</h1>
            <div className="flex flex-col items-center justify-center gap-5">
              <img
                src={avatar}
                alt="avatar"
                width={"250px"}
                className="bg-gray-100 p-3 rounded-lg"
              />
              <button
                onClick={generateAvatar}
                type="button"
                className="w-full bg-violet-800 rounded-lg font-semibold text-gray-100 p-5 hover:bg-violet-900"
              >
                Select random avatar
              </button>
            </div>
            <div className="w-[100%] flex flex-col gap-8 my-5">
              <CustomInput
                name="firstName"
                type="text"
                placeholder="John"
                className="p-5 rounded-md w-full bg-gray-100"
              />
              <CustomInput
                name="lastName"
                type="text"
                placeholder="Doe"
                className="p-5 rounded-md w-full bg-gray-100"
              />
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
              <CustomInput
                name="username"
                type="text"
                placeholder="johnDoe"
                className="p-5 rounded-md w-full bg-gray-100"
              />
            </div>
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
                className={`w-full bg-violet-800 rounded-lg font-semibold text-gray-100 p-5 ${
                  !!error ? "opacity-60" : "opacity-100"
                }`}
                disabled={!!error}
              >
                Create account
              </button>
            )}

            <Link
              to={"/login"}
              className={"font-bold my-5 text-gray-600 underline text-center"}
            >
              Already have an account? Login.
            </Link>
          </Form>
        </div>
      )}
    </Formik>
  );
};

export default RegisterPage;
