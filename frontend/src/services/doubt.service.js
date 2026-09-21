/*
 * -------------------------------------------------------
 * File : doubt.service.js
 * Description : API calls related to doubts
 * Author : Raju Barman
 * -------------------------------------------------------
 */

import api from "../lib/axios";

async function askDoubt(data) {
  const response = await api.post("/doubts/ask", data);
  return response.data;
}

async function getMyDoubts() {
  const response = await api.get("/doubts/me");
  return response.data;
}
async function getProgress() {
  const response = await api.get("/doubts/progress");
  return response.data;
}

export default { askDoubt, getMyDoubts, getProgress };