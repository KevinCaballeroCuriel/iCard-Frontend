import React, { useState, useEffect } from "react";
import { Loader, Confirm } from "semantic-ui-react";
import { toast } from "react-toastify";
import {
  HeaderPage,
  TableTables,
  AddEditTableForm,
} from "../../components/Admin";
import { BasicModal } from "../../components/Common";
import { useAuth, useTable } from "../../hooks";

export function TablesAdmin() {
  const { auth } = useAuth();
  const { loading, tables, getTables, deleteTable } = useTable();
  const [refetch, setRefetch] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [titleModal, setTitleModal] = useState(null);
  const [contentModal, setContentModal] = useState(null);
  const [tableToDelete, setTableToDelete] = useState({
    id: null,
    number: null,
  });

  useEffect(() => getTables(), [refetch]);

  const openCloseModal = () => setShowModal((prev) => !prev);
  const openCloseConfirmModal = () => setShowConfirmModal((prev) => !prev);
  const onRefetch = () => setRefetch((prev) => !prev);

  const addTable = () => {
    setTitleModal("Agregar Mesa");
    setContentModal(
      <AddEditTableForm onClose={openCloseModal} onRefetch={onRefetch} />
    );
    openCloseModal();
  };

  const updateTable = (data) => {
    setTitleModal("Editar Mesa");
    setContentModal(
      <AddEditTableForm
        onClose={openCloseModal}
        onRefetch={onRefetch}
        table={data}
      />
    );
    openCloseModal();
  };

  const onDeleteTable = async (data) => {
    openCloseConfirmModal();
    setTableToDelete(data);
  };

  return (
    <div>
      <HeaderPage title="Mesas" btnTitle="Nueva Mesa" btnClick={addTable} />
      {loading ? (
        <Loader active inline="centered">
          Cargando...
        </Loader>
      ) : (
        <TableTables
          tables={tables}
          updateTable={updateTable}
          onDeleteTable={onDeleteTable}
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
        content={`Estas apunto de eliminar la mesa #${tableToDelete.number}, ¿Quieres continuar?`}
        cancelButton="Cancelar"
        confirmButton="Continuar"
        onCancel={openCloseConfirmModal}
        onConfirm={async () => {
          try {
            await deleteTable(tableToDelete.id);
            toast.success("¡Mesa eliminada exitosamente!");
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
