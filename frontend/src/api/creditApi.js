import axios, { API, getAuthHeaders } from "./apiClient";

export const addCreditApi = (data) =>
  axios.post(`${API}/credits/add`, data, getAuthHeaders());

export const getCreditsApi = () =>
  axios.get(`${API}/credits`, getAuthHeaders());

export const addCreditPaymentApi = (data) =>
  axios.post(`${API}/credits/payment`, data, getAuthHeaders());

export const deleteCreditApi = (creditId) =>
  axios.delete(`${API}/credits/${creditId}`, getAuthHeaders());