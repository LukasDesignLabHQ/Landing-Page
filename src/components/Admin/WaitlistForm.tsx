import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CheckCircle,
  Sparkles,
  AlertCircle,
  Rocket,
  PartyPopper,
  MailCheck,
  Crown,
} from "lucide-react";
import { supabase } from "../../supabase/supabaseClient";
import { useTheme } from "../../contexts/ThemeContext";

type ModalState = "form" | "success" | "already-joined" | "error";

// Bronze & Craft Palette
const bronze = "#C1A170";
const bronzeLight = "#D4C19E";
const bronzeDark = "#A67C52";
const deepBrown = "#2D1B0F";
const warmCream = "#FAF9F6";

const darkCard = "#1A120B";

export default function WaitlistModal({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [modalState, setModalState] = useState<ModalState>("form");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    interests: { earlyAccess: true, exclusivePerks: true, updates: true },
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("waitlist").insert([
      {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        interests: formData.interests,
      },
    ]);

    setLoading(false);

    if (error) {
      if (error.code === "23505") setModalState("already-joined");
      else setModalState("error");
    } else {
      setModalState("success");
      setFormData({ name: "", email: "", interests: formData.interests });
    }
  };

  const toggleInterest = (key: keyof typeof formData.interests) => {
    setFormData((prev) => ({
      ...prev,
      interests: { ...prev.interests, [key]: !prev.interests[key] },
    }));
  };

  // Reset to form when reopened
  useEffect(() => {
    if (isOpen) setModalState("form");
  }, [isOpen]);

  // Auto-close feedback screens
  useEffect(() => {
    if (modalState !== "form") {
      const timer = setTimeout(() => setIsOpen(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [modalState, setIsOpen]);

  // ESC to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) =>
      e.key === "Escape" && setIsOpen(false);
    if (isOpen) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, setIsOpen]);

  if (!isOpen) return null;

  // Dynamic theme colors
  // const bg = isDark ? darkBg : warmCream;
  const cardBg = isDark ? darkCard : warmCream;
  const text = isDark ? "#FAF9F6" : deepBrown;
  const textMuted = isDark ? bronzeLight : "#8B6F47";
  const inputBg = isDark ? "#1A120B" : "#FFFFFF";
  const border = isDark ? "border-amber-800" : "border-amber-200";
  const focus = "focus:border-bronze focus:ring-2 focus:ring-bronze/30";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-xl z-200 flex items-center justify-center p-4"
        onClick={() => setIsOpen(false)}
      >
        {/* FORM */}
        {modalState === "form" && (
          <motion.div
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            style={{ backgroundColor: cardBg }}
            className="relative rounded-3xl shadow-2xl max-w-md w-full p-10 overflow-hidden"
          >
            {/* Glow orbs */}
            <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full blur-3xl opacity-30 bg-amber-600" />
            <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full blur-3xl opacity-30 bg-amber-700" />

            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-amber-500 hover:text-amber-400 transition"
            >
              <X size={28} />
            </button>

            <div className="relative z-10">
              <h3 className="text-4xl font-bold mb-3" style={{ color: text }}>
                Join the Waitlist
              </h3>
              <p
                className="text-lg mb-10 leading-relaxed"
                style={{ color: textMuted }}
              >
                Be the first to craft the future. Early access, exclusive
                offers, and timeless design.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <input
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, name: e.target.value }))
                  }
                  required
                  disabled={loading}
                  className={`w-full px-6 py-4 rounded-2xl border ${border} ${focus} outline-none transition font-medium placeholder-amber-500`}
                  style={{ backgroundColor: inputBg, color: text }}
                />

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, email: e.target.value }))
                  }
                  required
                  disabled={loading}
                  className={`w-full px-6 py-4 rounded-2xl border ${border} ${focus} outline-none transition font-medium placeholder-amber-500`}
                  style={{ backgroundColor: inputBg, color: text }}
                />

                <div className="space-y-5">
                  {[
                    {
                      key: "earlyAccess",
                      label: "Early access & private beta",
                      icon: Rocket,
                    },
                    {
                      key: "exclusivePerks",
                      label: "Exclusive perks & founder pricing",
                      icon: Crown,
                    },
                    {
                      key: "updates",
                      label: "Product updates & craft insights",
                      icon: Sparkles,
                    },
                  ].map(({ key, label, icon: Icon }) => (
                    <label
                      key={key}
                      className="flex items-center gap-4 cursor-pointer group"
                    >
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={
                            formData.interests[
                              key as keyof typeof formData.interests
                            ]
                          }
                          onChange={() =>
                            toggleInterest(
                              key as keyof typeof formData.interests
                            )
                          }
                          className="sr-only"
                        />
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all ${
                            formData.interests[
                              key as keyof typeof formData.interests
                            ]
                              ? "border-transparent"
                              : "border-amber-600/50 group-hover:border-bronze"
                          }`}
                          style={{
                            backgroundColor: formData.interests[
                              key as keyof typeof formData.interests
                            ]
                              ? bronze
                              : "transparent",
                          }}
                        >
                          {formData.interests[
                            key as keyof typeof formData.interests
                          ] && <CheckCircle size={16} className="text-white" />}
                        </motion.div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Icon size={20} className="text-bronze" />
                        <span className="font-medium" style={{ color: text }}>
                          {label}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 rounded-2xl font-bold text-lg text-black shadow-2xl"
                  style={{
                    background: isDark
                      ? `linear-gradient(135deg, ${bronzeDark} 0%, ${bronze} 100%)`
                      : `linear-gradient(135deg, ${bronze} 0%, ${bronzeLight} 100%)`,
                  }}
                >
                  {loading ? "Adding you..." : "Join the Waitlist"}
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}

        {/* SUCCESS */}
        {modalState === "success" && (
          <FeedbackCard onClick={(e) => e.stopPropagation()} bg={cardBg}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <PartyPopper size={88} className="mx-auto mb-6 text-bronze" />
            </motion.div>
            <h3 className="text-4xl font-bold mb-4" style={{ color: text }}>
              Welcome Aboard
            </h3>
            <p
              className="text-[16px] leading-relaxed"
              style={{ color: bronzeLight }}
            >
              You're officially on the waitlist.
              <br />
              Get ready for something legendary.
            </p>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="mt-6"
            >
              <Sparkles size={40} className="mx-auto text-bronze" />
            </motion.div>
          </FeedbackCard>
        )}

        {/* ALREADY JOINED */}
        {modalState === "already-joined" && (
          <FeedbackCard onClick={(e) => e.stopPropagation()} bg={cardBg}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <MailCheck size={80} className="mx-auto mb-6 text-bronze" />
            </motion.div>
            <h3
              className="text-4xl font-extrabold mb-4"
              style={{ color: text }}
            >
              You're Already In
            </h3>
            <p
              className="text-[16px] leading-relaxed"
              style={{ color: textMuted }}
            >
              Great minds think alike — you've already secured your spot.
              <br />
              See you on the inside.
            </p>
            <Crown size={48} className="mx-auto mt-6 text-bronze" />
          </FeedbackCard>
        )}

        {/* ERROR */}
        {modalState === "error" && (
          <FeedbackCard onClick={(e) => e.stopPropagation()} bg={cardBg}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <AlertCircle size={80} className="mx-auto mb-6 text-red-500" />
            </motion.div>
            <h3 className="text-4xl font-bold mb-4" style={{ color: text }}>
              Oops, Something Went Wrong
            </h3>
            <p className="text-lg leading-relaxed" style={{ color: textMuted }}>
              We couldn't add you right now.
              <br />
              Please try again later.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setModalState("form")}
              className="mt-8 px-8 py-4 rounded-2xl font-bold text-black"
              style={{
                background: `linear-gradient(135deg, ${bronze} 0%, ${bronzeLight} 100%)`,
              }}
            >
              Try Again
            </motion.button>
          </FeedbackCard>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

// Reusable feedback card for success/already/error states
function FeedbackCard({
  children,
  onClick,
  bg,
}: {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  bg: string;
}) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      onClick={onClick}
      style={{ backgroundColor: bg }}
      className="relative rounded-3xl shadow-2xl max-w-md w-full p-12 text-center overflow-hidden"
    >
      <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full blur-3xl opacity-20 bg-amber-600" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full blur-3xl opacity-20 bg-amber-700" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
