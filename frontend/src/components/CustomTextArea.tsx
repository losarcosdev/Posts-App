import { ErrorMessage, useField } from "formik";

interface Props {
  label: string;
  name: string;
  type?: "password" | "email" | "text";
  [x: string]: any;
}

export const CustomTextArea = ({ label, ...props }: Props) => {
  const [field, meta] = useField(props);

  return (
    <>
      <label htmlFor="description">{label}</label>
      <textarea {...field} {...props} />
      <ErrorMessage
        name={props.name}
        component="span"
        className="text-red-500 font-semibold"
      />
    </>
  );
};
