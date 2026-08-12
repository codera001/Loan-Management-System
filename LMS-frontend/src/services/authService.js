import API from "./api";

export const loginUser = (data) =>
  API.post("/auth/login/", data);

export const registerUser = (data) =>
  API.post("/auth/register/", data);

export const getMe = () =>
  API.get("/auth/me/");

export const refreshToken = (refresh) => {
  return API.post("/auth/refresh/", {
      refresh,
    });
  };

// const res = await loginUser(form);

// const access = res.data.access;
// const refresh = res.data.refresh;

// localStorage.setItem("token", access);
// localStorage.setItem("refresh", refresh);