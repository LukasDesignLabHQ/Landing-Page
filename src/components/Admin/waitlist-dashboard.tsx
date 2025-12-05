import { useState, useEffect } from "react";
import { supabase } from "../../supabase/supabaseClient";
import { useTheme } from "../../contexts/ThemeContext";
import {
  Download,
  Copy,
  Mail,
  Search,
  Users,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { motion } from "framer-motion";
import bcrypt from "bcryptjs";
import { Helmet } from "react-helmet-async";

interface Subscriber {
  id: string;
  name: string | null;
  email: string;
  created_at: string;
}

export default function WaitlistDashboard() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  // NEW STATE: Controls whether individual user checkboxes are visible
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(true);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);

  const pageSize = 20;

  const bg = isDark ? "#000000" : "#FFFFFF";
  const cardBg = isDark ? "#0a0a0a" : "#FFFFFF";
  const text = isDark ? "#FFFFFF" : "#000000";
  const textMuted = isDark ? "#AAAAAA" : "#666666";
  const border = isDark ? "#222222" : "#E6E6E6";

  useEffect(() => {
    if (adminAuthenticated) fetchEverything();
  }, [adminAuthenticated]);

  // EFFECT to update showCheckboxes state
  useEffect(() => {
    // If any user is selected, or if the "Send Mail" button is showing (meaning selections exist)
    // we should show the checkboxes. Otherwise, hide them.
    setShowCheckboxes(selectedUsers.size > 0);
  }, [selectedUsers]);

  async function fetchEverything() {
    setLoading(true);
    const { data, error } = await supabase
      .from("waitlist")
      .select("id, name, email, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setSubscribers([]);
    } else {
      setSubscribers(data || []);
    }
    setLoading(false);
  }

  const filtered = subscribers.filter(
    (s) =>
      (s.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const copyEmails = () => {
    const emails = filtered.map((s) => s.email).join(", ");
    navigator.clipboard.writeText(emails);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportCSV = () => {
    const csv = filtered
      .map(
        (s) =>
          `"${s.name || ""}","${s.email}",${new Date(
            s.created_at
          ).toLocaleDateString()}`
      )
      .join("\n");
    const header = "Name,Email,Joined\n";
    const blob = new Blob([header + csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `waitlist-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const toggleSelectAll = () => {
    if (selectedUsers.size === paginated.length && paginated.length > 0) {
      // Deselect all
      setSelectedUsers(new Set());
      // Optional: hide checkboxes if nothing is selected
      setShowCheckboxes(false);
    } else {
      // Select all
      setSelectedUsers(new Set(paginated.map((s) => s.id)));
      // Show checkboxes
      setShowCheckboxes(true);
    }
  };

  const toggleUser = (id: string) => {
    const newSet = new Set(selectedUsers);
    newSet.has(id) ? newSet.delete(id) : newSet.add(id);
    setSelectedUsers(newSet);

    // Automatically show checkboxes when a user is selected
    if (newSet.size > 0) {
      setShowCheckboxes(true);
    } else {
      setShowCheckboxes(false);
    }
  };

  const sendMailToSelected = () => {
    const mails = paginated
      .filter((s) => selectedUsers.has(s.id))
      .map((s) => s.email);
    if (mails.length === 0) return;
    window.location.href = `mailto:?bcc=${mails.join(",")}`;
  };

  const handleAdminSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!adminEmail || !adminPassword) return;
    setAuthenticating(true);

    try {
      const { data: adminRow } = await supabase
        .from("admins")
        .select("id, email, password")
        .eq("email", adminEmail)
        .limit(1)
        .single();

      if (!adminRow) {
        alert("Admin email not found");
        return;
      }

      const valid = (adminRow as any).password.startsWith("$2")
        ? bcrypt.compareSync(adminPassword, (adminRow as any).password)
        : (adminRow as any).password === adminPassword;

      if (!valid) {
        alert("Incorrect password");
        return;
      }

      setAdminAuthenticated(true);
      setAdminModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Error authenticating admin");
    } finally {
      setAuthenticating(false);
    }
  };

  return (
    <div
      style={{ backgroundColor: bg, color: text, minHeight: "100vh" }}
      className="p-4 sm:p-6"
    >
      <Helmet>
        <title>Admin Dashboard | Zaeda Oracle</title>
        <meta
          name="description"
          content="Manage the waitlist and admin settings securely on Zaeda Oracle."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      {/* Admin Modal - unchanged */}
      {adminModalOpen && !adminAuthenticated && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => {}}
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-md rounded-2xl overflow-hidden"
            style={{ backgroundColor: cardBg, border: `1px solid ${border}` }}
          >
            <form
              onSubmit={handleAdminSubmit}
              className="p-6 sm:p-8 flex flex-col gap-5"
            >
              <h2 className="text-2xl font-bold">Admin Login</h2>
              <p style={{ color: textMuted }} className="text-sm">
                Enter credentials to access the waitlist
              </p>

              <label className="flex flex-col gap-2 text-sm">
                <span style={{ color: textMuted }}>Email</span>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  required
                  className="px-4 py-3 rounded-lg border"
                  style={{
                    backgroundColor: isDark ? "#111" : "#fff",
                    color: text,
                    borderColor: border,
                    fontSize: "16px",
                  }}
                />
              </label>

              <label className="relative flex flex-col gap-2 text-sm">
                <span style={{ color: textMuted }}>Password</span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  required
                  className="px-4 py-3 pr-12 rounded-lg border"
                  style={{
                    backgroundColor: isDark ? "#111" : "#fff",
                    color: text,
                    borderColor: border,
                    fontSize: "16px",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-10 text-gray-500"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </label>

              <button
                type="submit"
                disabled={authenticating}
                className="mt-4 py-3 rounded-lg font-bold bg-black text-white disabled:opacity-70"
              >
                {authenticating ? "Checking..." : "Enter"}
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Dashboard */}
      {adminAuthenticated && (
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="pt-8 pb-10"
          >
            <h1 className="text-4xl sm:text-6xl font-black">The Waitlist</h1>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "baseline",
                gap: 12,
              }}
            >
              <p className="text-[120px] mt-12 font-bold">
                <strong>{total.toLocaleString()}</strong>
              </p>
              <p>Users</p>
            </div>
          </motion.div>

          {/* Search & Actions */}
          <div className="flex flex-col gap-4 mb-8">
            <div className="relative">
              <Search
                size={20}
                className="absolute left-4 top-4"
                style={{ color: textMuted }}
              />
              <input
                type="text"
                placeholder="Search name or email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-12 pr-6 py-4 rounded-xl border text-base sm:text-lg"
                style={{
                  backgroundColor: cardBg,
                  color: text,
                  borderColor: border,
                }}
              />
            </div>

            {total > 0 && (
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={copyEmails}
                  className="px-5 py-3 rounded-lg font-bold flex items-center gap-2 transition hover:scale-105"
                  style={{
                    background: copied ? "#10b981" : "#000",
                    color: "#fff",
                  }}
                >
                  <Copy size={18} /> {copied ? "Copied!" : "Copy Emails"}
                </button>
                <button
                  onClick={exportCSV}
                  className="px-5 py-3 rounded-lg font-bold flex items-center gap-2 transition hover:scale-105 bg-black text-white"
                >
                  <Download size={18} /> Export CSV
                </button>
              </div>
            )}
          </div>

          {/* Responsive List Container (Replaces Table) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl overflow-hidden border"
            style={{ backgroundColor: cardBg, borderColor: border }}
          >
            {loading ? (
              <div className="p-12 text-center" style={{ color: textMuted }}>
                Loading...
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center">
                <Users
                  size={64}
                  style={{ color: textMuted }}
                  className="mx-auto mb-4"
                />
                <p className="text-2xl" style={{ color: textMuted }}>
                  {search ? "No results found" : "Waitlist is empty"}
                </p>
              </div>
            ) : (
              // --- START: MOBILE LIST VIEW (NO TABLES) ---
              <div className="p-4 sm:p-6">
                {/* Select All Checkbox for the current page */}
                <div
                  className="flex items-center gap-4 py-3 mb-4 rounded-lg px-4 cursor-pointer"
                  style={{ backgroundColor: isDark ? "#111" : "#f9f9f9" }}
                  onClick={toggleSelectAll} // Make the whole bar clickable
                >
                  <input
                    type="checkbox"
                    checked={
                      selectedUsers.size === paginated.length &&
                      paginated.length > 0
                    }
                    onChange={toggleSelectAll}
                    className="w-5 h-5 rounded-md border-2 cursor-pointer accent-black dark:accent-white"
                    style={{ borderColor: textMuted }}
                  />
                  <span className="font-bold">
                    {selectedUsers.size > 0
                      ? `Deselect All (${selectedUsers.size})`
                      : `Select Page (${paginated.length})`}
                  </span>
                </div>

                <ul className="space-y-4">
                  {paginated.map((s, i) => (
                    <motion.li
                      key={s.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      // Add padding-left conditional on showCheckboxes
                      className={`p-4 rounded-xl border flex items-start gap-4 shadow-sm transition-all duration-300 ${
                        showCheckboxes ? "pl-2" : "pl-4"
                      }`}
                      style={{
                        borderColor: border,
                        backgroundColor: isDark ? "#080808" : "#fbfbfb",
                      }}
                    >
                      {/* Checkbox - Conditionally rendered based on showCheckboxes state */}
                      <div
                        className={`pt-1 transition-opacity duration-300 ${
                          showCheckboxes
                            ? "opacity-100 w-5"
                            : "opacity-0 w-0 pointer-events-none"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedUsers.has(s.id)}
                          onChange={() => toggleUser(s.id)}
                          className="w-5 h-5 rounded-md border-2 cursor-pointer accent-black dark:accent-white"
                          style={{ borderColor: textMuted }}
                        />
                      </div>

                      {/* Content Card: Name and Email */}
                      <div className="flex-1 min-w-0">
                        <p className="text-lg font-bold truncate">
                          {s.name || "—"}
                        </p>
                        <a
                          href={`mailto:${s.email}`}
                          className="flex items-center gap-1 hover:underline text-sm truncate"
                          style={{ color: textMuted }}
                          title={s.email}
                        >
                          <Mail size={14} className="flex-shrink-0" />
                          <span className="truncate">{s.email}</span>
                        </a>
                      </div>

                      {/* Joined Date */}
                      <div className="text-right flex-shrink-0 text-sm pt-1">
                        <span className="block font-medium">Joined</span>
                        <span style={{ color: textMuted }}>
                          {new Date(s.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>
              // --- END: MOBILE LIST VIEW (NO TABLES) ---
            )}

            {/* Pagination */}
            <div
              className="flex flex-col sm:flex-row items-center justify-between p-5 gap-4 border-t"
              style={{ borderColor: border }}
            >
              <p style={{ color: textMuted }} className="text-sm">
                Page {currentPage} of {totalPages} • Showing {paginated.length}{" "}
                of {total}
              </p>

              <div className="flex items-center gap-3">
                {/* Send Mail Button is only visible if users are selected */}
                {selectedUsers.size > 0 && (
                  <button
                    onClick={sendMailToSelected}
                    className="px-5 py-2 rounded-lg font-bold bg-black text-white flex items-center gap-2 text-sm"
                  >
                    <Mail size={16} /> Send ({selectedUsers.size})
                  </button>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="p-2 disabled:opacity-40"
                  >
                    <ChevronsLeft size={20} />
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 disabled:opacity-40"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span className="font-bold w-16 text-center">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2 disabled:opacity-40"
                  >
                    <ChevronRight size={20} />
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-2 disabled:opacity-40"
                  >
                    <ChevronsRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
