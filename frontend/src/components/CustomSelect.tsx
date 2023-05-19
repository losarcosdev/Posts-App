import { ErrorMessage, useField } from "formik";

interface Props {
  label: string;
  name: string;
  type?: "password" | "email" | "text";
  [x: string]: any;
}

export const CustomSelect = ({ label, ...props }: Props) => {
  const [field, meta] = useField(props);

  return (
    <>
      <label htmlFor={props.id || props.name}>{label}</label>
      <select {...field} {...props} />
      <ErrorMessage
        name={props.name}
        component="span"
        className="text-red-600 font-medium"
      />
    </>
  );
};
