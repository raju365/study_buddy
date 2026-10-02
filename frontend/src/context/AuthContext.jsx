/*
 * -------------------------------------------------------
 * File : AuthContext.jsx
 * Description : Global auth state — current user,
 *               login/register/logout actions
 * Author : Raju Barman
 * -------------------------------------------------------
 */

import { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/auth.service";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /*
   * On app load, check if a valid session cookie already
   * exists (so refresh doesn't log the user out)
   */
  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const data = await authService.getMe();
      setUser(data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function register(formData) {
    const data = await authService.registerUser(formData);
    setUser(data.user);
    return data;
  }

  async function login(formData) {
    const data = await authService.loginUser(formData);
    setUser(data.user);
    return data;
  }

  async function logout() {
    await authService.logoutUser();
    setUser(null);
  }
  async function updateProfile(data) {
  const res = await authService.updateProfile(data);
  setUser(res.user);
  return res;
}

  return (
    <AuthContext.Provider
      value={{ user, loading, register, login, logout, updateProfile, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}