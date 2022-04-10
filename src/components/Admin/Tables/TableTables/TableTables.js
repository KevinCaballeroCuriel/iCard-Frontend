import React, { useState } from "react";
import { Table, Button, Icon, Image } from "semantic-ui-react";
import { map } from "lodash";
import QRCode from "qrcode.react";
import { BasicModal } from "../../../Common";
import "./TableTables.scss";
import dinner_table from "../../../../assets/dinner-table.png";

export function TableTables(props) {
  const { tables, updateTable, onDeleteTable } = props;
  const [showModal, setShowModal] = useState(false);
  const [contentModal, setContentModal] = useState(null);

  const openCloseModal = () => setShowModal((prev) => !prev);

  const showQR = (table) => {
    setContentModal(
      <div style={{ textAlign: "center" }}>
        <QRCode value={`${window.location.origin}/client/${table.number}`} />
      </div>
    );

    openCloseModal();
  };

  return (
    <>
      <Table className="table-tables-admin">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell># Mesa</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {map(tables, (table, index) => (
            <Table.Row key={index}>
              <Table.Cell>
                <div
                  style={{
                    position: "relative",
                    top: 60,
                    left: 70,
                    padding: 0,
                  }}
                >
                  {table.number}
                </div>
                <Image src={dinner_table} size="small" />
              </Table.Cell>
              <Actions
                table={table}
                updateTable={updateTable}
                onDeleteTable={onDeleteTable}
                showQR={showQR}
              />
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      <BasicModal
        show={showModal}
        onClose={openCloseModal}
        title="Codigo QR"
        size="mini"
        children={contentModal}
      />
    </>
  );
}

function Actions(props) {
  const { table, updateTable, onDeleteTable, showQR } = props;

  return (
    <Table.Cell textAlign="right">
      <Button icon onClick={() => showQR(table)}>
        <Icon name="qrcode" />
      </Button>
      <Button icon onClick={() => updateTable(table)}>
        <Icon name="pencil" />
      </Button>
      <Button icon negative onClick={() => onDeleteTable(table)}>
        <Icon name="close" />
      </Button>
    </Table.Cell>
  );
}
