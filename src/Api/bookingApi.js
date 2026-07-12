import axiosClient from "./axiosClient";

export const lockSeats = (movieId, seatNumbers) =>
  axiosClient.post("/bookings/lock", { movieId, seatNumbers }).then((r) => r.data);

export const bookTicket = (movieId, seatNumbers) =>
  axiosClient.post("/bookings/book", { movieId, seatNumbers }).then((r) => r.data);

export const getBookings = () => axiosClient.get("/bookings").then((r) => r.data);

export const getAllBookings = () => axiosClient.get("/bookings/all").then((r) => r.data);

export const getUserBookings = (userId) =>
  axiosClient.get(`/bookings/user/${userId}`).then((r) => r.data);

export const cancelBooking = (bookingId) =>
  axiosClient.post(`/bookings/${bookingId}/cancel`).then((r) => r.data);