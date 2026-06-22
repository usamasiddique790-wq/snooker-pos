import axios from "axios";

export const API = "http://localhost:5000";

export const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export default axios;