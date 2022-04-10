import React, { useState } from "react";
import { Table, Button, Icon, Confirm } from "semantic-ui-react";
import { usePayment, useOrder } from "../../../../hooks";
import "./PaymentDetails.scss";

export function PaymentDetails(props) {
  const { payment, orders, openClosePaymentModal, onRefetch } = props;
  const { closePayment } = usePayment();
  const { closeOrder } = useOrder();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const openCloseConfirmModal = () => setShowConfirmModal((prev) => !prev);

  const onCloseTable = async () => {
    await closePayment(payment.id);
    for await (const order of orders) {
      await closeOrder(order.id);
    }
    onRefetch();
    openClosePaymentModal();
  };

  return (
    <div className="payment-details">
      <Table striped>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Mesa:</Table.Cell>
            <Table.Cell>{payment.table_data.number}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Total:</Table.Cell>
            <Table.Cell>${payment.totalPayment}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Forma de pago:</Table.Cell>
            <Table.Cell>
              {payment.paymentType === "CARD" ? (
                <Icon name="credit card outline" />
              ) : (
                <Icon name="money bill alternate outline" />
              )}
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>

      <Button
        primary
        fluid
        onClick={openCloseConfirmModal}
        content="Marcar como pagado y cerrar mesa"
      />

      <Confirm
        open={showConfirmModal}
        content={`Estas apunto de cerrar la mesa, ¿Desea continuar?`}
        cancelButton="Cancelar"
        confirmButton="Continuar"
        onCancel={openCloseConfirmModal}
        onConfirm={onCloseTable}
      />
    </div>
  );
}
