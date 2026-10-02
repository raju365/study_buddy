import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Search, Users, ArrowRight, Plus, MoreVertical } from "lucide-react";
import roomService from "../services/room.service";
import { Button } from "@/components/ui/button";
import { Blob, StickyNote } from "../components/common/PageBg";

const SUBJECT_STYLE = {
  Math: { bg: "#F3EEFE", border: "#8B6FEC", icon: "√x" },
  Science: { bg: "#E7F8EE", border: "#22B573", icon: "⚗" },
  Coding: { bg: "#FDF1E4", border: "#E2933B", icon: "</>" },
  General: { bg: "#E7F1FE", border: "#2F7FE0", icon: "✦" },
};

export default function StudyRooms() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    roomService.getActiveRooms().then((data) => setRooms(data.rooms));
  }, []);

  const filtered = rooms.filter((r) =>
    r.topic.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 relative">
      {/* Sticky notes — hidden on mobile, they only have room on wider screens */}
      <StickyNote className="hidden lg:block left-[1%] top-24">
        Study
        <br />
        Together
        <br />
        Grow
        <br />
        Faster
      </StickyNote>
      <StickyNote className="hidden lg:block right-[2%] top-24 text-right">
        Same
        <br />
        Goals
        <br />
        Brighter
        <br />
        Minds
      </StickyNote>
      <Blob
        className="hidden sm:block w-14 h-14 top-16 right-[10%] opacity-30"
        color="#B9AFF2"
      />

      <div className="max-w-2xl mx-auto text-center mb-8 relative z-10">
        <span className="inline-block text-xs font-medium text-[#6D5FE0] bg-[#EFEDFE] px-3 py-1.5 rounded-full mb-4">
          Live · Learn · Collaborate
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B1834] dark:text-white mb-2">
          Live Study <span className="text-[#6D5FE0]">Rooms</span>
        </h1>
        <p className="text-sm text-[#6B6483] dark:text-[#A39DC4] px-2">
          Jump into a room and study alongside others working on the same topic.
        </p>
      </div>

      <div className="flex gap-2.5 mb-6 flex-wrap max-w-4xl mx-auto">
        <div className="flex-1 min-w-[160px] flex items-center gap-2 bg-white dark:bg-[#1E1B2E] rounded-xl px-4 border border-[#EEECFB] dark:border-[#2E2A42]">
          <Search className="w-4 h-4 text-[#B4AFCB] flex-shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search rooms..."
            className="py-2.5 text-sm outline-none bg-transparent flex-1 min-w-0 placeholder:text-[#B4AFCB] dark:placeholder:text-[#6B6483] text-[#1B1834] dark:text-white"
          />
        </div>
        <select className="bg-white dark:bg-[#1E1B2E] rounded-xl px-3 text-sm border border-[#EEECFB] dark:border-[#2E2A42] text-[#6B6483] dark:text-[#A39DC4] flex-shrink-0">
          <option>All Subjects</option>
          {Object.keys(SUBJECT_STYLE).map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <Button className="rounded-xl bg-gradient-to-r from-[#7C6FEC] to-[#4F6FF0] px-4 flex-shrink-0">
          <Plus className="w-4 h-4 sm:mr-1.5" />{" "}
          <span className="hidden sm:inline">Create Room</span>
        </Button>
      </div>

      <div className="max-w-4xl mx-auto flex flex-col gap-3">
        {filtered.length === 0 ? (
          <p className="text-sm text-[#6B6483] text-center py-16">
            No active rooms — ask a doubt to start one.
          </p>
        ) : (
          filtered.map((room, i) => {
            const style = SUBJECT_STYLE[room.subject] || SUBJECT_STYLE.General;
            return (
              <motion.div
                key={room._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <div
                  className="bg-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm border-l-4"
                  style={{ borderColor: style.border }}
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-base sm:text-lg font-bold flex-shrink-0"
                      style={{ background: style.bg, color: style.border }}
                    >
                      {style.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-[#1B1834] mb-1 truncate">
                        {room.topic}
                      </p>
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span
                          className="text-[11px] font-medium px-2.5 py-0.5 rounded-full"
                          style={{ background: style.bg, color: style.border }}
                        >
                          {room.subject}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-[#6B6483] whitespace-nowrap">
                          <Users className="w-3 h-3" />{" "}
                          {room.activeMembers.length} active
                        </span>
                        <span className="flex items-center gap-1 text-xs text-[#22B573] whitespace-nowrap">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#22B573]" />{" "}
                          Live now
                        </span>
                      </div>
                      <div className="flex -space-x-2">
                        {room.activeMembers.slice(0, 3).map((m) => (
                          <div
                            key={m._id}
                            className="w-6 h-6 rounded-full bg-[#EFEDFE] border-2 border-white flex items-center justify-center text-[10px] font-medium text-[#6D5FE0]"
                          >
                            {m.fullName?.firstName?.[0]}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0 self-stretch sm:self-auto">
                    <Button
                      onClick={() => navigate(`/rooms/${room._id}`)}
                      className="rounded-xl bg-gradient-to-r from-[#7C6FEC] to-[#4F6FF0] flex-1 sm:flex-none"
                    >
                      Join <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                    <button className="w-9 h-9 rounded-full flex items-center justify-center text-[#B4AFCB] hover:bg-[#F6F5FE] flex-shrink-0">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
