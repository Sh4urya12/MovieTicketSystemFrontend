import axiosClient from "./axiosClient";

export const getDashboard = () => axiosClient.get("/admin/dashboard").then((r) => r.data);

export const getAllUsers = () => axiosClient.get("/admin/users").then((r) => r.data);