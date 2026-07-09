import axiosClient from "./axiosClient";

export const getReviews = (movieId, page = 0, sortBy = "recent") =>
  axiosClient.get(`/movies/${movieId}/reviews`, { params: { page, sortBy } }).then((r) => r.data);

export const addReview = (movieId, rating, comment) =>
  axiosClient.post(`/movies/${movieId}/reviews`, { rating, comment }).then((r) => r.data);

export const updateReview = (movieId, reviewId, rating, comment) =>
  axiosClient.put(`/movies/${movieId}/reviews/${reviewId}`, { rating, comment }).then((r) => r.data);

export const deleteReview = (movieId, reviewId) =>
  axiosClient.delete(`/movies/${movieId}/reviews/${reviewId}`);