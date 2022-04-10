import React, { useState } from "react";
import {
  getCategoriesApi,
  addCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
} from "../api/category";
import { toast } from "react-toastify";
import { useAuth } from "../hooks";

export function useCategory() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState(null);
  const { auth } = useAuth();

  const getCategories = async () => {
    try {
      setLoading(true);
      const response = await getCategoriesApi();
      setCategories(response);
    } catch (error) {
      setLoading(false);
      setError(error);
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (data) => {
    try {
      setLoading(true);
      await addCategoryApi(data, auth.token);
      toast.success("¡Categoria creada exitosamente!");
    } catch (error) {
      setLoading(false);
      setError(error);
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (id, data) => {
    try {
      setLoading(true);
      await updateCategoryApi(id, data, auth.token);
      toast.success("¡Categoria editada exitosamente!");
    } catch (error) {
      setLoading(false);
      setError(error);
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    try {
      setLoading(true);
      await deleteCategoryApi(id, auth.token);
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
    categories,
    getCategories,
    addCategory,
    updateCategory,
    deleteCategory,
  };
}
