import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Hammer,
  X,
  Send,
  Sparkles,
  Clock,
  Package,
  Shield,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { Typewriter } from "react-simple-typewriter";

const predefinedFAQs = [
  { q: "When is Clonekraft launching?", icon: Clock },
  { q: "How does the cloning work?", icon: Hammer },
  { q: "Is my photo safe?", icon: Shield },
  { q: "How long until delivery?", icon: Package },
];

const faqAnswers = {
  "When is Clonekraft launching?":
    "We’re launching in early 2026. First 500 waitlist members get their first piece cloned for free.",
  "How does the cloning work?":
    "Upload one photo → AI analyzes every detail → master carpenters hand-build it in premium hardwood → delivered fully assembled in 14 days.",
  "Is my photo safe?":
    "100%. We never store, share, or train AI on your photos. Deleted 7 days after delivery.",
  "How long until delivery?":
    "14 days from order. White-glove delivery, fully assembled.",
};

interface Message {
  text: string;
  isBot: boolean;
}

export default function AICarpenterChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [requestCount, setRequestCount] = useState(0);
  const [showFAQs, setShowFAQs] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { theme } = useTheme();
  const isDark = theme === "dark";
  const bronze = "#C1A170";

  // AUTO SCROLL
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showFAQs]);

  // OPENING BOT MESSAGE & CLEANUP
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        sendBotReply("Your AI Carpenter is waking up...");
      }, 600);
    }
    if (!isOpen) {
      // Clear state when chat closes
      setMessages([]);
      setRequestCount(0);
      setShowFAQs(false);
    }
  }, [isOpen]);

  // BOT TYPEWRITER HANDLER
  const sendBotReply = (text: string) => {
    setIsTyping(true);

    const shouldShowFAQs = text.includes(
      "I'm still sharpening my tools... Launching soon. In the meantime, feel free to explore the FAQs below!"
    );

    if (shouldShowFAQs) {
      setShowFAQs(true);
    }

    setMessages((prev) => [...prev, { text, isBot: true }]);

    // Adjust timeout to a sensible minimum for smooth flow
    setTimeout(() => setIsTyping(false), Math.max(1200, text.length * 35));
  };

  // USER SENDING MESSAGE
  const handleSend = () => {
    if (!input.trim() || isTyping) return;

    // Hide FAQs on a new user message
    setShowFAQs(false);

    setMessages((prev) => [...prev, { text: input, isBot: false }]);
    setInput("");
    setRequestCount((prev) => prev + 1);

    setTimeout(() => {
      if (requestCount >= 4) {
        sendBotReply(
          "The workshop is buzzing... Your AI Carpenter is coming very soon. Stay tuned — something legendary is being built."
        );
      } else {
        sendBotReply(
          "I'm still sharpening my tools... Launching soon. In the meantime, feel free to explore the FAQs below!"
        );
      }
    }, 400); // Reduced delay for faster interaction
  };

  const handleFAQ = (question: keyof typeof faqAnswers) => {
    if (isTyping) return;
  
    setMessages((prev) => [...prev, { text: question, isBot: false }]);
  
    setTimeout(() => {
      // The error is fixed here because 'question' is now guaranteed to be a valid key
      sendBotReply(
        faqAnswers[question] ||
          "We're still carving that answer. Launching soon — stay tuned."
      );
    }, 200);
  };

  return (
    <>
      {/* DARK OVERLAY (Maintained) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* FLOATING BUTTON (Position adjusted for better mobile fit) */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        // R: changed right-4 to right-2 for mobile, and p-5 to p-4 for smaller button
        className="fixed bottom-4 right-2 sm:bottom-8 sm:right-4 z-50 p-4 sm:p-5 rounded-full shadow-2xl border"
        style={{
          background: `linear-gradient(135deg, ${bronze}, #d4ad7b)`,
          borderColor: bronze + "40",
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? (
          <X size={24} className="text-black" />
        ) : (
          <Hammer size={24} className="text-black" />
        )}
      </motion.button>

      {/* CHAT WINDOW (Key Responsive Changes Applied) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed z-50 rounded-3xl shadow-3xl overflow-hidden border flex flex-col transition-all ease-in-out duration-300
                       bottom-20 left-2 right-2 w-[95vw] h-[80vh] min-h-[400px] max-h-[700px]
                       sm:bottom-28 sm:right-4 sm:left-auto sm:w-96 sm:h-[600px] sm:max-w-md"
            style={{
              background: isDark ? "rgba(0,0,0,0.9)" : "rgba(255,255,255,0.95)",
              backdropFilter: "blur(20px)",
              borderColor: bronze + "40",
            }}
          >
            {/* HEADER (Maintained) */}
            <div
              className="p-6 border-b flex-shrink-0"
              style={{ borderColor: bronze + "30", background: bronze + "15" }}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-black/20">
                  <Hammer size={28} style={{ color: bronze }} />
                </div>
                <div>
                  <h3
                    className="font-bold text-lg"
                    style={{ color: isDark ? "#fff" : "#000" }}
                  >
                    AI Carpenter
                  </h3>
                  <p className="text-sm" style={{ color: bronze }}>
                    Coming soon...
                  </p>
                </div>
              </div>
            </div>

            {/* MESSAGES (Scrollable Area) - Reduced padding for more space */}
            <div className="flex-1 pt-4 px-4 overflow-y-auto">
              {messages.length === 0 && (
                <div className="text-center mt-20">
                  <Sparkles
                    size={40} // R: Slightly smaller icon for mobile
                    style={{ color: bronze }}
                    className="mx-auto mb-3 opacity-50"
                  />
                  <p
                    className="text-base" // R: Slightly smaller text for mobile
                    style={{ color: isDark ? "#ccc" : "#444" }}
                  >
                    Ask me anything about Clonekraft...
                  </p>
                </div>
              )}

              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-3 ${msg.isBot ? "text-left" : "text-right"}`} // R: Reduced margin-bottom
                >
                  <div
                    className={`inline-block max-w-[80%] px-4 py-2 rounded-xl ${
                      // R: Increased max-w and reduced padding/border-radius
                      msg.isBot
                        ? isDark
                          ? "bg-white/10"
                          : "bg-black/5"
                        : "text-black"
                    }`}
                    style={
                      !msg.isBot
                        ? {
                            background: `linear-gradient(135deg, ${bronze}, #d4ad7b)`,
                          }
                        : {}
                    }
                  >
                    {msg.isBot ? (
                      <Typewriter
                        words={[msg.text]}
                        loop={1}
                        typeSpeed={35}
                        deleteSpeed={0}
                        delaySpeed={300}
                        cursor={false}
                      />
                    ) : (
                      msg.text
                    )}
                  </div>
                </motion.div>
              ))}

              {/* BOT IS TYPING (Maintained) */}
              {isTyping && (
                <div className="flex gap-2 mb-3">
                  <div
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{ backgroundColor: bronze }}
                  />
                  <div
                    className="w-2 h-2 rounded-full animate-bounce delay-150"
                    style={{ backgroundColor: bronze }}
                  />
                  <div
                    className="w-2 h-2 rounded-full animate-bounce delay-300"
                    style={{ backgroundColor: bronze }}
                  />
                </div>
              )}

              {/* FAQ SECTION (Maintained, adjusted padding) */}
              {showFAQs && (
                <div className="mt-3 mb-3">
                  <p
                    className="text-xs mb-2 opacity-70" // R: Smaller text for hint
                    style={{ color: isDark ? "#ddd" : "#333" }}
                  >
                    Quick questions:
                  </p>

                  <div className="space-y-2">
                    {predefinedFAQs.map((faq, i) => (
                      <button
                        key={i}
                        onClick={() => handleFAQ(faq.q as any)}
                        disabled={isTyping}
                        className="w-full text-left p-3 rounded-xl border backdrop-blur-xl transition-all hover:scale-[1.01] flex items-center justify-between" // R: Smaller padding and border-radius
                        style={{
                          background: isDark
                            ? "rgba(255,255,255,0.05)"
                            : "rgba(0,0,0,0.03)",
                          borderColor: bronze + "30",
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <faq.icon size={16} style={{ color: bronze }} />{" "}
                          {/* R: Smaller icon */}
                          <span
                            className="text-sm"
                            style={{ color: isDark ? "#ddd" : "#333" }}
                          >
                            {" "}
                            {/* R: Smaller text */}
                            {faq.q}
                          </span>
                        </div>
                        <ChevronRight
                          size={16} // R: Smaller icon
                          className="transition-transform"
                          style={{ color: bronze }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="pb-2" ref={messagesEndRef} />
            </div>

            {/* INPUT BOX (Reduced padding) */}
            <div
              className="p-4 border-t flex-shrink-0" // R: Reduced padding
              style={{ borderColor: bronze + "30" }}
            >
              <div className="flex gap-2">
                {" "}
                {/* R: Reduced gap */}
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask the carpenter..."
                  className="flex-1 px-4 py-3 rounded-xl border outline-none text-sm" // R: Reduced padding/size/text
                  disabled={isTyping}
                  style={{
                    background: isDark
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.03)",
                    borderColor: bronze + "40",
                    color: isDark ? "#fff" : "#000",
                  }}
                />
                <button
                  onClick={handleSend}
                  className="p-3 rounded-xl" // R: Reduced padding/size
                  style={{ background: bronze }}
                  disabled={isTyping || !input.trim()}
                >
                  <Send size={18} className="text-black" />{" "}
                  {/* R: Smaller icon */}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
