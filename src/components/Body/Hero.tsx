import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import furnitureImg from "../../../src/assets/brown.jpg";
import WaitlistModal from "../Admin/WaitlistForm";

export default function Hero() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const bronze = "#C1A170";

  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  const steps = [
    {
      number: "01",
      title: "Upload",
      subtitle: "Your Files",
      desc: "Photos, videos, sketches — anything",
    },
    {
      number: "02",
      title: "We Build",
      subtitle: "It",
      desc: "AI precision + master craftsmanship",
    },
    {
      number: "03",
      title: "Delivered",
      subtitle: "Timely",
      desc: "Reliably, across Africa",
    },
  ];

  return (
    <>
      {/* Soft Golden Dust Universe */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(60)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 3 + 0.5,
              height: Math.random() * 3 + 0.5,
              backgroundColor: bronze,
              opacity: isDark ? 0.15 : 0.08,
              boxShadow: isDark
                ? `0 0 ${8 + Math.random() * 12}px ${bronze}`
                : "none",
              top: `${Math.random() * 100}vh`,
              left: `${Math.random() * 100}vw`,
            }}
            animate={{ y: [-100, window.innerHeight + 100] }}
            transition={{
              duration: 30 + Math.random() * 40,
              repeat: Infinity,
              delay: Math.random() * 20,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <section className="relative min-h-screen flex items-center justify-center px-6 py-24">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* LEFT — Text */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="space-y-12"
            >
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 1 }}
                className="text-5xl md:text-6xl lg:text-6xl font-bold leading-tight tracking-tight"
                style={{ color: isDark ? "#ffffff" : "#000000" }}
              >
                Upload your designs.
                <br />
                Our AI interprets them.
                <br />
                <span style={{ color: bronze }}>We build it.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-lg md:text-xl font-light leading-relaxed max-w-xl"
                style={{ color: isDark ? "#e2e2e2" : "#333333" }}
              >
                From a single photo or sketch — our AI extracts every detail.
                Master craftsmen bring it to life with premium materials.
                Delivered with trust and precision.
              </motion.p>

              {/* COMING SOON → Opens Waitlist Modal */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="pt-8"
              >
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsWaitlistOpen(true)} // ← This opens the modal!
                  className="group relative px-12 py-5 rounded-full font-medium text-lg tracking-wider overflow-hidden shadow-2xl cursor-pointer"
                  style={{
                    background: isDark
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(0,0,0,0.05)",
                    border: `1px solid ${
                      isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"
                    }`,
                    backdropFilter: "blur(12px)",
                    color: isDark ? "#ffffff" : "#000000",
                  }}
                >
                  <span className="relative z-10 flex items-center gap-3">
                    <Sparkles className="w-5 h-5" style={{ color: bronze }} />
                    JOIN THE WAITLIST
                  </span>
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-20"
                    style={{
                      background: `radial-gradient(circle at 30% 50%, ${bronze}, transparent)`,
                    }}
                  />
                </motion.button>
              </motion.div>
            </motion.div>

            {/* RIGHT — Image + Floating Cards */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="relative"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative rounded-3xl overflow-hidden shadow-2xl"
                style={{
                  boxShadow: isDark
                    ? "0 20px 60px rgba(0,0,0,0.6)"
                    : "0 20px 60px rgba(0,0,0,0.15)",
                }}
              >
                <img
                  src={furnitureImg}
                  alt="Handcrafted furniture replica"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </motion.div>

              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{
                    delay: 0.9 + i * 0.2,
                    duration: 0.7,
                    ease: "easeOut",
                  }}
                  className="absolute p-6 rounded-3xl backdrop-blur-[120px] border shadow-2xl"
                  style={{
                    background: isDark
                      ? "rgba(255,255,255,0.09)"
                      : "rgba(255,255,255,0.88)",
                    borderColor: isDark
                      ? "rgba(255,255,255,0.18)"
                      : "rgba(0,0,0,0.1)",
                    top: i === 0 ? "8%" : i === 1 ? "38%" : "68%",
                    left: i === 1 ? "50%" : "-8%",
                    transform: i === 1 ? "translateX(-50%)" : "translateX(0)",
                    width: i === 1 ? "320px" : "280px",
                  }}
                  whileHover={{ scale: 1.06 }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className="text-3xl font-bold"
                      style={{ color: bronze }}
                    >
                      {step.number}
                    </span>
                    <div>
                      <p
                        className="text-2xl font-bold"
                        style={{ color: isDark ? "#fff" : "#000" }}
                      >
                        {step.title}
                      </p>
                      <p
                        className="text-lg font-medium opacity-80"
                        style={{ color: bronze }}
                      >
                        {step.subtitle}
                      </p>
                    </div>
                  </div>
                  <p
                    className="text-sm opacity-70 mt-2"
                    style={{ color: isDark ? "#ddd" : "#444" }}
                  >
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
      <WaitlistModal isOpen={isWaitlistOpen} setIsOpen={setIsWaitlistOpen} />
    </>
  );
}
