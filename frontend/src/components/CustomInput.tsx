import { ErrorMessage, useField } from "formik";

interface Props {
  label?: string;
  name: string;
  type: "password" | "email" | "text" | "number";
  placeholder?: string;
  [x: string]: any;
  className?: string;
}

export const CustomInput = ({ label, ...props }: Props) => {
  const [field] = useField(props);

  return (
    <div className="w-[100%] relative">
      <label htmlFor={props.id || props.name} className="mb-3">
        {label}
      </label>
      <input className={props.className} {...field} {...props} />
      <ErrorMessage
        name={props.name}
        component="span"
        className="text-red-600 font-medium absolute top-16 left-2"
      />
    </div>
  );
};
