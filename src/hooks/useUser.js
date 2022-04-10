import React, { useState } from "react";
import {
  getMeApi,
  getUsersApi,
  addUserApi,
  updateUserApi,
  deleteUserApi,
} from "../api/user";
import { toast } from "react-toastify";
import { useAuth } from "../hooks";

export function useUser() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState(null);
  const { auth } = useAuth();

  const getMe = async (token) => {
    try {
      const response = await getMeApi(token);
      return response;
    } catch (error) {
      toast.error(error);
    }
  };

  const getUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsersApi(auth.token);
      setUsers(response);
    } catch (error) {
      setLoading(false);
      setError(error);
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (data) => {
    try {
      setLoading(true);
      await addUserApi(data, auth.token);
      toast.success("¡Usuario creado exitosamente!");
    } catch (error) {
      setLoading(false);
      setError(error);
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id, data) => {
    try {
      setLoading(true);
      await updateUserApi(id, data, auth.token);
      toast.success("¡Usuario editado exitosamente!");
    } catch (error) {
      setLoading(false);
      setError(error);
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    try {
      setLoading(true);
      await deleteUserApi(id, auth.token);
    } catch (error) {
      setLoading(false);
      setError(error);
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    users,
    getMe,
    getUsers,
    addUser,
    updateUser,
    deleteUser,
  };
}
