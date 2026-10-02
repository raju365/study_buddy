import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  GraduationCap,
  MessageCircle,
  Users,
  LayoutGrid,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const links = [
  { to: "/", label: "Doubt Solver", icon: MessageCircle },
  { to: "/rooms", label: "Rooms", icon: Users },
  { to: "/dashboard", label: "Dashboard", icon: LayoutGrid },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="sticky top-0 z-30 px-3 sm:px-5 pt-3">
      <motion.div
        animate={{
          boxShadow: scrolled
            ? "0 8px 24px rgba(109,95,224,0.14)"
            : "0 2px 8px rgba(109,95,224,0.06)",
        }}
        className="max-w-6xl mx-auto bg-white/90 dark:bg-[#1E1B2E]/90 backdrop-blur-md rounded-2xl border border-[#EEECFB] dark:border-[#2E2A42]"
      >
        <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#6D5FE0] flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-lg font-bold text-[#1B1834] dark:text-white whitespace-nowrap">
              Study <span className="text-[#6D5FE0]">Buddy</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1 bg-[#F6F5FE] dark:bg-[#2A2640] rounded-full p-1">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `relative flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    isActive
                      ? "text-[#6D5FE0]"
                      : "text-[#6B6483] dark:text-[#A39DC4] hover:text-[#1B1834] dark:hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-white dark:bg-[#15131F] rounded-full shadow-sm"
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

          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => navigate("/profile")}
              className="text-sm text-[#1B1834] dark:text-white font-medium hover:text-[#6D5FE0]"
            >
              {user?.fullName?.firstName}
            </button>
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full bg-[#F6F5FE] dark:bg-[#2A2640] flex items-center justify-center text-[#6B6483] dark:text-[#A39DC4]"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={handleLogout}
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#6B6483] dark:text-[#A39DC4] hover:bg-[#FDEEF0] dark:hover:bg-[#3A2230] hover:text-[#E8637A] transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setOpen((o) => !o)}
            className="md:hidden w-9 h-9 rounded-full bg-[#F6F5FE] dark:bg-[#2A2640] flex items-center justify-center text-[#1B1834] dark:text-white"
          >
            {open ? (
              <X className="w-4.5 h-4.5" />
            ) : (
              <Menu className="w-4.5 h-4.5" />
            )}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="md:hidden overflow-hidden border-t border-[#EEECFB] dark:border-[#2E2A42]"
            >
              <div className="px-4 py-3 flex flex-col gap-1">
                {links.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === "/"}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                        isActive
                          ? "bg-[#EFEDFE] dark:bg-[#2A2640] text-[#6D5FE0]"
                          : "text-[#6B6483] dark:text-[#A39DC4]"
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </NavLink>
                ))}

                <div className="flex items-center justify-between px-3.5 py-3 mt-1 border-t border-[#EEECFB] dark:border-[#2E2A42]">
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setOpen(false);
                    }}
                    className="text-sm text-[#1B1834] dark:text-white font-medium hover:text-[#6D5FE0]"
                  >
                    {user?.fullName?.firstName}
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleTheme}
                      className="w-8 h-8 rounded-full bg-[#F6F5FE] dark:bg-[#2A2640] flex items-center justify-center text-[#6B6483] dark:text-[#A39DC4]"
                    >
                      {theme === "dark" ? (
                        <Sun className="w-4 h-4" />
                      ) : (
                        <Moon className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[#6B6483] dark:text-[#A39DC4] hover:bg-[#FDEEF0] dark:hover:bg-[#3A2230] hover:text-[#E8637A]"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
