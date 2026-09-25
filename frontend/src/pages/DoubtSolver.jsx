import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import {
  Sparkles,
  Users,
  ArrowRight,
  Send,
  Zap,
  BookOpen,
  BarChart3,
  Lightbulb,
  Paperclip,
  Image as ImageIcon,
  Code2,
} from "lucide-react";
import doubtService from "../services/doubt.service";
import roomService from "../services/room.service";
import { Button } from "@/components/ui/button";
import { Blob, StickyNote } from "../components/common/PageBg";

const SUBJECTS = ["Math", "Science", "Coding", "General"];

const suggestions = [
  {
    icon: Lightbulb,
    text: "Explain Pythagoras theorem",
    bg: "#FDF1E4",
    color: "#E2933B",
  },
  { icon: Zap, text: "Solve this equation", bg: "#F3EEFE", color: "#8B6FEC" },
  {
    icon: BookOpen,
    text: "What is a derivative?",
    bg: "#E7F1FE",
    color: "#2F7FE0",
  },
  {
    icon: Sparkles,
    text: "Real world example of trigonometry",
    bg: "#E7F8EE",
    color: "#22B573",
  },
];

const infoCards = [
  {
    icon: Zap,
    title: "Instant Answers",
    desc: "Get clear, step-by-step explanations.",
    bg: "#E7F1FE",
    color: "#2F7FE0",
  },
  {
    icon: Users,
    title: "Live Rooms",
    desc: "Discuss with peers in real-time.",
    bg: "#F3EEFE",
    color: "#8B6FEC",
  },
  {
    icon: BookOpen,
    title: "All Subjects",
    desc: "Math, Science, CS and more.",
    bg: "#FDF1E4",
    color: "#E2933B",
  },
  {
    icon: BarChart3,
    title: "Track Progress",
    desc: "Learn consistently and grow.",
    bg: "#E7F8EE",
    color: "#22B573",
  },
];

