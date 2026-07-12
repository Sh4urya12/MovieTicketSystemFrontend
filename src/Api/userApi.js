import axiosClient from "./axiosClient";

export const forgotPassword = (email) =>
  axiosClient.post("/users/forgot-password", { email }).then((r) => r.data);

export const resetPassword = (token, newPassword) =>
  axiosClient.post("/users/reset-password", { token, newPassword }).then((r) => r.data);

export const getProfile = () => axiosClient.get("/users/me").then((r) => r.data);

export const updateProfile = (name, phone) =>
  axiosClient.put("/users/me", { name, phone }).then((r) => r.data);

export const changePassword = (currentPassword, newPassword) =>
  axiosClient.post("/users/change-password", { currentPassword, newPassword }).then((r) => r.data);