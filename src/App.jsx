import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AllBookings from "./pages/admin/AllBookings";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MovieDetails from "./pages/MovieDetails";
import Payment from "./pages/Payment";
import MyBookings from "./pages/MyBookings";
import AddMovie from "./pages/admin/AddMovie";
import AllUsers from "./pages/admin/AllUsers";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/movies/:movieId" element={<MovieDetails />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/my-bookings" element={<MyBookings />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="/admin/add-movie" element={<AddMovie />} />
            <Route path="/admin/users" element={<AllUsers />} />
            <Route path="/admin/bookings" element={<AllBookings />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}