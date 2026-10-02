import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Mail, ArrowLeft, GraduationCap } from "lucide-react";
import authService from "../services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F3F1FE] dark:bg-[#15131F] flex flex-col items-center justify-center px-4">
      <div className="flex items-center gap-2 mb-10">
        <div className="w-8 h-8 rounded-lg bg-[#6D5FE0] flex items-center justify-center">
          <GraduationCap className="w-4.5 h-4.5 text-white" />
        </div>
        <span className="text-lg font-bold text-[#1B1834] dark:text-white">Study <span className="text-[#6D5FE0]">Buddy</span></span>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <div className="w-[400px] bg-white dark:bg-[#1E1B2E] dark:border dark:border-[#2E2A42] rounded-3xl shadow-xl dark:shadow-none p-9">
          {!sent ? (
            <>
              <h2 className="text-xl font-bold text-[#1B1834] dark:text-white mb-1">Forgot password?</h2>
              <p className="text-sm text-[#6B6483] dark:text-[#A39DC4] mb-6">
                Enter your email and we'll send you a reset link.
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B4AFCB]" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 h-11 rounded-xl dark:bg-[#15131F] dark:border-[#2E2A42] dark:text-white"
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" disabled={loading} className="h-11 rounded-xl bg-gradient-to-r from-[#7C6FEC] to-[#4F6FF0]">
                  {loading ? "Sending..." : "Send reset link"}
                </Button>
              </form>
            </>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-2">
              <div className="w-14 h-14 rounded-full bg-[#E7F8EE] dark:bg-[#132A1D] flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-[#22B573]" />
              </div>
              <h2 className="text-lg font-bold text-[#1B1834] dark:text-white mb-1">Check your email</h2>
              <p className="text-sm text-[#6B6483] dark:text-[#A39DC4]">
                If an account exists for <b>{email}</b>, a reset link has been sent.
              </p>
            </motion.div>
          )}

          <Link to="/login" className="flex items-center justify-center gap-1.5 text-sm text-[#6D5FE0] font-medium mt-6">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}