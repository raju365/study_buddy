import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { GraduationCap, MessageCircle, Users, LayoutGrid, LogOut, Moon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const links = [
  { to: "/", label: "Doubt Solver", icon: MessageCircle },
  { to: "/rooms", label: "Rooms", icon: Users },
  { to: "/dashboard", label: "Dashboard", icon: LayoutGrid },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="bg-white border-b border-[#EEECFB]">
      <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#6D5FE0] flex items-center justify-center">
            <GraduationCap className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-lg font-bold text-[#1B1834]">
            Study <span className="text-[#6D5FE0]">Buddy</span>
          </span>
        </div>

        <div className="flex items-center gap-1 bg-[#F6F5FE] rounded-full p-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `relative flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive ? "text-[#6D5FE0]" : "text-[#6B6483] hover:text-[#1B1834]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-white rounded-full shadow-sm"
                      transition={{ type: "spring", duration: 0.4 }}
                    />
                  )}
                  <Icon className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-[#1B1834] font-medium">{user?.fullName?.firstName}</span>
          <button className="w-9 h-9 rounded-full bg-[#F6F5FE] flex items-center justify-center text-[#6B6483]">
            <Moon className="w-4 h-4" />
          </button>
          <button
            onClick={handleLogout}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#6B6483] hover:bg-[#FDEEF0] hover:text-[#E8637A] transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}