import API from "./api";

export const loginUser = (data) =>
  API.post("/auth/login/", data);

export const registerUser = (data) =>
  API.post("/auth/register/", data);

// const res = await loginUser(form);

// const access = res.data.access;
// const refresh = res.data.refresh;

// localStorage.setItem("token", access);
// localStorage.setItem("refresh", refresh);