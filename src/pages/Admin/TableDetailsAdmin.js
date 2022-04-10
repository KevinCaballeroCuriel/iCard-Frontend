import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Loader, Confirm } from "semantic-ui-react";
import { forEach, size } from "lodash";
import { toast } from "react-toastify";
import {
  HeaderPage,
  AddOrderForm,
  ListOrderAdmin,
  PaymentDetails,
} from "../../components/Admin";
import { BasicModal } from "../../components/Common";
import { useAuth, useOrder, useTable, usePayment } from "../../hooks";

export function TableDetailsAdmin() {
  const { auth } = useAuth();
  const { id } = useParams();
  const { loading, orders, getOrders, getOrdersByTable, addPaymentToOrder } =
    useOrder();
  const { createPayment, getPaymentByTable } = usePayment();
  const { table, getTable } = useTable();
  const [refetch, setRefetch] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPaymentTypeModal, setShowPaymentTypeModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentType, setPaymentType] = useState("");
  const [paymentTableData, setPaymentTableData] = useState(null);

  const [titleModal, setTitleModal] = useState(null);

  useEffect(() => {
    getOrdersByTable(id, "", "ordering=-status,created_at");
  }, [id, refetch]);

  useEffect(() => getTable(id), [id]);

  useEffect(() => {
    (async () => {
      const response = await getPaymentByTable(id);
      size(response) > 0 && setPaymentTableData(response[0]);
    })();
  }, [refetch]);

  const openCloseModal = () => setShowModal((prev) => !prev);
  const openCloseConfirmModal = () => setShowConfirmModal((prev) => !prev);
  const openClosePaymentTypeModal = () =>
    setShowPaymentTypeModal((prev) => !prev);
  const openClosePaymentModal = () => setShowPaymentModal((prev) => !prev);
  const onRefetch = () => setRefetch((prev) => !prev);

  const addOrder = () => {
    setTitleModal(
      paymentTableData
        ? `Cuenta de la mesa #${table?.number || ""}`
        : `Agregar Pedido a la mesa #${table?.number || ""}`
    );
    openCloseModal();
  };

  const onCreatePayment = async (type) => {
    setTitleModal(`Cuenta de la mesa #${table?.number || ""}`);
    setPaymentType(type);
    (async () => {
      try {
        let totalPayment = 0;
        forEach(orders, (order) => {
          totalPayment += Number(order.product_data.price);
        });

        const paymentData = {
          table: id,
          totalPayment: totalPayment.toFixed(2),
          paymentType: type,
          statusPayment: "PENDING",
        };

        const payment = await createPayment(paymentData);

        for await (const order of orders) {
          await addPaymentToOrder(order.id, payment.id);
        }

        toast.success("¡Cuenta generada exitosamente!");
      } catch (error) {
        toast.error(error);
      } finally {
        setShowConfirmModal(false);
        setShowPaymentTypeModal(false);
      }
    })();

    setShowConfirmModal(false);
    setShowPaymentTypeModal(false);
    openClosePaymentModal();
    onRefetch();
  };

  return (
    <div>
      <HeaderPage
        title={`Detalle de la mesa #${table?.number || ""}`}
        btnTitle={paymentTableData ? "Ver cuenta" : "Nuevo Pedido"}
        btnClick={addOrder}
        btnTitleTwo={!paymentTableData ? "Generar cuenta" : null}
        btnClickTwo={openCloseConfirmModal}
      />
      {loading ? (
        <Loader active inline="centered">
          Cargando...
        </Loader>
      ) : (
        <ListOrderAdmin orders={orders} onRefetch={onRefetch} />
      )}
      <BasicModal show={showModal} onClose={openCloseModal} title={titleModal}>
        {paymentTableData ? (
          <PaymentDetails
            payment={paymentTableData}
            orders={orders}
            openClosePaymentModal={openCloseModal}
            onRefetch={onRefetch}
          />
        ) : (
          <AddOrderForm
            idTable={id}
            onRefetch={onRefetch}
            openCloseModal={openCloseModal}
          />
        )}
      </BasicModal>
      <BasicModal
        show={showPaymentModal}
        onClose={openClosePaymentModal}
        title={titleModal}
        children={
          <div>
            <PaymentDetails
              payment={paymentTableData}
              orders={orders}
              openClosePaymentModal={openClosePaymentModal}
              onRefetch={onRefetch}
            />
            <h1>{paymentType}</h1>
          </div>
        }
      />
      <Confirm
        open={showConfirmModal}
        content={`Estas apunto de generar la cuenta de la mesa #${
          table?.number || ""
        }, ¿Quieres continuar?`}
        cancelButton="Cancelar"
        confirmButton="Continuar"
        onCancel={openCloseConfirmModal}
        onConfirm={openClosePaymentTypeModal}
      />
      <Confirm
        open={showPaymentTypeModal}
        content={`¿Desea pagar con tarjeta o en efectivo?`}
        cancelButton="Efectivo"
        confirmButton="Tarjeta"
        onCancel={() => onCreatePayment("CASH")}
        onConfirm={() => onCreatePayment("CARD")}
      />
    </div>
  );
}
