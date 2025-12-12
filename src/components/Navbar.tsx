import { useState } from "react";
import { Menu, X, Sparkles, Sun, Moon } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import yare from "../../src/assets/vite.png";
import WaitlistModal from "./Admin/WaitlistForm";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [comingSoon, setComingSoon] = useState(false);

  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();

  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 200], [0.55, 0.98]);
  const glow = useTransform(scrollY, [0, 300], [0.3, 0.9]);

  const bronze = "#C1A170";
  const bronzeGlow = "#d4ad7b";

  const smoothScroll = (id: string) => {
    setIsOpen(false);

    if (window.location.pathname !== "/") {
      navigate("/", { replace: false });

      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 350);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const goToPolicy = () => {
    setIsOpen(false);
    navigate("/policy");
  };

  const openComingSoonModal = () => {
    setIsOpen(false);
    setComingSoon(true);
    navigate('/waitlist')
  };

  return (
    <>
      {comingSoon && (
        <WaitlistModal isOpen={comingSoon} setIsOpen={setComingSoon} />
      )}

      <div className="fixed inset-0 overflow-hidden pointer-events-none z-10">
        {[...Array(45)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              backgroundColor: isDark ? bronzeGlow : bronze,
              boxShadow: isDark ? `0 0 12px ${bronzeGlow}` : "0 0 8px #C1A170",
            }}
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 50,
            }}
            animate={{ y: -150 }}
            transition={{
              duration: 20 + Math.random() * 25,
              repeat: Infinity,
              delay: Math.random() * 15,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 border-b"
        style={{
          backdropFilter: "blur(64px)",
          background: isDark
            ? "rgba(0,0,0,0.7)"
            : `rgba(250,247,242,${bgOpacity})`,
          borderColor: `${bronze}${(glow.get() * 255)
            .toFixed(0)
            .padStart(2, "0")}`,
          boxShadow: isDark
            ? `0 10px 40px rgba(193,161,112,${glow.get() * 0.4})`
            : "0 8px 32px rgba(193,161,112,0.18)",
        }}
      >
        <div className="max-w-7xl mx-auto px-5 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="/" className="flex items-center gap-3">
              <img src={yare} className="w-14 h-9 object-contain" alt="Logo" />
            </a>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-10">
              {[
                { name: "Product Overview", id: "product" },
                { name: "Our Policy", action: goToPolicy },
                { name: "FAQ", id: "faq" },
                { name: "Contact", id: "contact" },
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={
                    item.action ? item.action : () => smoothScroll(item.id!)
                  }
                  className="relative text-sm font-medium tracking-wider text-white/90 hover:text-white transition-all duration-300 hover:-translate-y-0.5"
                >
                  {item.name}
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-[#C1A170]"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.4 }}
                  />
                </button>
              ))}

              <div className="flex items-center gap-5 ml-8">
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-3 rounded-2xl border backdrop-blur-2xl transition-all hover:scale-110 active:scale-95"
                  style={{
                    background: isDark
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(193,161,112,0.12)",
                    borderColor: bronze + "50",
                  }}
                >
                  {isDark ? (
                    <Sun className="w-5 h-5" style={{ color: bronzeGlow }} />
                  ) : (
                    <Moon className="w-5 h-5" style={{ color: bronze }} />
                  )}
                </button>

                {/* CTA — COMING SOON */}
                <button
                  onClick={openComingSoonModal}
                  className="px-8 py-3.5 rounded-full font-bold text-black flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${bronze}, ${bronzeGlow})`,
                  }}
                >
                  <Sparkles className="w-4 h-4" />
                  Join Waitlist
                </button>
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-3 rounded-xl backdrop-blur-xl border"
              style={{
                background: isDark
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(193,161,112,0.1)",
                borderColor: bronze + "30",
              }}
            >
              {isOpen ? (
                <X size={28} style={{ color: bronzeGlow }} />
              ) : (
                <Menu size={28} style={{ color: bronzeGlow }} />
              )}
            </button>
          </div>

          {/* Mobile Dropdown */}
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-6 pb-10 border-t pt-8"
              style={{ borderColor: bronze + "40" }}
            >
              <div className="flex flex-col gap-7">
                {[
                  { name: "Product Overview", id: "product" },
                  { name: "Our Policy", action: goToPolicy },
                  { name: "FAQ", id: "faq" },
                  { name: "Contact", id: "contact" },
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={
                      item.action ? item.action : () => smoothScroll(item.id!)
                    }
                    className="text-left text-xl font-medium text-white/90 hover:text-white transition-all hover:pl-3"
                  >
                    {item.name}
                  </button>
                ))}

                <div className="flex justify-between items-center pt-6">
                  <button
                    onClick={toggleTheme}
                    className="p-5 rounded-2xl"
                    style={{ background: bronze + "30" }}
                  >
                    {isDark ? (
                      <Sun className="w-8 h-8" style={{ color: bronzeGlow }} />
                    ) : (
                      <Moon className="w-8 h-8" style={{ color: bronze }} />
                    )}
                  </button>

                  <button
                    onClick={openComingSoonModal}
                    className="px-12 py-5 rounded-full font-bold text-black"
                    style={{
                      background: `linear-gradient(135deg, ${bronze}, ${bronzeGlow})`,
                    }}
                  >
                    Join Waitlist
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.nav>
    </>
  );
}
