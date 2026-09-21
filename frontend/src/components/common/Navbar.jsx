/*
 * -------------------------------------------------------
 * File : Navbar.jsx
 * Description : Top navigation bar — links between
 *               Doubt Solver, Rooms, Dashboard + logout
 * Author : Raju Barman
 * -------------------------------------------------------
 */

import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Lightbulb, MessageCircle, Users, LayoutDashboard, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const links = [
  { to: "/", label: "Doubt Solver", icon: MessageCircle },
  { to: "/rooms", label: "Rooms", icon: Users },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-[#ECEAFB]">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#7F77DD] flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-medium">Study Buddy</span>
        </div>

        <div className="flex items-center gap-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  isActive
                    ? "text-[#3C3489]"
                    : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-[#EEEDFE] rounded-full"
                      transition={{ type: "spring", duration: 0.4 }}
                    />
                  )}
                  <Icon className="w-3.5 h-3.5 relative z-10" />
                  <span className="relative z-10 hidden sm:inline">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground hidden sm:inline">
            {user?.fullName?.firstName}
          </span>
          <button
            onClick={handleLogout}
            className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:bg-[#FAECE7] hover:text-[#D85A30] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}