/*
 * -------------------------------------------------------
 * File : StudyRoom.jsx
 * Description : Live study room — real-time chat between
 *               students stuck on the same topic
 * Author : Raju Barman
 * -------------------------------------------------------
 */

import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Send, Users } from "lucide-react";
import { useSocket } from "../hooks/useSocket";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import roomService from "../services/room.service";

export default function StudyRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const socketRef = useSocket();

  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    loadHistory();
  }, [roomId]);

  async function loadHistory() {
    try {
      const data = await roomService.getRoomMessages(roomId);
      const formatted = data.messages.map((m) => ({
        senderId: m.sender._id,
        senderName: m.sender.fullName.firstName,
        message: m.message,
        sentAt: m.createdAt,
      }));
      setMessages(formatted);
    } catch (err) {
      console.error("Failed to load history:", err);
    }
  }
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.on("connect", () => {
      socket.emit("room:join", { roomId });
    });

    socket.on("room:memberJoined", ({ name }) => {
      setMembers((prev) => [...new Set([...prev, name])]);
      setMessages((prev) => [
        ...prev,
        { system: true, content: `${name} joined the room` },
      ]);
    });

    socket.on("room:memberLeft", () => {
      setMessages((prev) => [
        ...prev,
        { system: true, content: `A student left the room` },
      ]);
    });

    socket.on("room:message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.emit("room:leave", { roomId });
      socket.off("connect");
      socket.off("room:memberJoined");
      socket.off("room:memberLeft");
      socket.off("room:message");
    };
  }, [roomId, socketRef]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend(e) {
    e.preventDefault();
    if (!text.trim()) return;

    socketRef.current.emit("room:message", { roomId, message: text });
    setText("");
  }

  return (
    <div className="min-h-screen bg-[#FAF9FF] flex flex-col items-center px-4 py-6">
      <div className="w-full max-w-2xl flex flex-col h-[85vh]">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            {members.length + 1} in room
          </div>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col gap-2.5 pr-1">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) =>
              msg.system ? (
                <motion.p
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-center text-muted-foreground my-1"
                >
                  {msg.content}
                </motion.p>
              ) : (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${msg.senderId === user?.id ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`text-sm px-3.5 py-2.5 max-w-[75%] rounded-2xl ${
                      msg.senderId === user?.id
                        ? "bg-[#7F77DD] text-white rounded-br-sm"
                        : "bg-white shadow-sm rounded-bl-sm"
                    }`}
                  >
                    {msg.senderId !== user?.id && (
                      <p className="text-xs font-medium text-[#7F77DD] mb-0.5">
                        {msg.senderName}
                      </p>
                    )}
                    {msg.message}
                  </div>
                </motion.div>
              ),
            )}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>

        <form onSubmit={handleSend} className="flex gap-2 mt-3">
          <Input
            placeholder="Message the room..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="rounded-full"
          />
          <Button
            type="submit"
            className="rounded-full w-10 h-10 p-0 bg-[#7F77DD] hover:bg-[#6c63c9]"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
