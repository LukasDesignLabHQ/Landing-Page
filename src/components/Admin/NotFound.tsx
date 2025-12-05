// src/pages/NotFound.tsx
import { useTheme } from "../../contexts/ThemeContext";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const bg = isDark ? "#000000" : "#FFFFFF";
  const text = isDark ? "#FFFFFF" : "#000000";
  const textMuted = isDark ? "#AAAAAA" : "#666666";
  const border = isDark ? "#222222" : "#E6E6E6";

  return (
    <div
      style={{ backgroundColor: bg, color: text, minHeight: "100vh" }}
      className="flex items-center justify-center p-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl"
      >
        <h1 className="text-9xl font-black mb-6 tracking-tighter">404</h1>
        <p className="text-3xl sm:text-5xl font-bold mb-4">Page Not Found</p>
        <p
          style={{ color: textMuted }}
          className="text-lg mb-10 max-w-md mx-auto"
        >
          Looks like this page went on a coffee break and never came back.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition hover:scale-105"
            style={{ backgroundColor: "#000000", color: "#FFFFFF" }}
          >
            <Home size={20} />
            Back to Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-3 border transition hover:scale-105"
            style={{ borderColor: border, color: text }}
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>

        <p className="mt-16 text-sm" style={{ color: textMuted }}>
          © {new Date().getFullYear()} • Lost in the void
        </p>
      </motion.div>
    </div>
  );
}
