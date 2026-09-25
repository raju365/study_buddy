import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import { Mail, Lock, MessageCircle, Users, BarChart3, GraduationCap } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Blob, StickyNote } from "../components/common/PageBg";

const features = [
  { icon: MessageCircle, title: "Instant Doubt Solving", desc: "Get clear, step-by-step answers", bg: "#EFEDFE", color: "#6D5FE0" },
  { icon: Users, title: "Live Study Rooms", desc: "Collaborate and learn together", bg: "#E7F1FE", color: "#2F7FE0" },
  { icon: BarChart3, title: "Track Your Progress", desc: "Stay consistent and achieve more", bg: "#E7F8EE", color: "#22B573" },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F3F1FE] relative overflow-hidden px-8 py-10">
      <Blob className="w-16 h-16 top-24 right-[8%] opacity-30" color="#B9AFF2" />
      <Blob className="w-10 h-10 bottom-[30%] right-[22%] opacity-40" color="#8FA8F2" />
      <StickyNote className="right-[4%] top-[28%] text-right">Good<br/>Questions<br/>Better<br/>Learning</StickyNote>
      <StickyNote className="right-[6%] bottom-[10%]">Discipline today<br/>A brighter tomorrow</StickyNote>
      <StickyNote className="left-[4%] bottom-[6%]">Better<br/>Students<br/>Brighter<br/>Futures</StickyNote>

      <div className="flex items-center gap-2 mb-16">
        <div className="w-8 h-8 rounded-lg bg-[#6D5FE0] flex items-center justify-center">
          <GraduationCap className="w-4.5 h-4.5 text-white" />
        </div>
        <span className="text-lg font-bold text-[#1B1834]">Study <span className="text-[#6D5FE0]">Buddy</span></span>
      </div>

      <div className="max-w-5xl mx-auto flex items-center justify-between gap-16 flex-wrap">
        <div className="max-w-md">
          <span className="inline-block text-xs font-medium text-[#6D5FE0] bg-[#EFEDFE] px-3 py-1.5 rounded-full mb-5">
            ✦ Learn · Solve · Grow
          </span>
          <h1 className="text-5xl font-extrabold text-[#1B1834] leading-tight mb-5">
            Your Study Partner<br /><span className="text-[#6D5FE0]">Anytime, Anywhere</span>
          </h1>
          <p className="text-[#6B6483] text-base mb-8">
            Ask doubts, join live rooms, track your progress and learn together with a supportive community.
          </p>
          <div className="flex flex-col gap-5">
            {features.map((f) => (
              <div key={f.title} className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: f.bg }}>
                  <f.icon className="w-5 h-5" style={{ color: f.color }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1B1834]">{f.title}</p>
                  <p className="text-xs text-[#6B6483]">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <div className="w-[420px] bg-white rounded-3xl shadow-xl p-9">
            <h2 className="text-2xl font-bold text-center text-[#1B1834] mb-1">Welcome back, 👋</h2>
            <p className="text-sm text-center text-[#6B6483] mb-7">Log in to continue solving doubts.</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-[#1B1834] mb-1.5 block">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B4AFCB]" />
                  <Input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required className="pl-10 h-11 rounded-xl" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-[#1B1834] mb-1.5 block">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B4AFCB]" />
                  <Input name="password" type="password" placeholder="Enter your password" value={form.password} onChange={handleChange} required className="pl-10 h-11 rounded-xl" />
                </div>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button type="submit" disabled={loading} className="h-11 rounded-xl bg-gradient-to-r from-[#7C6FEC] to-[#4F6FF0] hover:opacity-90 mt-1">
                {loading ? "Logging in..." : "Log in →"}
              </Button>
            </form>

            <p className="text-sm text-center mt-6 text-[#6B6483]">
              New here? <Link to="/register" className="text-[#6D5FE0] font-semibold">Create an account</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}