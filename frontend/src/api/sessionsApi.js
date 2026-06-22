import axios, { API, getAuthHeaders } from "./apiClient";

export const startSessionApi = (tableId) =>
  axios.post(`${API}/sessions/start`, { table_id: tableId }, getAuthHeaders());

export const endSessionApi = (sessionId) =>
  axios.post(`${API}/sessions/end`, { session_id: sessionId }, getAuthHeaders());

export const addProductToSessionApi = (sessionId, data) =>
  axios.post(`${API}/sessions/${sessionId}/products`, data, getAuthHeaders());