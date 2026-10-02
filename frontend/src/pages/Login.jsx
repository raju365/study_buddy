import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  Mail,
  Lock,
  MessageCircle,
  Users,
  BarChart3,
  GraduationCap,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Blob, StickyNote } from "../components/common/PageBg";

const features = [
  {
    icon: MessageCircle,
    title: "Instant Doubt Solving",
    desc: "Get clear, step-by-step answers",
    bg: "#EFEDFE",
    color: "#6D5FE0",
  },
  {
    icon: Users,
    title: "Live Study Rooms",
    desc: "Collaborate and learn together",
    bg: "#E7F1FE",
    color: "#2F7FE0",
  },
  {
    icon: BarChart3,
    title: "Track Your Progress",
    desc: "Stay consistent and achieve more",
    bg: "#E7F8EE",
    color: "#22B573",
  },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
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
    <div
      className="
        min-h-screen
        bg-[#F3F1FE]
        dark:bg-[#15131F]
        relative
        overflow-hidden
        px-4
        sm:px-6
        lg:px-8
        py-6
        sm:py-8
        lg:py-10
      "
    >
      {/* Decorative background elements */}
      <div className="hidden md:block">
        <Blob
          className="w-16 h-16 top-24 right-[8%] opacity-30"
          color="#B9AFF2"
        />

        <Blob
          className="w-10 h-10 bottom-[30%] right-[22%] opacity-40"
          color="#8FA8F2"
        />

        <StickyNote className="right-[4%] top-[28%] text-right">
          Good
          <br />
          Questions
          <br />
          Better
          <br />
          Learning
        </StickyNote>

        <StickyNote className="right-[6%] bottom-[10%]">
          Discipline today
          <br />A brighter tomorrow
        </StickyNote>

        <StickyNote className="left-[4%] bottom-[6%]">
          Better
          <br />
          Students
          <br />
          Brighter
          <br />
          Futures
        </StickyNote>
      </div>

      {/* Header */}
      <div className="flex items-center gap-2 mb-8 sm:mb-10 lg:mb-16">
        <div className="w-8 h-8 rounded-lg bg-[#6D5FE0] flex items-center justify-center shrink-0">
          <GraduationCap className="w-4.5 h-4.5 text-white" />
        </div>

        <span className="text-lg font-bold text-[#1B1834] dark:text-white">
          Study <span className="text-[#6D5FE0]">Buddy</span>
        </span>
      </div>

      {/* Main Content */}
      <div
        className="
          w-full
          max-w-5xl
          mx-auto
          flex
          flex-col
          lg:flex-row
          items-center
          lg:items-center
          justify-between
          gap-10
          sm:gap-12
          lg:gap-16
        "
      >
        {/* Left Content */}
        <div className="w-full max-w-md text-center lg:text-left">
          <span
            className="
              inline-block
              text-xs
              font-medium
              text-[#6D5FE0]
              bg-[#EFEDFE]
              px-3
              py-1.5
              rounded-full
              mb-4
              sm:mb-5
            "
          >
            ✦ Learn · Solve · Grow
          </span>

          <h1
            className="
              text-3xl
              sm:text-4xl
              lg:text-5xl
              font-extrabold
              text-[#1B1834]
              dark:text-white
              leading-tight
              mb-4
              sm:mb-5
            "
          >
            Your Study Partner
            <br />
            <span className="text-[#6D5FE0]">Anytime, Anywhere</span>
          </h1>

          <p
            className="
              text-[#6B6483]
              dark:text-[#A39DC4]
              text-sm
              sm:text-base
              leading-relaxed
              mb-7
              sm:mb-8
            "
          >
            Ask doubts, join live rooms, track your progress and learn together
            with a supportive community.
          </p>

          {/* Features */}
          <div className="flex flex-col gap-4 sm:gap-5 text-left">
            {features.map((f) => (
              <div key={f.title} className="flex items-center gap-3">
                <div
                  className="
                    w-10
                    h-10
                    sm:w-11
                    sm:h-11
                    rounded-full
                    flex
                    items-center
                    justify-center
                    shrink-0
                  "
                  style={{ background: f.bg }}
                >
                  <f.icon className="w-5 h-5" style={{ color: f.color }} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#1B1834] dark:text-white">
                    {f.title}
                  </p>

                  <p className="text-xs text-[#6B6483] dark:text-[#A39DC4]">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-[420px]"
        >
          <div
            className="
              w-full
              bg-white
              dark:bg-[#1E1B2E]
              dark:border
              dark:border-[#2E2A42]
              rounded-2xl
              sm:rounded-3xl
              shadow-xl
              dark:shadow-none
              p-5
              sm:p-7
              lg:p-9
            "
          >
            <h2
              className="
                text-xl
                sm:text-2xl
                font-bold
                text-center
                text-[#1B1834]
                dark:text-white
                mb-1
              "
            >
              Welcome back, 👋
            </h2>

            <p
              className="
                text-sm
                text-center
                text-[#6B6483]
                dark:text-[#A39DC4]
                mb-6
                sm:mb-7
              "
            >
              Log in to continue solving doubts.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Email */}
              <div>
                <label
                  className="
                    text-sm
                    font-medium
                    text-[#1B1834]
                    dark:text-white
                    mb-1.5
                    block
                  "
                >
                  Email
                </label>

                <div className="relative">
                  <Mail
                    className="
                      w-4
                      h-4
                      absolute
                      left-3.5
                      top-1/2
                      -translate-y-1/2
                      text-[#B4AFCB]
                    "
                  />

                  <Input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="
                      pl-10
                      h-11
                      rounded-xl
                      w-full
                    "
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5 gap-2">
                  <label
                    className="
                      text-sm
                      font-medium
                      text-[#1B1834]
                      dark:text-white
                    "
                  >
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="
                      text-xs
                      text-[#6D5FE0]
                      font-medium
                      hover:underline
                      whitespace-nowrap
                    "
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <Lock
                    className="
                      w-4
                      h-4
                      absolute
                      left-3.5
                      top-1/2
                      -translate-y-1/2
                      text-[#B4AFCB]
                    "
                  />

                  <Input
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="
                      pl-10
                      h-11
                      rounded-xl
                      w-full
                      dark:bg-[#15131F]
                      dark:border-[#2E2A42]
                      dark:text-white
                    "
                  />
                </div>
              </div>

              {/* Error */}
              {error && <p className="text-sm text-red-500">{error}</p>}

              {/* Login Button */}
              <Button
                type="submit"
                disabled={loading}
                className="
                  w-full
                  h-11
                  rounded-xl
                  bg-gradient-to-r
                  from-[#7C6FEC]
                  to-[#4F6FF0]
                  hover:opacity-90
                  mt-1
                "
              >
                {loading ? "Logging in..." : "Log in →"}
              </Button>
            </form>

            {/* Register */}
            <p
              className="
                text-sm
                text-center
                mt-5
                sm:mt-6
                text-[#6B6483]
                dark:text-[#A39DC4]
              "
            >
              New here?{" "}
              <Link
                to="/register"
                className="text-[#6D5FE0] font-semibold hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
