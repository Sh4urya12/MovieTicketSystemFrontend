import { createContext, useContext, useState } from "react";
import * as authApi from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");
    return email ? { email, role, name } : null;
  });

  const login = async (email, password) => {
    const data = await authApi.login(email, password);
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("email", email);
    localStorage.setItem("role", data.role);
    localStorage.setItem("name", data.name);
    setUser({ email, role: data.role, name: data.name });
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    try {
      await authApi.logout(refreshToken);
    } catch {
      
    }
    localStorage.clear();
    setUser(null);
  };

  const isAdmin = user?.role === "ADMIN";

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);