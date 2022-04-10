import React, { useState, useEffect } from "react";
import { Loader, Confirm } from "semantic-ui-react";
import { toast } from "react-toastify";
import { HeaderPage, TablePayments } from "../../components/Admin";
import { BasicModal } from "../../components/Common";
import { useAuth, usePayment } from "../../hooks";

export function PaymentsHistory() {
  const { auth } = useAuth();
  const { loading, payments, getPayments } = usePayment();
  const [refetch, setRefetch] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [titleModal, setTitleModal] = useState(null);
  const [contentModal, setContentModal] = useState(null);

  useEffect(() => getPayments(), [refetch]);

  const openCloseModal = () => setShowModal((prev) => !prev);
  const openCloseConfirmModal = () => setShowConfirmModal((prev) => !prev);
  const onRefetch = () => setRefetch((prev) => !prev);

  return (
    <div>
      <HeaderPage title="Historial de pagos" />
      {loading ? (
        <Loader active inline="centered">
          Cargando...
        </Loader>
      ) : (
        <TablePayments payments={payments} />
      )}
    </div>
  );
}
