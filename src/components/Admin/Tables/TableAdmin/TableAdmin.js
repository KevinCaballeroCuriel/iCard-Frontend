import React, { useState, useEffect } from "react";
import { Label, Button, Icon, Checkbox } from "semantic-ui-react";
import classNames from "classnames";
import { Link } from "react-router-dom";
import { ORDER_STATUS } from "../../../../utils/constants";
import { ReactComponent as Dinner_table } from "../../../../assets/dinner-table.svg";
import { useOrder, usePayment } from "../../../../hooks";
import "./TableAdmin.scss";
import { getOrdersByTableApi } from "../../../../api/order";
import { size } from "lodash";

export function TableAdmin(props) {
  const { table, reload } = props;
  const { orders, getOrdersByTable } = useOrder();
  const [tableBusy, setTableBusy] = useState(false);
  const [pendingPayment, setPendingPayment] = useState(false);
  const { getPaymentByTable } = usePayment();

  useEffect(() => {
    getOrdersByTable(table.id, ORDER_STATUS.PENDING);
  }, [reload]);

  useEffect(() => {
    (async () => {
      const response = await getPaymentByTable(table.id);
      size(response) > 0 ? setPendingPayment(true) : setPendingPayment(false);
    })();
  }, [reload]);

  useEffect(() => {
    (async () => {
      const response = await getOrdersByTableApi(
        table.id,
        ORDER_STATUS.DELIVERED
      );
      if (size(response) > 0) setTableBusy(response);
      else setTableBusy(false);
    })();
  }, [reload]);

  return (
    <Link className="table-admin" to={`/admin/table/${table.id}`}>
      {size(orders) > 0 ? (
        <Label circular color="orange">
          {size(orders)}
        </Label>
      ) : null}
      {pendingPayment && (
        <Label circular color="orange">
          Cuenta
        </Label>
      )}
      <Dinner_table
        className={classNames({
          pending: size(orders) > 0,
          busy: tableBusy,
          "pending-payment": pendingPayment,
        })}
      />
      <h1>Mesa #{table.number}</h1>
    </Link>
  );
}
