import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "semantic-ui-react";
import { map, size, forEach } from "lodash";
import { useOrder, useTable, usePayment } from "../../hooks";
import { ConfirmModal } from "../../components/Common";
import { OrderHistoryItem } from "../../components/Client";

export function OrdersHistory() {
  const [idTable, setIdTable] = useState(null);
  const [showPaymentType, setShowPaymentType] = useState(false);
  const [isRequestAccount, setIsRequestAccount] = useState(false);
  const { tableNumber } = useParams();
  const { loading, orders, getOrdersByTable, addPaymentToOrder } = useOrder();
  const { getTableByNumber } = useTable();
  const { createPayment, getPaymentByTable } = usePayment();

  useEffect(() => {
    (async () => {
      const table = await getTableByNumber(tableNumber);
      const idTableTemp = table[0].id;
      setIdTable(idTableTemp);

      await getOrdersByTable(idTableTemp, "", "ordering=-status,-created_at");
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (idTable) {
        const response = await getPaymentByTable(idTable);
        setIsRequestAccount(response);
      }
    })();
  }, [idTable]);

  const onCreatePayment = async (paymentType) => {
    setShowPaymentType(false);

    let totalPayment = 0;
    forEach(orders, (order) => {
      totalPayment += Number(order.product_data.price);
    });

    const paymentData = {
      table: idTable,
      totalPayment: totalPayment.toFixed(2),
      paymentType,
      statusPayment: "PENDING",
    };

    const payment = await createPayment(paymentData);
    for await (const order of orders) {
      await addPaymentToOrder(order.id, payment.id);
    }

    window.location.reload();
  };

  return (
    <div>
      <h1>Historial de pedidos</h1>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div>
          {size(orders) > 0 && (
            <Button
              primary
              fluid
              onClick={() =>
                size(isRequestAccount) === 0 && setShowPaymentType(true)
              }
            >
              {size(isRequestAccount) > 0
                ? "La cuenta ya fue pedida"
                : "Pedir la cuenta"}
            </Button>
          )}
          {map(orders, (order) => (
            <OrderHistoryItem key={order.id} order={order} />
          ))}
        </div>
      )}

      <ConfirmModal
        title="Pagar con tarjeta o en efectivo"
        show={showPaymentType}
        onCloseText="Efectivo"
        onClose={() => onCreatePayment("CASH")}
        onConfirmText="Tarjeta"
        onConfirm={() => onCreatePayment("CARD")}
      />
    </div>
  );
}
