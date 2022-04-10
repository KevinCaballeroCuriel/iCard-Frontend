import React, { useState, useEffect } from "react";
import { Loader, Confirm } from "semantic-ui-react";
import { toast } from "react-toastify";
import {
  HeaderPage,
  TableProducts,
  AddEditProductForm,
} from "../../components/Admin";
import { BasicModal } from "../../components/Common";
import { useProduct } from "../../hooks";

export function ProductsAdmin() {
  const { loading, products, getProducts, deleteProduct } = useProduct();
  const [refetch, setRefetch] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [titleModal, setTitleModal] = useState(null);
  const [contentModal, setContentModal] = useState(null);
  const [productToDelete, setProductToDelete] = useState({
    id: null,
    title: "",
  });

  useEffect(() => getProducts(), [refetch]);

  const openCloseModal = () => setShowModal((prev) => !prev);
  const openCloseConfirmModal = () => setShowConfirmModal((prev) => !prev);
  const onRefetch = () => setRefetch((prev) => !prev);

  const addProduct = () => {
    setTitleModal("Agregar Producto");
    setContentModal(
      <AddEditProductForm onClose={openCloseModal} onRefetch={onRefetch} />
    );
    openCloseModal();
  };

  const updateProduct = (data) => {
    setTitleModal("Editar Producto");
    setContentModal(
      <AddEditProductForm
        onClose={openCloseModal}
        onRefetch={onRefetch}
        product={data}
      />
    );
    openCloseModal();
  };

  const onDeleteProduct = async (data) => {
    openCloseConfirmModal();
    setProductToDelete(data);
  };

  return (
    <div>
      <HeaderPage
        title="Productos"
        btnTitle="Nuevo Producto"
        btnClick={addProduct}
      />
      {loading ? (
        <Loader active inline="centered">
          Cargando...
        </Loader>
      ) : (
        <TableProducts
          products={products}
          updateProduct={updateProduct}
          onDeleteProduct={onDeleteProduct}
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
        content={`Estas apunto de eliminar el producto '${productToDelete.title}', ¿Quieres continuar?`}
        cancelButton="Cancelar"
        confirmButton="Continuar"
        onCancel={openCloseConfirmModal}
        onConfirm={async () => {
          try {
            await deleteProduct(productToDelete.id);
            toast.success("¡Producto eliminado exitosamente!");
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
