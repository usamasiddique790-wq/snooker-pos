import axios, { API, getAuthHeaders } from "./apiClient";

export const getTodayDashboardApi = () =>
  axios.get(`${API}/dashboard/today`, getAuthHeaders());