import React from "react";
import WaitlistModal from "../../components/Admin/WaitlistForm";

export default function WaitlistPage() {
  const [open, setOpen] = React.useState(true);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FAF9F6] dark:bg-[#1A120B] p-6">
      <WaitlistModal isOpen={open} setIsOpen={setOpen} />
    </div>
  );
}
