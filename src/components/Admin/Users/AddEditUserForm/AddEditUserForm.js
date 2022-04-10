import React from "react";
import { Form, Button, Checkbox } from "semantic-ui-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useUser } from "../../../../hooks";
import "./AddEditUserForm.scss";

export function AddEditUserForm(props) {
  const { onClose, onRefetch, user } = props;
  const { addUser, updateUser } = useUser();

  const formik = useFormik({
    initialValues: initialValues(user),
    validationSchema: Yup.object(
      user ? updateValidationSchema() : newValidationSchema()
    ),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        user ? await updateUser(user.id, formValue) : await addUser(formValue);
      } catch (error) {
        toast.error(error.message);
      } finally {
        onRefetch();
        onClose();
      }
    },
  });

  return (
    <Form className="add-edit-user-form" onSubmit={formik.handleSubmit}>
      <label htmlFor="username">Nombre de usuario*</label>
      <Form.Input
        name="username"
        placeholder="Nombre de usuario"
        value={formik.values.username}
        onChange={formik.handleChange}
        error={formik.errors.username}
      />
      <label htmlFor="first_name">Nombre(s)*</label>
      <Form.Input
        name="first_name"
        placeholder="Nombre"
        value={formik.values.first_name}
        onChange={formik.handleChange}
        error={formik.errors.first_name}
      />
      <label htmlFor="last_name">Apellido(s)*</label>
      <Form.Input
        name="last_name"
        placeholder="Apellidos"
        value={formik.values.last_name}
        onChange={formik.handleChange}
        error={formik.errors.last_name}
      />
      <label htmlFor="email">Correo electronico*</label>
      <Form.Input
        name="email"
        placeholder="Correo Electronico"
        value={formik.values.email}
        onChange={formik.handleChange}
        error={formik.errors.email}
      />
      <label htmlFor="password">Contraseña*</label>
      <Form.Input
        name="password"
        type="password"
        placeholder="Contraseña"
        values={formik.values.password}
        onChange={formik.handleChange}
        error={formik.errors.password}
      />

      <div className="add-edit-user-form__active">
        <Checkbox
          toggle
          checked={formik.values.is_active}
          onChange={(_, data) =>
            formik.setFieldValue("is_active", data.checked)
          }
        />
        Usuario activo
      </div>

      <div className="add-edit-user-form__staff">
        <Checkbox
          toggle
          checked={formik.values.is_staff}
          onChange={(_, data) => formik.setFieldValue("is_staff", data.checked)}
        />
        Usuario administrador
      </div>

      <Button
        type="submit"
        primary
        fluid
        content={user ? "Editar" : "Agregar"}
      />
    </Form>
  );
}

function initialValues(data) {
  return {
    username: data?.username || "",
    first_name: data?.first_name || "",
    last_name: data?.last_name || "",
    email: data?.email || "",
    password: "",
    is_staff: data?.is_staff ? true : false,
    is_active: data?.is_active ? true : false,
  };
}

function newValidationSchema() {
  return {
    username: Yup.string().required("Este campo es requerido"),
    first_name: Yup.string().required("Este campo es requerido"),
    last_name: Yup.string().required("Este campo es requerido"),
    email: Yup.string()
      .email("Ingresa un correo valido")
      .required("Este campo es requerido"),
    password: Yup.string().required("Este campo es requerido"),
    is_staff: Yup.bool().required(true),
    is_active: Yup.bool().required(true),
  };
}

function updateValidationSchema() {
  return {
    username: Yup.string().required("Este campo es requerido"),
    first_name: Yup.string().required("Este campo es requerido"),
    last_name: Yup.string().required("Este campo es requerido"),
    email: Yup.string()
      .email("Ingresa un correo valido")
      .required("Este campo es requerido"),
    password: Yup.string(),
    is_staff: Yup.bool().required(true),
    is_active: Yup.bool().required(true),
  };
}
