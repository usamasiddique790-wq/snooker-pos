import axios, { API, getAuthHeaders } from "./apiClient";

export const getLiveTablesApi = () =>
  axios.get(`${API}/tables/live`, getAuthHeaders());