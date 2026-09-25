import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";
import { Flame, CheckSquare, BookOpen, TrendingUp, Target, Trophy, BarChart3, ArrowRight } from "lucide-react";
import doubtService from "../services/doubt.service";
import { useAuth } from "../context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SUBJECT_STYLE = {
  Math: { fill: "#7C6FEC", icon: "Σ" },
  Science: { fill: "#22B573", icon: "⚗" },
  Coding: { fill: "#E2933B", icon: "</>" },
  General: { fill: "#2F7FE0", icon: "✦" },
};

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState([]);

  useEffect(() => {
    doubtService.getProgress().then((data) => {
      setStats(data.stats.map((s) => ({ subject: s._id, count: s.count })));
    });
  }, []);

  const total = stats.reduce((s, x) => s + x.count, 0);
  const subjectsActive = stats.length;

  const statCards = [
    { icon: Flame, label: "Day streak", value: user?.streak ?? 0, sub: "Start today and build momentum!", bg: "#FDEEF0", iconBg: "#F9D3DA", color: "#E8637A" },
    { icon: CheckSquare, label: "Doubts solved", value: total, sub: "Great job! Keep it up!", bg: "#E7F8EE", iconBg: "#C9F0D8", color: "#22B573" },
    { icon: BookOpen, label: "Subjects active", value: subjectsActive, sub: "Explore more topics", bg: "#E7F1FE", iconBg: "#CBE1FC", color: "#2F7FE0" },
    { icon: TrendingUp, label: "Overall progress", value: "70%", sub: "You're on the right path!", bg: "#FDF1E4", iconBg: "#FBE2BE", color: "#E2933B" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-start justify-between gap-6 mb-7 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[#1B1834]">Good to see you, {user?.fullName?.firstName}! 👋</h1>
          <p className="text-sm text-[#6B6483] mt-1">Keep learning, keep growing. Track your progress and stay consistent.</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm px-5 py-3.5 max-w-xs text-sm text-[#1B1834] relative">
          <span className="text-[#B4AFCB] text-lg leading-none">"</span> Small steps every day lead to big results.
          <p className="text-xs text-[#6D5FE0] mt-1 font-medium">— Study Buddy</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6 max-md:grid-cols-2">
        {statCards.map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="border-0" style={{ background: c.bg }}>
              <CardContent className="pt-5 pb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3" style={{ background: c.iconBg }}>
                  <c.icon className="w-5 h-5" style={{ color: c.color }} />
                </div>
                <p className="text-2xl font-bold text-[#1B1834]">{c.value}</p>
                <p className="text-xs text-[#6B6483] mb-2">{c.label}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[11px]" style={{ color: c.color }}>{c.sub}</span>
                  <ArrowRight className="w-3.5 h-3.5" style={{ color: c.color }} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-5 max-lg:grid-cols-1">
        <Card className="col-span-2 border-0 shadow-sm max-lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-[#EFEDFE] flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-[#6D5FE0]" />
                </div>
                <h3 className="font-semibold text-[#1B1834]">Subject-wise breakdown</h3>
              </div>
            </div>
            <p className="text-xs text-[#6B6483] mb-5 ml-11">See how many doubts you've solved in each subject.</p>

            {stats.length === 0 ? (
              <p className="text-sm text-[#6B6483] text-center py-16">No doubts solved yet — go ask one!</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={stats}>
                  <XAxis dataKey="subject" tick={{ fontSize: 12, fill: "#6B6483" }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: "transparent" }} />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={70}>
                    <LabelList dataKey="count" position="top" style={{ fill: "#1B1834", fontWeight: 600, fontSize: 13 }} />
                    {stats.map((entry, i) => (
                      <Cell key={i} fill={SUBJECT_STYLE[entry.subject]?.fill || "#7C6FEC"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-[#1B1834] mb-4">Recent Activity</h3>
            <div className="flex flex-col gap-4">
              {[
                { icon: "Σ", text: "Solved a Math doubt", time: "2 hours ago", bg: "#EFEDFE", color: "#6D5FE0" },
                { icon: "👥", text: "Joined a room: Trigonometry", time: "5 hours ago", bg: "#E7F1FE", color: "#2F7FE0" },
                { icon: "⚗", text: "Asked a Science question", time: "1 day ago", bg: "#E7F8EE", color: "#22B573" },
              ].map((a) => (
                <div key={a.text} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm flex-shrink-0" style={{ background: a.bg }}>
                    {a.icon}
                  </div>
                  <div>
                    <p className="text-sm text-[#1B1834]">{a.text}</p>
                    <p className="text-xs text-[#B4AFCB]">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-5 mt-5 max-lg:grid-cols-1">
        {[
          { icon: Target, title: "Set a Goal", desc: "Stay focused and achieve more.", cta: "Set Goal", bg: "#EFEDFE", color: "#6D5FE0" },
          { icon: Trophy, title: "Improve Streak", desc: "Solve at least one doubt today.", cta: "Ask a Doubt", bg: "#E7F8EE", color: "#22B573" },
          { icon: BarChart3, title: "View Detailed Analytics", desc: "Dive deeper into your progress.", cta: "Open Analytics", bg: "#E7F1FE", color: "#2F7FE0" },
        ].map((c) => (
          <Card key={c.title} className="border-0 shadow-sm">
            <CardContent className="pt-6">
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3" style={{ background: c.bg }}>
                <c.icon className="w-5 h-5" style={{ color: c.color }} />
              </div>
              <p className="font-semibold text-[#1B1834] text-sm mb-1">{c.title}</p>
              <p className="text-xs text-[#6B6483] mb-4">{c.desc}</p>
              <Button size="sm" className="rounded-lg w-full" style={{ background: c.bg, color: c.color }}>
                {c.cta} →
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}