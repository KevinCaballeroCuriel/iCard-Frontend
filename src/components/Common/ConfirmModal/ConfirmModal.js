import React from "react";
import { Button, Modal } from "semantic-ui-react";
import "./ConfirmModal.scss";

export function ConfirmModal(props) {
  const { title, show, onClose, onCloseText, onConfirm, onConfirmText } = props;

  return (
    <Modal className="confirm-modal" open={show} onClose={onClose} size="mini">
      {title && <Modal.Header>{title}</Modal.Header>}

      <Modal.Actions>
        <Button negative onClick={onClose}>
          {onCloseText || "Cancelar"}
        </Button>
        <Button positive onClick={onConfirm}>
          {onConfirmText || "Aceptar"}
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
