import React, { useState } from "react";
import {
  getProductsApi,
  addProductApi,
  updateProductApi,
  deleteProductApi,
  getProductApi,
  getProductsByCategoryApi,
} from "../api/product";
import { toast } from "react-toastify";
import { useAuth } from "../hooks";

export function useProduct() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState(null);
  const [product, setProduct] = useState(null);
  const { auth } = useAuth();

  const getProducts = async () => {
    try {
      setLoading(true);
      const response = await getProductsApi();
      setProducts(response);
    } catch (error) {
      setLoading(false);
      setError(error);
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getProduct = async (id) => {
    try {
      const response = await getProductApi(id);
      return response;
    } catch (error) {
      setError(error);
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getProductsByCategory = async (idCategory) => {
    try {
      setLoading(true);
      const response = await getProductsByCategoryApi(idCategory);
      setProducts(response);
    } catch (error) {
      setError(error);
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (data) => {
    try {
      setLoading(true);
      await addProductApi(data, auth.token);
      toast.success("¡Producto creado exitosamente!");
    } catch (error) {
      setLoading(false);
      setError(error);
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id, data) => {
    try {
      setLoading(true);
      await updateProductApi(id, data, auth.token);
      toast.success("¡Producto editado exitosamente!");
    } catch (error) {
      setLoading(false);
      setError(error);
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    try {
      setLoading(true);
      await deleteProductApi(id, auth.token);
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
    products,
    getProducts,
    getProduct,
    getProductsByCategory,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}
