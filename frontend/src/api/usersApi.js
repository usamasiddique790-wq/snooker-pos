import axios, { API, getAuthHeaders } from "./apiClient";

export const getUsersApi = () =>
  axios.get(`${API}/users`, getAuthHeaders());

export const createUserApi = (user) =>
  axios.post(`${API}/users/create`, user, getAuthHeaders());

export const updateUserApi = (id, user) =>
  axios.put(`${API}/users/${id}`, user, getAuthHeaders());

export const deleteUserApi = (id) =>
  axios.delete(`${API}/users/${id}`, getAuthHeaders());