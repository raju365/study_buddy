/*
 * -------------------------------------------------------
 * File : DoubtSolver.jsx
 * Description : AI-powered doubt solving chat interface
 *               with peer-room escalation
 * Author : Raju Barman
 * -------------------------------------------------------
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Users, ArrowRight } from "lucide-react";
import doubtService from "../services/doubt.service";
import roomService from "../services/room.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const SUBJECTS = ["Math", "Science", "Coding", "General"];

export default function DoubtSolver() {
  const navigate = useNavigate();

  const [subject, setSubject] = useState("Math");
  const [topic, setTopic] = useState("");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [peersStuck, setPeersStuck] = useState(0);
  const [loading, setLoading] = useState(false);
  const [joiningRoom, setJoiningRoom] = useState(false);

  async function handleAsk(e) {
    e.preventDefault();
    if (!question.trim() || !topic.trim()) return;

    const userMessage = { role: "user", content: question };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);

    try {
      const data = await doubtService.askDoubt({ subject, topic, question });

      setMessages((prev) => [
        ...prev,
        { role: "ai", content: data.doubt.answer },
      ]);
      setPeersStuck(data.peersStuckOnTopic || 0);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "Sorry, I couldn't generate an answer. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function handleJoinRoom() {
    setJoiningRoom(true);
    try {
      const data = await roomService.findOrCreateRoom({ subject, topic });
      navigate(`/rooms/${data.room._id}`);
    } catch (err) {
      setJoiningRoom(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF9FF] flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <h1 className="text-xl font-semibold mb-1">Ask a doubt</h1>
        <p className="text-sm text-muted-foreground mb-5">
          Get an instant explanation, or jump into a live room if you need more help.
        </p>

        {/* Subject + Topic inputs */}
        <div className="flex gap-2 mb-4">
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm bg-white"
          >
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <Input
            placeholder="Topic (e.g. Trigonometry)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        {/* Chat messages */}
        <div className="flex flex-col gap-3 mb-4 min-h-[200px]">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "ai" && (
                  <div className="w-7 h-7 rounded-full bg-[#E1F5EE] flex items-center justify-center mr-2 flex-shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-[#0F6E56]" />
                  </div>
                )}
                <div
                  className={`text-sm px-3.5 py-2.5 max-w-[78%] leading-relaxed whitespace-pre-line ${
                    msg.role === "user"
                      ? "bg-[#7F77DD] text-white rounded-2xl rounded-br-sm"
                      : "bg-white rounded-2xl rounded-bl-sm shadow-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              Thinking...
            </motion.div>
          )}
        </div>

        {/* Peer escalation banner */}
        <AnimatePresence>
          {peersStuck > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-[#FAECE7] border border-[#F0997B] rounded-lg px-4 py-3 mb-4 overflow-hidden"
            >
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#712B13]" />
                  <span className="text-sm text-[#712B13]">
                    {peersStuck} student{peersStuck > 1 ? "s" : ""} stuck on this
                    topic right now
                  </span>
                </div>
                <Button
                  size="sm"
                  disabled={joiningRoom}
                  onClick={handleJoinRoom}
                  className="bg-[#D85A30] hover:bg-[#c04f29]"
                >
                  {joiningRoom ? "Joining..." : "Join live room"}
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Question input */}
        <form onSubmit={handleAsk} className="flex gap-2">
          <Input
            placeholder="Type your doubt..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="rounded-full"
          />
          <Button
            type="submit"
            disabled={loading}
            className="rounded-full w-10 h-10 p-0 bg-[#7F77DD] hover:bg-[#6c63c9]"
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}