import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  User,
  Mail,
  Lock,
  GraduationCap as GradIcon,
  Users,
  Zap,
  BarChart3,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Blob, StickyNote } from "../components/common/PageBg";

const features = [
  {
    icon: Users,
    title: "Learn Together",
    desc: "Join study rooms and grow with peers",
    bg: "#E7F1FE",
    color: "#2F7FE0",
  },
  {
    icon: Zap,
    title: "Solve Faster",
    desc: "Get instant, step-by-step solutions",
    bg: "#E7F8EE",
    color: "#22B573",
  },
  {
    icon: BarChart3,
    title: "Track Progress",
    desc: "Stay consistent and achieve your goals",
    bg: "#EFEDFE",
    color: "#6D5FE0",
  },
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    grade: "",
  });
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
      await register({
        fullName: { firstName: form.firstName, lastName: form.lastName },
        email: form.email,
        password: form.password,
        grade: form.grade,
        subjects: [],
      });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F3F1FE] relative overflow-hidden px-8 py-10">
      <StickyNote className="right-[4%] top-[10%] text-right">
        Good
        <br />
        Questions
        <br />
        Better
        <br />
        Learning
      </StickyNote>
      <StickyNote className="right-[6%] bottom-[8%] text-right">
        Small
        <br />
        Steps
        <br />
        Big Results
      </StickyNote>

      <div className="flex items-center justify-between mb-14">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#6D5FE0] flex items-center justify-center">
            <GradIcon className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-lg font-bold text-[#1B1834]">
            Study <span className="text-[#6D5FE0]">Buddy</span>
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto flex items-center justify-between gap-16 flex-wrap">
        <div className="max-w-md">
          <span className="inline-block text-xs font-medium text-[#6D5FE0] bg-white px-3 py-1.5 rounded-full mb-5">
            ✦ Learn · Solve · Grow
          </span>
          <h1 className="text-5xl font-extrabold text-[#1B1834] leading-tight mb-5">
            Start Your Learning Journey{" "}
            <span className="text-[#6D5FE0] underline decoration-4">today</span>
          </h1>
          <p className="text-[#6B6483] text-base mb-8">
            Join Study Buddy and get instant answers, collaborate in live rooms,
            and track your progress — all in one place.
          </p>
          <div className="flex flex-col gap-5">
            {features.map((f) => (
              <div key={f.title} className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center"
                  style={{ background: f.bg }}
                >
                  <f.icon className="w-5 h-5" style={{ color: f.color }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1B1834]">
                    {f.title}
                  </p>
                  <p className="text-xs text-[#6B6483]">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="w-[460px] bg-white rounded-3xl shadow-xl p-9">
            <h2 className="text-xl font-bold text-[#1B1834] mb-1">
              Create your account
            </h2>
            <p className="text-sm text-[#6B6483] mb-6">
              Join Study Buddy and start solving doubts instantly.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-[#1B1834] mb-1.5 block">
                    First name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B4AFCB]" />
                    <Input
                      name="firstName"
                      placeholder="Raju"
                      value={form.firstName}
                      onChange={handleChange}
                      required
                      className="pl-10 h-11 rounded-xl"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#1B1834] mb-1.5 block">
                    Last name
                  </label>
                  <Input
                    name="lastName"
                    placeholder="Barman"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                    className="h-11 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-[#1B1834] mb-1.5 block">
                  Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B4AFCB]" />
                  <Input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="pl-10 h-11 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-[#1B1834] mb-1.5 block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B4AFCB]" />
                  <Input
                    name="password"
                    type="password"
                    placeholder="Create a strong password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="pl-10 h-11 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-[#1B1834] mb-1.5 block">
                  Grade / Class (optional)
                </label>
                <Input
                  name="grade"
                  placeholder="Select your class"
                  value={form.grade}
                  onChange={handleChange}
                  className="h-11 rounded-xl"
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}
              <div className="flex justify-center items-center gap-3 text-sm text-[#6B6483]">
                Already have an account?
                <Link to="/login">
                  <Button
                    variant="outline"
                    className="rounded-xl bg-[#EFEDFE] border-0 text-[#6D5FE0]"
                  >
                    Log in
                  </Button>
                </Link>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="h-11 rounded-xl bg-gradient-to-r from-[#7C6FEC] to-[#4F6FF0] hover:opacity-90 mt-1"
              >
                {loading ? "Creating account..." : "Create account →"}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
