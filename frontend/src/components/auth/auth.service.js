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

export default { registerUser, loginUser, logoutUser, getMe };