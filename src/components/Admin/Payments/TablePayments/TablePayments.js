import React, { useState } from "react";
import { Table, Image, Button, Icon } from "semantic-ui-react";
import { map } from "lodash";
import moment from "moment";
import { PaymentProductList } from "../../../Admin";
import "./TablePayments.scss";
import { BasicModal } from "../../../Common";

export function TablePayments(props) {
  const { payments } = props;
  const [refetch, setRefetch] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [titleModal, setTitleModal] = useState(null);
  const [contentModal, setContentModal] = useState(null);

  const openCloseModal = () => setShowModal((prev) => !prev);

  const showDetails = (payment) => {
    setTitleModal(`Pago #${payment?.id}`);
    setContentModal(<PaymentProductList payment={payment} />);
    openCloseModal();
  };

  return (
    <>
      <Table className="table-payments">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell># de Mesa</Table.HeaderCell>
            <Table.HeaderCell>Total</Table.HeaderCell>
            <Table.HeaderCell>Tipo de pago</Table.HeaderCell>
            <Table.HeaderCell>Fecha</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {map(payments, (payment, index) => (
            <Table.Row key={index}>
              <Table.Cell>{payment.id}</Table.Cell>
              <Table.Cell>{payment.table_data.number}</Table.Cell>
              <Table.Cell>${payment.totalPayment}</Table.Cell>
              <Table.Cell>
                {payment.paymentType === "CARD" ? (
                  <Icon name="credit card outline" />
                ) : (
                  <Icon name="money bill alternate outline" />
                )}
              </Table.Cell>
              <Table.Cell>
                {moment(payment.created_at).format("DD/MM/YYYY — HH:MM")}
              </Table.Cell>
              <Table.Cell textAlign="right">
                <Button icon onClick={() => showDetails(payment)}>
                  <Icon name="eye" />
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      <BasicModal
        show={showModal}
        onClose={openCloseModal}
        title={titleModal}
        children={contentModal}
      />
    </>
  );
}
