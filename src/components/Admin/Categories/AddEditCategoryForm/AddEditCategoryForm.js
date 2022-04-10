import React, { useState, useCallback } from "react";
import { Form, Button, Image } from "semantic-ui-react";
import { useDropzone } from "react-dropzone";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useCategory } from "../../../../hooks";
import "./AddEditCategoryForm.scss";

export function AddEditCategoryForm(props) {
  const { onClose, onRefetch, category } = props;
  const { addCategory, updateCategory } = useCategory();
  const [previewImage, setPreviewImage] = useState(category?.image || null);

  const onDrop = useCallback(async (acceptedFile) => {
    const file = acceptedFile[0];
    await formik.setFieldValue("image", file);
    setPreviewImage(URL.createObjectURL(file));
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/jpeg, image/png",
    noKeyboard: true,
    multiple: false,
    onDrop,
  });

  const formik = useFormik({
    initialValues: initialValues(category),
    validationSchema: Yup.object(
      category ? updateValidationSchema() : newValidationSchema()
    ),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        category
          ? await updateCategory(category.id, formValue)
          : await addCategory(formValue);
      } catch (error) {
        toast.error(error.message);
      } finally {
        onRefetch();
        onClose();
      }
    },
  });

  return (
    <Form className="add-edit-category-form" onSubmit={formik.handleSubmit}>
      <label htmlFor="title">Titulo de la categoria*</label>
      <Form.Input
        name="title"
        placeholder="Titulo de la categoria"
        value={formik.values.title}
        onChange={formik.handleChange}
        error={formik.errors.title}
      />
      <div className="add-edit-category-form__submit-image" {...getRootProps()}>
        <input {...getInputProps()} />
        <Button type="button" fluid color={formik.errors.image && "red"}>
          {previewImage ? "Cambiar Imagen" : "Subir Imagen"}
          <br /> (Da click o arrastra la imagen aqui)
          {formik.errors.image && (
            <div>
              <br />
              ESTE CAMPO ES REQUERIDO
            </div>
          )}
        </Button>

        <Image src={previewImage} />
      </div>
      <Button
        type="submit"
        primary
        fluid
        content={category ? "Editar" : "Agregar"}
      />
    </Form>
  );
}

function initialValues(data) {
  return {
    title: data?.title || "",
    image: "",
  };
}

function newValidationSchema() {
  return {
    title: Yup.string().required("Este campo es requerido"),
    image: Yup.string().required("Este campo es requerido"),
  };
}

function updateValidationSchema() {
  return {
    title: Yup.string().required("Este campo es requerido"),
    image: Yup.string(),
  };
}
