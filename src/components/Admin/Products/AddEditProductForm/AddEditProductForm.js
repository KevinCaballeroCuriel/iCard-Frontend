import React, { useState, useEffect, useCallback } from "react";
import {
  Form,
  Button,
  Image,
  Dropdown,
  Checkbox,
  Icon,
} from "semantic-ui-react";
import { useDropzone } from "react-dropzone";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { map } from "lodash";
import { useProduct, useCategory } from "../../../../hooks";
import "./AddEditProductForm.scss";

export function AddEditProductForm(props) {
  const { onClose, onRefetch, product } = props;
  const { addProduct, updateProduct } = useProduct();
  const { categories, getCategories } = useCategory();
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [previewImage, setPreviewImage] = useState(product?.image || null);

  useEffect(() => getCategories(), []);
  useEffect(
    () => setCategoryOptions(formatCategoryOptions(categories)),
    [categories]
  );

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
    initialValues: initialValues(product),
    validationSchema: Yup.object(
      product ? updateValidationSchema() : newValidationSchema()
    ),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        product
          ? await updateProduct(product.id, formValue)
          : await addProduct(formValue);
      } catch (error) {
        toast.error(error.message);
      } finally {
        onRefetch();
        onClose();
      }
    },
  });

  return (
    <Form className="add-edit-product-form" onSubmit={formik.handleSubmit}>
      <label htmlFor="title">Titulo del Producto*</label>
      <Form.Input
        name="title"
        placeholder="Titulo del Producto"
        value={formik.values.title}
        onChange={formik.handleChange}
        error={formik.errors.title}
      />
      <label htmlFor="price">Precio*</label>
      <Form.Input
        type="number"
        step="0.01"
        name="price"
        onBlur={(e) => {
          if (
            e.target.value.length - e.target.value.indexOf(".") == 2 &&
            e.target.value.indexOf(".") != -1
          ) {
            e.target.value = e.target.value + "0";
          }
          if (e.target.value.length == 0) {
            e.target.value = e.target.value + "0.00";
          }
          if (e.target.value.indexOf(".") == -1) {
            e.target.value = e.target.value + ".00";
          }
        }}
        onInput={(e) => {
          let dec = e.target.value.indexOf(".");
          let tooLong = e.target.value.length > dec + 3;
          let invalidNum = isNaN(parseFloat(e.target.value));
          if ((dec >= 0 && tooLong) || invalidNum) {
            e.target.value = e.target.value.slice(0, -1);
          }
        }}
        className="price"
        iconPosition="left"
        placeholder="Precio"
        value={formik.values.price}
        onChange={formik.handleChange}
        error={formik.errors.price}
      >
        <Icon name="dollar sign" color="black" />
        <input />
      </Form.Input>
      <label htmlFor="category">Categoria</label>
      <Dropdown
        name="category"
        placeholder="Selecciona la categoria"
        search
        fluid
        noResultsMessage="No se encontró la categoria"
        selection
        options={categoryOptions}
        value={formik.values.category}
        error={formik.errors.category}
        onChange={(_, data) => formik.setFieldValue("category", data.value)}
      />
      <div className="add-edit-product-form__active">
        <Checkbox
          toggle
          checked={formik.values.active}
          onChange={(_, data) => formik.setFieldValue("active", data.checked)}
        />
        Producto activo
      </div>
      <div className="add-edit-product-form__submit-image" {...getRootProps()}>
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
        content={product ? "Editar" : "Agregar"}
      />
    </Form>
  );
}

function formatCategoryOptions(categories) {
  return map(categories, (category) => ({
    key: category.id,
    text: category.title,
    value: category.id,
  }));
}

function initialValues(data) {
  return {
    title: data?.title || "",
    image: "",
    price: data?.price || "",
    category: data?.category || "",
    active: data?.active ? true : false,
  };
}

function newValidationSchema() {
  return {
    title: Yup.string().required("Este campo es requerido"),
    image: Yup.string().required("Este campo es requerido"),
    price: Yup.number().required("Este campo es requerido"),
    category: Yup.number(),
    active: Yup.bool().required(true),
  };
}

function updateValidationSchema() {
  return {
    title: Yup.string().required("Este campo es requerido"),
    image: Yup.string(),
    price: Yup.number().required("Este campo es requerido"),
    category: Yup.number(),
    active: Yup.bool().required(true),
  };
}
