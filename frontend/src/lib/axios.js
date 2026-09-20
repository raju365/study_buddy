/*
 * -------------------------------------------------------
 * File : axios.js
 * Description : Pre-configured axios instance — sends
 *               cookies automatically for auth
 * Author : Raju Barman
 * -------------------------------------------------------
 */

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // sends httpOnly JWT cookie with every request
});

export default api;