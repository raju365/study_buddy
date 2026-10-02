import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { StickyNote } from "../components/common/PageBg";

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
      await register({
        fullName: {
          firstName: form.firstName,
          lastName: form.lastName,
        },
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
    <div className="min-h-screen bg-[#F3F1FE] dark:bg-[#15131F] relative overflow-hidden px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
      {/* Background Notes - Hidden on small screens */}
      <div className="hidden md:block">
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
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-8 sm:mb-10 lg:mb-14">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#6D5FE0] flex items-center justify-center shrink-0">
            <GradIcon className="w-4.5 h-4.5 text-white" />
          </div>

          <span className="text-lg font-bold text-[#1B1834] dark:text-white">
            Study <span className="text-[#6D5FE0]">Buddy</span>
          </span>
        </div>
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
        {/* Left Section */}
        <div className="w-full max-w-md text-center lg:text-left">
          <span className="inline-block text-xs font-medium text-[#6D5FE0] bg-white dark:bg-[#1E1B2E] dark:border dark:border-[#2E2A42] px-3 py-1.5 rounded-full mb-4 sm:mb-5">
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
            Start Your Learning Journey{" "}
            <span className="text-[#6D5FE0] underline decoration-4">today</span>
          </h1>

          <p className="text-[#6B6483] dark:text-[#A39DC4] text-sm sm:text-base mb-7 sm:mb-8 leading-relaxed">
            Join Study Buddy and get instant answers, collaborate in live rooms,
            and track your progress — all in one place.
          </p>

          {/* Features */}
          <div className="flex flex-col gap-4 sm:gap-5 text-left">
            {features.map((f) => (
              <div key={f.title} className="flex items-center gap-3">
                <div
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shrink-0"
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

        {/* Register Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-[460px]"
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
            <h2 className="text-xl font-bold text-[#1B1834] dark:text-white mb-1">
              Create your account
            </h2>

            <p className="text-sm text-[#6B6483] dark:text-[#A39DC4] mb-5 sm:mb-6">
              Join Study Buddy and start solving doubts instantly.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* First + Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
                <div>
                  <label className="text-sm font-medium text-[#1B1834] dark:text-white mb-1.5 block">
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
                      className="pl-10 h-11 rounded-xl w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-[#1B1834] dark:text-white mb-1.5 block">
                    Last name
                  </label>

                  <Input
                    name="lastName"
                    placeholder="Barman"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                    className="h-11 rounded-xl w-full"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-medium text-[#1B1834] dark:text-white mb-1.5 block">
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
                    className="pl-10 h-11 rounded-xl w-full"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-sm font-medium text-[#1B1834] dark:text-white mb-1.5 block">
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
                    className="pl-10 h-11 rounded-xl w-full"
                  />
                </div>
              </div>

              {/* Grade */}
              <div>
                <label className="text-sm font-medium text-[#1B1834] dark:text-white mb-1.5 block">
                  Grade / Class (optional)
                </label>

                <Input
                  name="grade"
                  placeholder="Select your class"
                  value={form.grade}
                  onChange={handleChange}
                  className="h-11 rounded-xl w-full"
                />
              </div>

              {/* Error */}
              {error && <p className="text-sm text-red-500">{error}</p>}

              {/* Login */}
              <div
                className="
                  flex
                  flex-col
                  sm:flex-row
                  justify-center
                  items-center
                  gap-2
                  sm:gap-3
                  text-sm
                  text-[#6B6483]
                "
              >
                <span>Already have an account?</span>

                <Link to="/login">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-xl bg-[#EFEDFE] border-0 text-[#6D5FE0]"
                  >
                    Log in
                  </Button>
                </Link>
              </div>

              {/* Submit */}
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
                {loading ? "Creating account..." : "Create account →"}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
