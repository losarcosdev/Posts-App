import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import { useActions, useCustomSelector } from "../../../hooks";
import * as Yup from "yup";
import { Post } from "../../../state";
import { createSlug } from "../../../helpers";
import { createPostTags } from "../../../constants";
import { CustomInput, CustomSelect, CustomTextArea } from "../../../components";

interface InitialValues {
  description: string;
  tag: string;
  title: string;
}

interface Props {
  post?: Post;
}

export const PostForm = ({ post }: Props) => {
  const [disableButton, setDisableButton] = useState(false);
  const navigate = useNavigate();
  const { addPost, editPost } = useActions();
  const { authUser } = useCustomSelector(({ auth }) => auth);

  if (!authUser || !authUser?.token) {
    return <h1>Create an account to be able to create a post!</h1>;
  }

  const onSubmit = async ({ description, tag, title }: InitialValues) => {
    const slug = createSlug(title);

    if (post) {
      editPost({
        description,
        postID: post.id,
        tag,
        title,
        slug,
        token: authUser.token,
      });
      navigate(`/post/${slug}`);
      return;
    } else {
      addPost({ description, slug, tag, title, token: authUser.token });
      setDisableButton(() => true);
      setTimeout(() => {
        navigate(`/post/${slug}`);
        setDisableButton(() => false);
      }, 1000);
      return;
    }
  };

  const initialValues: InitialValues = {
    description: post?.description || "",
    tag: post?.tag || "",
    title: post?.title || "",
  };

  const validationSchema = Yup.object({
    title: Yup.string()
      .required("Required")
      .min(1, "Title must be longer than or equal to 1 characters"),
    description: Yup.string()
      .required("Required")
      .min(1, "Description must be longer than or equal to 1 characters"),
    tag: Yup.string()
      .required("Required")
      .oneOf(
        [
          "bug",
          "enhacement",
          "error",
          "feature",
          "other",
          "project",
          "ui",
          "ux",
        ],
        "Tag must be one of the following values: bug, enhacement, error, feature, other, project, ui, ux"
      ),
  });

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {(formik) => (
        <Form className="p-5 bg-white flex flex-col items-center justify-center w-[700px] mx-auto mt-[50px] gap-3 rounded-md">
          <h1 className="font-semibold text-[18px]">{`${
            post ? `Editing: ${post.title}` : "Create new post"
          }`}</h1>
          <CustomInput
            label="Title"
            name="title"
            type="text"
            className="p-3 rounded-md w-full bg-gray-100"
          />
          <CustomTextArea
            className="w-full bg-gray-100 rounded-xl resize-none min-h-[200px] p-3"
            label="Description"
            name="description"
          />
          <CustomSelect
            label="Tag"
            name="tag"
            className="w-full p-3 rounded-xl cursor-pointer"
          >
            <option value="" disabled>
              Select tag
            </option>
            {createPostTags.map((tag) => (
              <option value={tag.toLowerCase()} key={tag}>
                {tag}
              </option>
            ))}
          </CustomSelect>

          {disableButton ? (
            <button
              disabled={disableButton}
              className={`w-full bg-violet-800 opacity-70 rounded-lg font-semibold text-gray-100 p-5`}
            >
              Creating...
            </button>
          ) : (
            <button
              type="submit"
              disabled={disableButton}
              className={`w-full bg-violet-800 rounded-lg font-semibold text-gray-100 p-5`}
            >
              {`${post ? "Edit Post" : "Create Post"}`}
            </button>
          )}
        </Form>
      )}
    </Formik>
  );
};
