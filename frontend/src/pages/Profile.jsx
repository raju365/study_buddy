/*
 * -------------------------------------------------------
 * File : Profile.jsx
 * Description : View and update student profile details
 * Author : Raju Barman
 * -------------------------------------------------------
 */

import { useState } from "react";
import { motion } from "motion/react";
import {
  User,
  GraduationCap,
  Flame,
  CheckSquare,
  Save,
  Plus,
  Lock,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import authService from "../services/auth.service";

export default function Profile() {
  const ALL_SUBJECTS = ["Math", "Science", "Coding", "General"];
  const { user, updateProfile } = useAuth();

  const [firstName, setFirstName] = useState(user?.fullName?.firstName || "");
  const [lastName, setLastName] = useState(user?.fullName?.lastName || "");
  const [grade, setGrade] = useState(user?.grade || "");
  const [subjects, setSubjects] = useState(user?.subjects || []);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");
  const [pwSaving, setPwSaving] = useState(false);

  function toggleSubject(s) {
    setSubjects((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await updateProfile({ firstName, lastName, grade, subjects });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setSaving(false);
    }
  }
  async function handleChangePassword(e) {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");

    if (newPassword !== confirmPassword) {
      setPwError("New passwords don't match");
      return;
    }
    if (newPassword.length < 6) {
      setPwError("New password must be at least 6 characters");
      return;
    }

    setPwSaving(true);
    try {
      await authService.changePassword({ currentPassword, newPassword });
      setPwSuccess("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPwError(err.response?.data?.message || "Failed to update password");
    } finally {
      setPwSaving(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <h1 className="text-2xl font-bold text-[#1B1834] dark:text-white mb-1">
        Your Profile
      </h1>
      <p className="text-sm text-[#6B6483] dark:text-[#A39DC4] mb-7">
        Update your details and subjects of interest.
      </p>

      {/* Avatar + quick stats */}
      <div className="flex items-center gap-4 mb-7 flex-wrap">
        <div className="w-16 h-16 rounded-full bg-[#6D5FE0] flex items-center justify-center text-2xl font-bold text-white shrink-0">
          {user?.fullName?.firstName?.[0]}
          {user?.fullName?.lastName?.[0]}
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 bg-[#FDEEF0] px-3.5 py-2 rounded-xl">
            <Flame className="w-4 h-4 text-[#E8637A]" />
            <span className="text-sm font-semibold text-[#1B1834]">
              {user?.streak ?? 0}
            </span>
            <span className="text-xs text-[#6B6483]">streak</span>
          </div>
          <div className="flex items-center gap-2 bg-[#E7F8EE] px-3.5 py-2 rounded-xl">
            <CheckSquare className="w-4 h-4 text-[#22B573]" />
            <span className="text-sm font-semibold text-[#1B1834]">
              {user?.doubtsSolved ?? 0}
            </span>
            <span className="text-xs text-[#6B6483]">solved</span>
          </div>
        </div>
      </div>

      <Card className="border-0 shadow-sm dark:bg-[#1E1B2E] dark:border dark:border-[#2E2A42] dark:shadow-none">
        <CardContent className="pt-6">
          <form onSubmit={handleSave} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-[#1B1834] dark:text-white mb-1.5 block">
                  First name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B4AFCB]" />
                  <Input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="pl-10 h-11 rounded-xl dark:bg-[#15131F] dark:border-[#2E2A42] dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-[#1B1834] dark:text-white mb-1.5 block">
                  Last name
                </label>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="h-11 rounded-xl dark:bg-[#15131F] dark:border-[#2E2A42] dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-[#1B1834] dark:text-white mb-1.5 block">
                Email
              </label>
              <Input
                value={user?.email || ""}
                disabled
                className="h-11 rounded-xl bg-[#F6F5FE] dark:bg-[#2A2640] text-[#6B6483] dark:text-[#A39DC4]"
              />
              <p className="text-xs text-[#B4AFCB] mt-1">
                Email can't be changed
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-[#1B1834] dark:text-white mb-1.5 block">
                Grade / Class
              </label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B4AFCB]" />
                <Input
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  placeholder="e.g. 12th"
                  className="pl-10 h-11 rounded-xl dark:bg-[#15131F] dark:border-[#2E2A42] dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-[#1B1834] dark:text-white mb-2 block">
                Subjects of interest
              </label>
              <div className="flex flex-wrap gap-2">
                {ALL_SUBJECTS.map((s) => {
                  const active = subjects.includes(s);
                  return (
                    <button
                      type="button"
                      key={s}
                      onClick={() => toggleSubject(s)}
                      className={`flex items-center gap-1.5 text-sm font-medium px-3.5 py-2 rounded-full border transition-colors ${
                        active
                          ? "bg-[#EFEDFE] dark:bg-[#2A2345] border-[#6D5FE0] text-[#6D5FE0]"
                          : "bg-white dark:bg-[#15131F] border-[#EEECFB] dark:border-[#2E2A42] text-[#6B6483] dark:text-[#A39DC4]"
                      }`}
                    >
                      {active ? (
                        <X className="w-3.5 h-3.5" />
                      ) : (
                        <Plus className="w-3.5 h-3.5" />
                      )}
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-3 mt-1">
              <Button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-linear-to-r from-[#7C6FEC] to-[#4F6FF0] h-11 px-6"
              >
                <Save className="w-4 h-4 mr-2" />{" "}
                {saving ? "Saving..." : "Save changes"}
              </Button>
              {saved && (
                <motion.span
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-[#22B573] font-medium"
                >
                  ✓ Saved
                </motion.span>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-sm dark:bg-[#1E1B2E] dark:border dark:border-[#2E2A42] dark:shadow-none mt-5">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-[#1B1834] dark:text-white mb-1">
            Change Password
          </h3>
          <p className="text-sm text-[#6B6483] dark:text-[#A39DC4] mb-5">
            Update your password to keep your account secure.
          </p>

          <form
            onSubmit={handleChangePassword}
            className="flex flex-col gap-4 max-w-md"
          >
            <div>
              <label className="text-sm font-medium text-[#1B1834] dark:text-white mb-1.5 block">
                Current password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B4AFCB]" />
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="pl-10 h-11 rounded-xl dark:bg-[#15131F] dark:border-[#2E2A42] dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-[#1B1834] dark:text-white mb-1.5 block">
                New password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B4AFCB]" />
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="pl-10 h-11 rounded-xl dark:bg-[#15131F] dark:border-[#2E2A42] dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-[#1B1834] dark:text-white mb-1.5 block">
                Confirm new password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B4AFCB]" />
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="pl-10 h-11 rounded-xl dark:bg-[#15131F] dark:border-[#2E2A42] dark:text-white"
                />
              </div>
            </div>

            {pwError && <p className="text-sm text-red-500">{pwError}</p>}
            {pwSuccess && <p className="text-sm text-[#22B573]">{pwSuccess}</p>}

            <Button
              type="submit"
              disabled={pwSaving}
              className="rounded-xl bg-gradient-to-r from-[#7C6FEC] to-[#4F6FF0] h-11 w-fit px-6"
            >
              {pwSaving ? "Updating..." : "Update password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
