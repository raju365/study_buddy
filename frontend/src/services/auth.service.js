/*
 * -------------------------------------------------------
 * File : auth.service.js
 * Description : API calls related to authentication
 * Author : Raju Barman
 * -------------------------------------------------------
 */

import api from "../lib/axios";

async function registerUser(data) {
  const response = await api.post("/auth/register", data);
  return response.data;
}

async function loginUser(data) {
  const response = await api.post("/auth/login", data);
  return response.data;
}

async function logoutUser() {
  const response = await api.post("/auth/logout");
  return response.data;
}

async function getMe() {
  const response = await api.get("/auth/me");
  return response.data;
}
async function updateProfile(data) {
  const response = await api.put("/auth/profile", data);
  return response.data;
}
async function forgotPassword(email) {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
}

async function resetPassword(token, password) {
  const response = await api.post(`/auth/reset-password/${token}`, { password });
  return response.data;
}
async function changePassword(data) {
  const response = await api.put("/auth/change-password", data);
  return response.data;
}

export default { registerUser, loginUser, logoutUser, getMe, updateProfile, forgotPassword, resetPassword, changePassword };