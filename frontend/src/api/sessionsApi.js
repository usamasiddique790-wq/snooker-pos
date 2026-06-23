import axios, { API, getAuthHeaders } from "./apiClient";

export const startSessionApi = (tableId, billingType = "century") =>
  axios.post(
    `${API}/sessions/start`,
    {
      table_id: tableId,
      billing_type: billingType,
    },
    getAuthHeaders()
  );

export const endSessionApi = (sessionId) =>
  axios.post(`${API}/sessions/end`, { session_id: sessionId }, getAuthHeaders());

export const addProductToSessionApi = (sessionId, data) =>
  axios.post(`${API}/sessions/${sessionId}/products`, data, getAuthHeaders());


