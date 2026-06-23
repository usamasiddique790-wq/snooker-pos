import axios, { API, getAuthHeaders } from "./apiClient";

export const getSalesReportApi = (start, end) =>
  axios.get(`${API}/reports/sales?start=${start}&end=${end}`, getAuthHeaders());
export const getInvoiceDetailApi = (id) =>
  axios.get(`${API}/reports/invoice/${id}`, getAuthHeaders());