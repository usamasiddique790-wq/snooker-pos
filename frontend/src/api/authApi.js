import axios, { API } from "./apiClient";

export const loginApi = (loginForm) => {
  return axios.post(`${API}/login`, loginForm);
};