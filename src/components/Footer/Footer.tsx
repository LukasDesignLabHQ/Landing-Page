// src/components/Footer.tsx — UPDATED WITH NEW ADDRESS & PHONE
import { motion } from "framer-motion";
import { Sparkles, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const bronze = "#C1A170";

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <footer className="bg-black py-24 md:py-32">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-4 gap-12 text-center md:text-left"
        >
          {/* Brand */}
          <motion.div variants={item}>
            <h3 className="text-2xl md:text-3xl font-bold text-white flex items-center justify-center md:justify-start gap-3 mb-4">
              <Sparkles size={28} style={{ color: bronze }} />
              Clonekraft
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              We don’t make copies.
              <br />
              We bring furniture back to life — one perfect photo at a time.
            </p>
          </motion.div>

          {/* Contact — NOW WITH ADDRESS & PHONE */}
          <motion.div
            variants={item}
            className="flex flex-col items-center md:items-start"
          >
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-4">
              Get in touch
            </p>

            <a
              href="mailto:info@clonekraft.com"
              className="text-white text-base md:text-lg hover:underline flex items-center gap-3 mb-3"
            >
              <Mail size={20} />
              info@clonekraft.com
            </a>

            <a
              href="tel:+2347019758061"
              className="text-white text-base hover:underline flex items-center gap-3 mb-3"
            >
              <Phone size={18} />
              0701 975 8061
            </a>

            <div className="flex items-start gap-3 text-gray-300 text-sm leading-relaxed max-w-xs">
              <MapPin size={18} className="mt-0.5 flex-shrink-0" />
              <p>
                Web No. 9 Inner Northern Road,
                <br />
                Behind Chicken Republic,
                <br />
                Dei-Dei, Abuja, Nigeria
              </p>
            </div>

            <p className="text-gray-500 text-xs mt-6">
              Replies within hours · Always human
            </p>
          </motion.div>

          {/* Social Handles */}
          <motion.div
            variants={item}
            className="flex flex-col items-center md:items-start"
          >
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-3">
              Follow Us
            </p>

            <a
              href="https://instagram.com/Clonekraft"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-sm hover:underline mb-2"
            >
              @Clonekraft (Instagram)
            </a>

            <a
              href="https://www.tiktok.com/@clonkraft"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-sm hover:underline mb-2"
            >
              @clonkraft (TikTok)
            </a>

            <a
              href="https://twitter.com/Clonekraft"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-sm hover:underline mb-2"
            >
              @Clonekraft (X/Twitter)
            </a>

            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-sm hover:underline mb-2"
            >
              Clonekraft (Facebook Page)
            </a>

            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-sm hover:underline"
            >
              Clonekraft (LinkedIn)
            </a>
          </motion.div>

          {/* Closing Line */}
          <motion.div variants={item} className="text-center md:text-right">
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">
              © 2025 Clonekraft
            </p>
            <p className="text-gray-400 text-sm">
              Handcrafted with obsession.
              <br />
              Built to last forever.
            </p>
          </motion.div>
        </motion.div>

        {/* Final micro-line */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-20"
        >
          <p className="text-gray-700 text-xs tracking-widest">
            THE FUTURE OF FURNITURE STARTS WITH ONE PHOTO
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
