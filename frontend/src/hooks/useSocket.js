/*
 * -------------------------------------------------------
 * File : useSocket.js
 * Description : Creates and manages a single Socket.IO
 *               connection for the app
 * Author : Raju Barman
 * -------------------------------------------------------
 */

import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

export function useSocket() {
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_SOCKET_URL, {
      withCredentials: true,
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  return socketRef;
}