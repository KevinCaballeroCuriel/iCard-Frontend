import React from "react";
import { Button, Image } from "semantic-ui-react";
import moment from "moment";
import "moment/locale/es-mx";
import { useOrder } from "../../../../hooks";
import classNames from "classnames";
import { ORDER_STATUS } from "../../../../utils/constants";
import "./OrderItemAdmin.scss";

export function OrderItemAdmin(props) {
  const { order, onRefetch } = props;
  const { title, image } = order.product_data;
  const { checkDeliveredOrder } = useOrder();

  const onCheckDelivered = async () => {
    await checkDeliveredOrder(order.id);
    onRefetch();
  };

  return (
    <div
      className={classNames("order-item-admin", {
        [order.status.toLowerCase()]: true,
      })}
    >
      <div className="order-item-admin__time">
        <span>{moment(order.created_at).format("HH:mm")}</span> {" — "}
        <span>{moment(order.created_at).startOf("seconds").fromNow()}</span>
      </div>
      <div className="order-item-admin__product">
        <Image src={image} />
        <p>{title}</p>
      </div>

      {order.status === ORDER_STATUS.PENDING ? (
        <Button primary onClick={onCheckDelivered}>
          Marcar como entregado
        </Button>
      ) : (
        <span>Entregado</span>
      )}
    </div>
  );
}
