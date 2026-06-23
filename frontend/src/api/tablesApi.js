import axios, { API, getAuthHeaders } from "./apiClient";

export const getLiveTablesApi = () =>
  axios.get(`${API}/tables/live`, getAuthHeaders());

export const updateTableApi = (id, data) =>
  axios.put(`${API}/tables/${id}`, data, getAuthHeaders());