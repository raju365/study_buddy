/*
 * -------------------------------------------------------
 * File : Dashboard.jsx
 * Description : Student progress dashboard — subject-wise
 *               doubts solved, shown as a bar chart
 * Author : Raju Barman
 * -------------------------------------------------------
 */

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell
} from "recharts";
import { Flame, BookCheck } from "lucide-react";
import doubtService from "../services/doubt.service";
import { useAuth } from "../context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = {
  Math: "#7F77DD",
  Science: "#1D9E75",
  Coding: "#D85A30",
  General: "#EF9F27",
};

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const data = await doubtService.getProgress();
      const formatted = data.stats.map((s) => ({
        subject: s._id,
        count: s.count,
      }));
      setStats(formatted);
    } catch (err) {
      console.error("Failed to load progress:", err);
    } finally {
      setLoading(false);
    }
  }

  const totalDoubts = stats.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="min-h-screen bg-[#FAF9FF] px-4 py-8 flex justify-center">
      <div className="w-full max-w-2xl">
        <h1 className="text-xl font-semibold mb-1">Your Progress</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Track how many doubts you've cleared across subjects.
        </p>

        {/* Top stat cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-0 shadow-sm bg-[#EEEDFE]">
              <CardContent className="pt-5 flex items-center gap-3">
                <Flame className="w-6 h-6 text-[#3C3489]" />
                <div>
                  <p className="text-2xl font-semibold text-[#26215C]">
                    {user?.streak ?? 0}
                  </p>
                  <p className="text-xs text-[#534AB7]">Day streak</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <Card className="border-0 shadow-sm bg-[#E1F5EE]">
              <CardContent className="pt-5 flex items-center gap-3">
                <BookCheck className="w-6 h-6 text-[#0F6E56]" />
                <div>
                  <p className="text-2xl font-semibold text-[#04342C]">
                    {totalDoubts}
                  </p>
                  <p className="text-xs text-[#0F6E56]">Doubts solved</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Chart */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Subject-wise breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                Loading...
              </p>
            ) : stats.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                No doubts solved yet — go ask one!
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={stats}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="subject" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {stats.map((entry, i) => (
                      <Cell key={i} fill={COLORS[entry.subject] || "#7F77DD"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}