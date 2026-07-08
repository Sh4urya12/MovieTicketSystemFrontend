import axiosClient from "./axiosClient";

export const getMovies = () => axiosClient.get("/movies").then((r) => r.data);

export const searchMovies = (filters) =>
  axiosClient.post("/movies/search", filters).then((r) => r.data);

export const getSeats = (movieId) =>
  axiosClient.get(`/movies/${movieId}/seats`).then((r) => r.data);

export const addMovie = (movie) =>
  axiosClient.post("/movies/add", movie).then((r) => r.data);