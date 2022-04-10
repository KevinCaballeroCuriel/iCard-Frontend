import React, { useState, useEffect } from "react";
import { Loader, Confirm } from "semantic-ui-react";
import { toast } from "react-toastify";
import {
  HeaderPage,
  TableUsers,
  AddEditUserForm,
} from "../../components/Admin";
import { BasicModal } from "../../components/Common";
import { useAuth, useUser } from "../../hooks";

export function UsersAdmin() {
  const { auth } = useAuth();
  const { loading, users, getUsers, deleteUser } = useUser();
  const [refetch, setRefetch] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [titleModal, setTitleModal] = useState(null);
  const [contentModal, setContentModal] = useState(null);
  const [userToDelete, setUserToDelete] = useState({ id: null, username: "" });

  useEffect(() => getUsers(), [refetch]);

  const openCloseModal = () => setShowModal((prev) => !prev);
  const openCloseConfirmModal = () => setShowConfirmModal((prev) => !prev);
  const onRefetch = () => setRefetch((prev) => !prev);

  const addUser = () => {
    setTitleModal("Agregar Usuario");
    setContentModal(
      <AddEditUserForm onClose={openCloseModal} onRefetch={onRefetch} />
    );
    openCloseModal();
  };

  const updateUser = (data) => {
    setTitleModal("Editar Usuario");
    setContentModal(
      <AddEditUserForm
        onClose={openCloseModal}
        onRefetch={onRefetch}
        user={data}
      />
    );
    openCloseModal();
  };

  const onDeleteUser = async (data) => {
    openCloseConfirmModal();
    setUserToDelete(data);
  };

  if (!auth.me?.is_staff) {
    return (
      <div>
        La pagina a la que intentas acceder es exclusiva para empleados.
      </div>
    );
  }

  return (
    <div>
      <HeaderPage
        title="Usuarios"
        btnTitle="Nuevo Usuario"
        btnClick={addUser}
      />
      {loading ? (
        <Loader active inline="centered">
          Cargando...
        </Loader>
      ) : (
        <TableUsers
          users={users}
          updateUser={updateUser}
          onDeleteUser={onDeleteUser}
        />
      )}

      <BasicModal
        show={showModal}
        onClose={openCloseModal}
        title={titleModal}
        children={contentModal}
      />

      <Confirm
        open={showConfirmModal}
        content={`Estas apunto de eliminar al usuario '${userToDelete.username}', ¿Quieres continuar?`}
        cancelButton="Cancelar"
        confirmButton="Continuar"
        onCancel={openCloseConfirmModal}
        onConfirm={async () => {
          try {
            await deleteUser(userToDelete.id);
            toast.success("¡Usuario eliminado exitosamente!");
          } catch (error) {
            toast.error(error);
          } finally {
            openCloseConfirmModal();
            onRefetch();
          }
        }}
      />
    </div>
  );
}
