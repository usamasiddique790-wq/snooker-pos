import axios, { API, getAuthHeaders } from "./apiClient";

export const getSalesReportApi = (start, end) =>
  axios.get(`${API}/reports/sales?start=${start}&end=${end}`, getAuthHeaders());