import axios, { API, getAuthHeaders } from "./apiClient";

export const getProductsApi = () =>
  axios.get(`${API}/products`, getAuthHeaders());

export const createProductApi = (product) =>
  axios.post(`${API}/products`, product, getAuthHeaders());

export const updateProductApi = (id, product) =>
  axios.put(`${API}/products/${id}`, product, getAuthHeaders());

export const deleteProductApi = (id) =>
  axios.delete(`${API}/products/${id}`, getAuthHeaders());