import axiosClient from "./axiosClient";

export const getAllUsers = () => axiosClient.get("/users").then((r) => r.data);