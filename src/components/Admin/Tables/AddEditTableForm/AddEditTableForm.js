import React, { useState, useCallback } from "react";
import { Form, Button, Image } from "semantic-ui-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useTable } from "../../../../hooks";
import "./AddEditTableForm.js";

export function AddEditTableForm(props) {
  const { onClose, onRefetch, table } = props;
  const { addTable, updateTable } = useTable();

  const formik = useFormik({
    initialValues: initialValues(table),
    validationSchema: Yup.object(validationSchema()),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        table
          ? await updateTable(table.id, formValue)
          : await addTable(formValue);
      } catch (error) {
        toast.error(error.message);
      } finally {
        onRefetch();
        onClose();
      }
    },
  });

  return (
    <Form className="add-edit-table-form" onSubmit={formik.handleSubmit}>
      <label htmlFor="title">Número de la mesa*</label>
      <Form.Input
        name="number"
        type="number"
        min="1"
        max="100"
        onInput={(e) => (e.target.value = Math.round(e.target.value))}
        placeholder="Número de la mesa"
        value={formik.values.number}
        onChange={formik.handleChange}
        error={formik.errors.number}
      />
      <Button
        type="submit"
        primary
        fluid
        content={table ? "Editar" : "Agregar"}
      />
    </Form>
  );
}

function initialValues(data) {
  return {
    number: data?.number || "",
  };
}

function validationSchema() {
  return {
    number: Yup.number().required("Este campo es requerido"),
  };
}
