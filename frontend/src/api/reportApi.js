import axios, { API, getAuthHeaders } from "./apiClient";

export const getSalesReportApi = (start, end) =>
  axios.get(`${API}/reports/sales?start=${start}&end=${end}`, getAuthHeaders());
export const getInvoiceDetailApi = (id) =>
  axios.get(`${API}/reports/invoices/${id}`, getAuthHeaders());
export const getMonthlyReportApi = (month, year) =>
  axios.get(
    `${API}/reports/monthly?month=${month}&year=${year}`,
    getAuthHeaders()
  );

export const getYearlyReportApi = (year) =>
  axios.get(
    `${API}/reports/yearly?year=${year}`,
    getAuthHeaders()
  );