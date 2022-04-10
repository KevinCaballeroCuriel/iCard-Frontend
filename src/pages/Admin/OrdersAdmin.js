import React, { useState, useEffect } from "react";
import { Loader, Confirm } from "semantic-ui-react";
import { toast } from "react-toastify";
import {
  HeaderPage,
  TableTables,
  AddEditTableForm,
  ListTablesAdmin,
} from "../../components/Admin";
import { BasicModal } from "../../components/Common";
import { useAuth, useTable } from "../../hooks";

export function OrdersAdmin() {
  const { auth } = useAuth();
  const { loading, tables, getTables, deleteTable } = useTable();
  const [refetch, setRefetch] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [titleModal, setTitleModal] = useState(null);
  const [contentModal, setContentModal] = useState(null);

  useEffect(() => getTables(), [refetch]);

  const openCloseModal = () => setShowModal((prev) => !prev);
  const openCloseConfirmModal = () => setShowConfirmModal((prev) => !prev);
  const onRefetch = () => setRefetch((prev) => !prev);

  return (
    <div>
      <HeaderPage title="Pedidos" />
      {loading ? (
        <Loader active inline="centered">
          Cargando...
        </Loader>
      ) : (
        <ListTablesAdmin tables={tables} />
      )}
    </div>
  );
}
