import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import MovieDetails from "./pages/MovieDetails";
import Payment from "./pages/Payment";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";
import AddMovie from "./pages/admin/AddMovie";
import AllUsers from "./pages/admin/AllUsers";
import AllBookings from "./pages/admin/AllBookings";
import Dashboard from "./pages/admin/Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/movies/:movieId" element={<MovieDetails />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="/admin/add-movie" element={<AddMovie />} />
            <Route path="/admin/users" element={<AllUsers />} />
            <Route path="/admin/bookings" element={<AllBookings />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}