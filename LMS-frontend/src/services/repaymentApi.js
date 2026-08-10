import API from "./api";

export const RepaymentAPI = {
  getAll: () => API.get("/repayments/"),

  get: (id) => API.get(`/repayments/${id}/`),

  create: (data) => API.post("/repayments/", data),

  update: (id, data) => API.put(`/repayments/${id}/`, data),

  delete: (id) => API.delete(`/repayments/${id}/`),
};