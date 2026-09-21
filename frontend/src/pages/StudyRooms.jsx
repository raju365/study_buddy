/*
 * -------------------------------------------------------
 * File : StudyRooms.jsx
 * Description : Lists all active study rooms so students
 *               can browse and join without asking a doubt
 * Author : Raju Barman
 * -------------------------------------------------------
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Users, ArrowRight, DoorOpen } from "lucide-react";
import roomService from "../services/room.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const SUBJECT_COLORS = {
  Math: { bg: "#EEEDFE", text: "#3C3489" },
  Science: { bg: "#E1F5EE", text: "#0F6E56" },
  Coding: { bg: "#FAECE7", text: "#D85A30" },
  General: { bg: "#FEF3D6", text: "#B8790C" },
};

export default function StudyRooms() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRooms();
  }, []);

  async function fetchRooms() {
    try {
      const data = await roomService.getActiveRooms();
      setRooms(data.rooms);
    } catch (err) {
      console.error("Failed to load rooms:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleJoin(roomId) {
    navigate(`/rooms/${roomId}`);
  }

  return (
    <div className="min-h-screen bg-[#FAF9FF] px-4 py-8 flex justify-center">
      <div className="w-full max-w-2xl">
        <h1 className="text-xl font-semibold mb-1">Live Study Rooms</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Jump into a room and study alongside others working on the same topic.
        </p>

        {loading ? (
          <p className="text-sm text-muted-foreground text-center py-12">
            Loading rooms...
          </p>
        ) : rooms.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="py-12 flex flex-col items-center gap-2 text-center">
              <DoorOpen className="w-8 h-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No active rooms right now. Ask a doubt — if others are stuck
                too, a room will open up.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            <AnimatePresence initial={false}>
              {rooms.map((room, i) => {
                const color = SUBJECT_COLORS[room.subject] || SUBJECT_COLORS.General;
                return (
                  <motion.div
                    key={room._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="py-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-medium text-sm"
                            style={{ background: color.bg, color: color.text }}
                          >
                            {room.subject[0]}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">
                              {room.topic}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <Badge
                                style={{ background: color.bg, color: color.text }}
                                className="text-[11px] border-0"
                              >
                                {room.subject}
                              </Badge>
                              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Users className="w-3 h-3" />
                                {room.activeMembers.length} active
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleJoin(room._id)}
                          className="bg-[#7F77DD] hover:bg-[#6c63c9] flex-shrink-0"
                        >
                          Join <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}