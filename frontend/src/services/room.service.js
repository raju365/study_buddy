/*
 * -------------------------------------------------------
 * File : room.service.js
 * Description : API calls related to study rooms
 * Author : Raju Barman
 * -------------------------------------------------------
 */

import api from "../lib/axios";

async function findOrCreateRoom(data) {
  const response = await api.post("/rooms/find-or-create", data);
  return response.data;
}

async function getActiveRooms() {
  const response = await api.get("/rooms/active");
  return response.data;
}

async function getRoomMessages(roomId) {
  const response = await api.get(`/rooms/${roomId}/messages`);
  return response.data;
}

export default { findOrCreateRoom, getActiveRooms, getRoomMessages };