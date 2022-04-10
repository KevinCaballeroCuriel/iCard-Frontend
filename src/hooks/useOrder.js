import React, { useState } from "react";
import {
  getOrdersApi,
  getOrdersByTableApi,
  addOrderApi,
  updateOrderApi,
  deleteOrderApi,
  checkDeliveredOrderApi,
  addPaymentToOrderApi,
  closeOrderApi,
  getOrdersByPaymentApi,
} from "../api/order";
import { toast } from "react-toastify";
import { useAuth } from "../hooks";

export function useOrder() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState(null);
  const { auth } = useAuth();

  const getOrders = async () => {
    try {
      setLoading(true);
      const response = await getOrdersApi(auth.token);
      setOrders(response);
    } catch (error) {
      setLoading(false);
      setError(error);
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getOrdersByTable = async (id, status = "", ordering = "") => {
    try {
      setLoading(true);
      const response = await getOrdersByTableApi(id, status, ordering);
      setOrders(response);
    } catch (error) {
      setLoading(false);
      setError(error);
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getOrdersByPayment = async (idPayment) => {
    try {
      return await getOrdersByPaymentApi(idPayment);
    } catch (error) {
      setError(error);
      toast.error(error);
    }
  };

  const addOrder = async (idTable, idProduct) => {
    try {
      setLoading(true);
      await addOrderApi(idTable, idProduct);
      toast.success("¡Orden añadida exitosamente!");
    } catch (error) {
      setLoading(false);
      setError(error);
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const checkDeliveredOrder = async (id) => {
    try {
      await checkDeliveredOrderApi(id);
      toast.success("¡Orden entregada!");
    } catch (error) {
      setLoading(false);
      setError(error);
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrder = async (id, data) => {
    try {
      setLoading(true);
      await updateOrderApi(id, data, auth.token);
      toast.success("¡Orden editada exitosamente!");
    } catch (error) {
      setLoading(false);
      setError(error);
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (id) => {
    try {
      setLoading(true);
      await deleteOrderApi(id, auth.token);
      toast.success("¡Orden eliminada exitosamente!");
    } catch (error) {
      setLoading(false);
      setError(error);
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addPaymentToOrder = async (idOrder, idPayment) => {
    try {
      await addPaymentToOrderApi(idOrder, idPayment);
    } catch (error) {
      setLoading(false);
      setError(error);
      toast.error(error);
    }
  };

  const closeOrder = async (idOrder) => {
    try {
      await closeOrderApi(idOrder);
    } catch (error) {
      setError(error);
      toast.error(error);
    }
  };

  return {
    loading,
    error,
    orders,
    getOrders,
    getOrdersByTable,
    getOrdersByPayment,
    checkDeliveredOrder,
    addOrder,
    updateOrder,
    deleteOrder,
    addPaymentToOrder,
    closeOrder,
  };
}
