// src/components/Contact.tsx
import { motion } from "framer-motion";
import { Mail, ArrowRight } from "lucide-react";
import { useState } from "react";
import WaitlistModal from "../Admin/WaitlistForm";

const Contact = () => {
  const bronze = "#C1A170";
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false); // ← Control modal

  return (
    <>
      <section className="py-36 md:py-36" style={{ backgroundColor: bronze }}>
        <div className="container mx-auto px-6 max-w-6xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="space-y-6"
          >
            <h2 className="text-5xl md:text-6xl font-bold leading-tight text-black">
              Reach Out to Us
            </h2>
            <p className="text-xl font-light text-black/80 max-w-3xl mx-auto">
              Whether it’s a discontinued icon, a family heirloom, or something
              you saw once in a magazine — we’re here to bring it back to life.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 1 }}
            className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8"
          >
            <motion.a
              href="mailto:info@clonekraft.com"
              className="text-xl md:text-xl font-medium text-black flex items-center gap-4 hover:underline"
              whileHover={{ scale: 1.05 }}
            >
              <Mail size={32} />
              info@clonekraft.com
            </motion.a>

            {/* "Start Cloning" → Opens the beautiful Waitlist Modal */}
            <motion.button
              onClick={() => setIsWaitlistOpen(true)}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex items-center gap-4 px-8 py-4 bg-black text-white rounded-full text-lg font-medium tracking-wide shadow-2xl transition-all hover:shadow-3xl"
            >
              Start Cloning
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </motion.button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1.2 }}
            className="mt-16 text-black/70 text-base md:text-[12px] font-light"
          >
            We reply within hours — always. || No bots. Just humans who care.
          </motion.p>
        </div>
      </section>

      <WaitlistModal isOpen={isWaitlistOpen} setIsOpen={setIsWaitlistOpen} />
    </>
  );
};

export default Contact;
