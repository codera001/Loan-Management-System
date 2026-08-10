import API from "./api";

export const CustomerAPI = {
  getAll: () => API.get("/customers/"),

  get: (id) => API.get(`/customers/${id}/`),

  create: (data) => API.post("/customers/", data),

  update: (id, data) => API.put(`/customers/${id}/`, data),

  delete: (id) => API.delete(`/customers/${id}/`),
};