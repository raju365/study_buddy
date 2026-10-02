import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import { Lock, GraduationCap, CheckCircle } from "lucide-react";
import authService from "../services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords don't match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(token, password);
      setDone(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Reset link is invalid or expired");
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
          {!done ? (
            <>
              <h2 className="text-xl font-bold text-[#1B1834] dark:text-white mb-1">Set a new password</h2>
              <p className="text-sm text-[#6B6483] dark:text-[#A39DC4] mb-6">Make sure it's at least 6 characters.</p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B4AFCB]" />
                  <Input
                    type="password"
                    placeholder="New password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 h-11 rounded-xl dark:bg-[#15131F] dark:border-[#2E2A42] dark:text-white"
                  />
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B4AFCB]" />
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    className="pl-10 h-11 rounded-xl dark:bg-[#15131F] dark:border-[#2E2A42] dark:text-white"
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" disabled={loading} className="h-11 rounded-xl bg-gradient-to-r from-[#7C6FEC] to-[#4F6FF0]">
                  {loading ? "Resetting..." : "Reset password"}
                </Button>
              </form>
            </>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-2">
              <div className="w-14 h-14 rounded-full bg-[#E7F8EE] dark:bg-[#132A1D] flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-[#22B573]" />
              </div>
              <h2 className="text-lg font-bold text-[#1B1834] dark:text-white mb-1">Password reset!</h2>
              <p className="text-sm text-[#6B6483] dark:text-[#A39DC4]">Redirecting you to login...</p>
            </motion.div>
          )}
          <Link to="/login" className="block text-center text-sm text-[#6D5FE0] font-medium mt-6">Back to login</Link>
        </div>
      </motion.div>
    </div>
  );
}