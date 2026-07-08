import axiosClient from "./axiosClient";

export const login = (email, password) =>
  axiosClient.post("/auth/login", { email, password }).then((r) => r.data);

export const register = (name, phone, email, password) =>
  axiosClient.post("/users/add", { name, phone, email, password }).then((r) => r.data);

export const logout = (refreshToken) =>
  axiosClient.post("/auth/logout", { refreshToken });