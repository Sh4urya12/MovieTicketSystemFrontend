import axiosClient from "./axiosClient";

export const payForBooking = (paymentRequest) =>
  axiosClient.post("/payments/pay", paymentRequest).then((r) => r.data);