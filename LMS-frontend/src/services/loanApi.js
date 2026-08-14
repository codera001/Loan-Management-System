import API from "./api";

export const LoanAPI = {
  getAll: () => API.get("/loans/"),

  get: (id) => API.get(`/loans/${id}/`),

  create: (data) => API.post("/loans/", data),

  update: (id, data) => API.put(`/loans/${id}/`, data),

  deleteLoan: (id) => API.delete(`/loans/${id}/`),
};