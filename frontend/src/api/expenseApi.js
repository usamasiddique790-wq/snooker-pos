import axios from "axios";

const API = "http://localhost:5000";

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getExpensesApi = () =>
  axios.get(`${API}/expenses`, authHeaders());

export const addExpenseApi = (data) =>
  axios.post(`${API}/expenses`, data, authHeaders());

export const deleteExpenseApi = (id) =>
  axios.delete(`${API}/expenses/${id}`, authHeaders());