export default function DoubtSolver() {
  const navigate = useNavigate();
  const [subject, setSubject] = useState("Math");
  const [topic, setTopic] = useState("");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [peersStuck, setPeersStuck] = useState(0);
  const [loading, setLoading] = useState(false);
  const [joiningRoom, setJoiningRoom] = useState(false);
  const [detectedTopic, setDetectedTopic] = useState("");

  async function ask(q) {
    const text = q || question;
    if (!text.trim()) return; // topic check hata diya

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setQuestion("");
    setLoading(true);

    try {
      const data = await doubtService.askDoubt({ subject, question: text }); 
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: data.doubt.answer },
      ]);
      setDetectedTopic(data.doubt.topic); // AI detected topic
      setPeersStuck(data.peersStuckOnTopic || 0);
    } catch {
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
      const data = await roomService.findOrCreateRoom({ subject, topic:detectedTopic });
      navigate(`/rooms/${data.room._id}`);
    } catch {
      setJoiningRoom(false);
    }
  }

  const hasStarted = messages.length > 0;

  return (
    <div className="relative overflow-hidden">
      <Blob className="w-12 h-12 top-16 left-[6%] opacity-40" color="#B9AFF2" />
      <Blob className="w-8 h-8 top-40 right-[14%] opacity-40" color="#8FA8F2" />
      <StickyNote className="right-[3%] top-16 text-right">
        No doubt
        <br />
        is too small !
      </StickyNote>

      <div className="max-w-3xl mx-auto px-6 pt-14 pb-16 text-center">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6D5FE0] bg-[#EFEDFE] px-3 py-1.5 rounded-full mb-5">
          <Sparkles className="w-3 h-3" /> Learn · Ask · Solve · Grow
        </span>
        <h1 className="text-4xl font-extrabold text-[#1B1834] mb-3">
          Ask a <span className="text-[#6D5FE0]">doubt</span>
        </h1>
        <p className="text-[#6B6483] mb-8">
          Get an instant explanation, or jump into a live room if you need more
          help.
        </p>

        <div className="bg-white rounded-3xl shadow-lg p-5 text-left">
          <div className="flex gap-2 mb-3">
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="border border-[#EEECFB] rounded-xl px-3 py-2.5 text-sm bg-[#FAFAFF] text-[#1B1834]"
            >
              {SUBJECTS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            {detectedTopic && (
              <span className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-[#EFEDFE] text-[#6D5FE0]">
                <Sparkles className="w-3 h-3" /> {detectedTopic}
              </span>
            )}
          </div>

          {hasStarted && (
            <div className="flex flex-col gap-3 mb-3 max-h-80 overflow-y-auto py-2">
              <AnimatePresence initial={false}>
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "ai" && (
                      <div className="w-7 h-7 rounded-full bg-[#EFEDFE] flex items-center justify-center mr-2 flex-shrink-0">
                        <Sparkles className="w-3.5 h-3.5 text-[#6D5FE0]" />
                      </div>
                    )}
                    <div
                      className={`text-sm px-4 py-2.5 max-w-[78%] rounded-2xl ${
                        msg.role === "user"
                          ? "bg-[#6D5FE0] text-white rounded-br-sm"
                          : "bg-[#F6F5FE] text-[#1B1834] rounded-bl-sm"
                      }`}
                    >
                      {msg.role === "ai" ? (
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      ) : (
                        msg.content
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {loading && (
                <p className="text-xs text-[#6B6483] flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 animate-pulse" /> Thinking...
                </p>
              )}
            </div>
          )}

          <AnimatePresence>
            {peersStuck > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-3"
              >
                <div className="bg-[#FDF1E4] border border-[#F3D9A8] rounded-xl px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
                  <span className="text-xs text-[#8B5E12]">
                    {peersStuck} student{peersStuck > 1 ? "s" : ""} stuck on
                    this topic right now
                  </span>
                  <Button
                    size="sm"
                    disabled={joiningRoom}
                    onClick={handleJoinRoom}
                    className="bg-[#E2933B] hover:bg-[#cc8330] h-8 text-xs"
                  >
                    {joiningRoom ? "Joining..." : "Join live room"}{" "}
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="border border-[#EEECFB] rounded-2xl px-4 py-3">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  ask();
                }
              }}
              placeholder="Type your doubt here..."
              rows={2}
              className="w-full text-sm text-[#1B1834] placeholder:text-[#B4AFCB] resize-none outline-none bg-transparent"
            />
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-3 text-[#B4AFCB]">
                <Paperclip className="w-4 h-4" />{" "}
                <ImageIcon className="w-4 h-4" /> <Code2 className="w-4 h-4" />
              </div>
              <Button
                onClick={() => ask()}
                disabled={loading}
                className="rounded-xl bg-gradient-to-r from-[#7C6FEC] to-[#4F6FF0] h-9 px-4 text-sm"
              >
                <Send className="w-3.5 h-3.5 mr-1.5" /> Ask Now
              </Button>
            </div>
          </div>
        </div>

        {!hasStarted && (
          <>
            <p className="text-sm text-[#6B6483] mt-9 mb-3">
              Try asking something like
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-14">
              {suggestions.map((s) => (
                <button
                  key={s.text}
                  onClick={() => setQuestion(s.text)}
                  className="flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-full"
                  style={{ background: s.bg, color: s.color }}
                >
                  <s.icon className="w-3.5 h-3.5" /> {s.text}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-4 gap-4 max-md:grid-cols-2">
              {infoCards.map((c) => (
                <div
                  key={c.title}
                  className="bg-white rounded-2xl p-5 text-left shadow-sm"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
                    style={{ background: c.bg }}
                  >
                    <c.icon className="w-5 h-5" style={{ color: c.color }} />
                  </div>
                  <p className="text-sm font-semibold text-[#1B1834] mb-1">
                    {c.title}
                  </p>
                  <p className="text-xs text-[#6B6483]">{c.desc}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
