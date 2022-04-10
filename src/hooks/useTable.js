import React, { useState } from "react";
import { size } from "lodash";
import {
  getTablesApi,
  addTableApi,
  updateTableApi,
  deleteTableApi,
  getTableApi,
  getTableByNumberApi,
} from "../api/table";
import { toast } from "react-toastify";
import { useAuth } from "../hooks";

export function useTable() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tables, setTables] = useState(null);
  const [table, setTable] = useState(null);
  const { auth } = useAuth();

  const getTables = async () => {
    try {
      setLoading(true);
      const response = await getTablesApi(auth.token);
      setTables(response);
    } catch (error) {
      setLoading(false);
      setError(error);
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addTable = async (data) => {
    try {
      setLoading(true);
      await addTableApi(data, auth.token);
      toast.success("¡Mesa creada exitosamente!");
    } catch (error) {
      setLoading(false);
      setError(error);
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateTable = async (id, data) => {
    try {
      setLoading(true);
      await updateTableApi(id, data, auth.token);
      toast.success("¡Mesa editada exitosamente!");
    } catch (error) {
      setLoading(false);
      setError(error);
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTable = async (id) => {
    try {
      setLoading(true);
      await deleteTableApi(id, auth.token);
    } catch (error) {
      setLoading(false);
      setError(error);
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getTable = async (idTable) => {
    try {
      setLoading(true);
      const response = await getTableApi(idTable);
      setTable(response);
    } catch (error) {
      setLoading(false);
      setError(error);
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const isExistTable = async (tableNumber) => {
    try {
      const response = await getTableByNumberApi(tableNumber);
      if (size(response) === 0) throw Error();
      return true;
    } catch (error) {
      setError(error);
      toast.error(error);
    }
  };

  const getTableByNumber = async (tableNumber) => {
    try {
      const response = await getTableByNumberApi(tableNumber);
      if (size(response) === 0) throw Error();
      return response;
    } catch (error) {
      setError(error);
      toast.error(error);
    }
  };

  return {
    loading,
    error,
    tables,
    table,
    getTables,
    addTable,
    updateTable,
    deleteTable,
    getTable,
    isExistTable,
    getTableByNumber,
  };
}
