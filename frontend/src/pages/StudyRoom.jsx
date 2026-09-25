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
      setMessages(
        data.messages.map((m) => ({
          senderId: m.sender._id,
          senderName: m.sender.fullName.firstName,
          message: m.message,
        })),
      );
    } catch (err) {
      console.error("Failed to load history:", err);
    }
  }

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.on("connect", () => socket.emit("room:join", { roomId }));

    socket.on("room:memberJoined", ({ name }) => {
      setMembers((prev) => [...new Set([...prev, name])]);
      setMessages((prev) => [...prev, { system: true, content: `${name} joined the room` }]);
    });

    socket.on("room:memberLeft", () => {
      setMessages((prev) => [...prev, { system: true, content: `A student left the room` }]);
    });

    socket.on("room:message", (msg) => setMessages((prev) => [...prev, msg]));

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
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="bg-white rounded-3xl shadow-lg flex flex-col h-[78vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EEECFB]">
          <button
            onClick={() => navigate("/rooms")}
            className="flex items-center gap-1.5 text-sm text-[#6B6483] hover:text-[#1B1834] font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <span className="text-sm font-semibold text-[#1B1834]">Live Study Room</span>
          <div className="flex items-center gap-1.5 text-xs font-medium text-[#22B573] bg-[#E7F8EE] px-3 py-1.5 rounded-full">
            <Users className="w-3.5 h-3.5" />
            {members.length + 1} in room
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-3 bg-[#FBFAFF]">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) =>
              msg.system ? (
                <motion.p
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-center text-[#B4AFCB] my-1"
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
                    className={`text-sm px-4 py-2.5 max-w-[75%] rounded-2xl ${
                      msg.senderId === user?.id
                        ? "bg-[#6D5FE0] text-white rounded-br-sm"
                        : "bg-white shadow-sm text-[#1B1834] rounded-bl-sm"
                    }`}
                  >
                    {msg.senderId !== user?.id && (
                      <p className="text-xs font-semibold text-[#6D5FE0] mb-0.5">{msg.senderName}</p>
                    )}
                    {msg.message}
                  </div>
                </motion.div>
              ),
            )}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="flex gap-2 px-6 py-4 border-t border-[#EEECFB]">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Message the room..."
            className="flex-1 border border-[#EEECFB] rounded-full px-4 py-2.5 text-sm bg-[#FAFAFF] text-[#1B1834] placeholder:text-[#B4AFCB] outline-none"
          />
          <button
            type="submit"
            className="w-10 h-10 rounded-full bg-gradient-to-r from-[#7C6FEC] to-[#4F6FF0] flex items-center justify-center text-white flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}