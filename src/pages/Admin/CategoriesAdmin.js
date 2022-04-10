import React, { useState, useEffect } from "react";
import { Loader, Confirm } from "semantic-ui-react";
import { toast } from "react-toastify";
import {
  HeaderPage,
  TableCategories,
  AddEditCategoryForm,
} from "../../components/Admin";
import { BasicModal } from "../../components/Common";
import { useCategory } from "../../hooks";

export function CategoriesAdmin() {
  const { loading, categories, getCategories, deleteCategory } = useCategory();
  const [refetch, setRefetch] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [titleModal, setTitleModal] = useState(null);
  const [contentModal, setContentModal] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState({
    id: null,
    title: "",
  });

  useEffect(() => getCategories(), [refetch]);

  const openCloseModal = () => setShowModal((prev) => !prev);
  const openCloseConfirmModal = () => setShowConfirmModal((prev) => !prev);
  const onRefetch = () => setRefetch((prev) => !prev);

  const addCategory = () => {
    setTitleModal("Agregar Categoria");
    setContentModal(
      <AddEditCategoryForm onClose={openCloseModal} onRefetch={onRefetch} />
    );
    openCloseModal();
  };

  const updateCategory = (data) => {
    setTitleModal("Editar Categoria");
    setContentModal(
      <AddEditCategoryForm
        onClose={openCloseModal}
        onRefetch={onRefetch}
        category={data}
      />
    );
    openCloseModal();
  };

  const onDeleteCategory = async (data) => {
    openCloseConfirmModal();
    setCategoryToDelete(data);
  };

  return (
    <div>
      <HeaderPage
        title="Categorias"
        btnTitle="Nueva Categoria"
        btnClick={addCategory}
      />
      {loading ? (
        <Loader active inline="centered">
          Cargando...
        </Loader>
      ) : (
        <TableCategories
          categories={categories}
          updateCategory={updateCategory}
          onDeleteCategory={onDeleteCategory}
        />
      )}

      <BasicModal
        show={showModal}
        onClose={openCloseModal}
        title={titleModal}
        children={contentModal}
      />

      <Confirm
        open={showConfirmModal}
        content={`Estas apunto de eliminar la categoria '${categoryToDelete.title}', ¿Quieres continuar?`}
        cancelButton="Cancelar"
        confirmButton="Continuar"
        onCancel={openCloseConfirmModal}
        onConfirm={async () => {
          try {
            await deleteCategory(categoryToDelete.id);
            toast.success("¡Categoria eliminada exitosamente!");
          } catch (error) {
            toast.error(error);
          } finally {
            openCloseConfirmModal();
            onRefetch();
          }
        }}
      />
    </div>
  );
}
