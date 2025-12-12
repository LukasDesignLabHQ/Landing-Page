import  { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight } from "lucide-react";
import WaitlistModal from "../../components/Admin/WaitlistForm";

// Your brand colors (light mode only)
const bronze = "#C1A170";
const deepBrown = "#2D1B0F";
const warmCream = "#FAF9F6";

export default function WaitlistPage() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(true);

  return (
    <>
      {/* Full light-mode background */}
      <div
        className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden"
        style={{ backgroundColor: warmCream }}
      >
        {/* Subtle warm gradient overlay */}
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50/40 via-transparent to-amber-100/20" />
        </div>

        {/* Hero Section */}
        <section className="py-24 md:py-36 px-6 text-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="space-y-8"
          >
            <h2
              className="text-5xl md:text-7xl font-bold leading-tight"
              style={{ color: deepBrown }}
            >
              Join the Waitlist
            </h2>
            <p
              className="text-xl md:text-xl font-light max-w-4xl mx-auto leading-relaxed"
              style={{ color: "#4A3728" }} // soft brown
            >
              Be the first to craft the future. Early access, exclusive offers,
              and timeless design.
              <span className="font-semibold pl-2" style={{ color: bronze }}>
                Join the Waitlist
              </span>
              .
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 1 }}
            className="mt-20 flex flex-col sm:flex-row items-center justify-center gap-10"
          >
            {/* Email */}
            <motion.a
              href="mailto:info@clonekraft.com"
              className="text-xl md:text-xl font-medium flex items-center gap-4 hover:gap-6 transition-all"
              style={{ color: deepBrown }}
              whileHover={{ scale: 1.05 }}
            >
              <Mail size={36} style={{ color: bronze }} />
              info@clonekraft.com
            </motion.a>

            {/* Start Cloning Button */}
            <motion.button
              onClick={() => setIsWaitlistOpen(true)}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex items-center gap-4 px-10 py-5 rounded-full text-xl font-semibold tracking-wide text-white shadow-2xl hover:shadow-3xl transition-all"
              style={{ backgroundColor: bronze }}
            >
              Join the Waitlist
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </motion.button>
          </motion.div>
        </section>

        {/* Waitlist Modal */}
        <WaitlistModal isOpen={isWaitlistOpen} setIsOpen={setIsWaitlistOpen} />
      </div>
    </>
  );
}
