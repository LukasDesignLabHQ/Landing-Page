import React, { useEffect } from "react";
import WaitlistModal from "../../components/Admin/WaitlistForm";

export default function WaitlistPage() {
  const [open, setOpen] = React.useState(true);

  // Optional: Force dark/light mode based on system preference on mount
  // (Only if you haven't set it globally in your app already)
  useEffect(() => {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-warmCream dark:bg-darkCard transition-colors duration-500 p-6">
      {/* Optional: Subtle gradient background for extra polish */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/20 via-transparent to-amber-100/10 dark:from-amber-900/20 dark:to-amber-950/10" />
      </div>

      <WaitlistModal isOpen={open} setIsOpen={setOpen} />
    </div>
  );
}