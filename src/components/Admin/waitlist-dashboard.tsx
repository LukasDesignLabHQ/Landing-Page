// WaitlistDashboard.tsx (Responsive + polished checkboxes)
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

  // ... copyEmails, exportCSV, toggle functions remain unchanged ...

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
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(paginated.map((s) => s.id)));
    }
  };

  const toggleUser = (id: string) => {
    const newSet = new Set(selectedUsers);
    newSet.has(id) ? newSet.delete(id) : newSet.add(id);
    setSelectedUsers(newSet);
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
      {/* Admin Modal - unchanged except small mobile tweaks */}
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

          {/* Responsive Table Container */}
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
              <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-500">
                <table className="w-full min-w-[640px]">
                  <thead
                    style={{ backgroundColor: isDark ? "#111" : "#f9f9f9" }}
                  >
                    <tr>
                      <th className="px-4 py-5 text-left">
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
                      </th>
                      <th className="px-6 py-5 text-left font-bold">Name</th>
                      <th className="px-6 py-5 text-left font-bold">Email</th>
                      <th className="px-6 py-5 text-right font-bold">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((s, i) => (
                      <motion.tr
                        key={s.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.02 }}
                        className="border-t"
                        style={{ borderColor: border }}
                      >
                        <td className="px-4 py-5">
                          <input
                            type="checkbox"
                            checked={selectedUsers.has(s.id)}
                            onChange={() => toggleUser(s.id)}
                            className="w-5 h-5 rounded-md border-2 cursor-pointer accent-black dark:accent-white"
                            style={{ borderColor: textMuted }}
                          />
                        </td>
                        <td className="px-6 py-5 font-medium">
                          {s.name || "—"}
                        </td>
                        <td className="px-6 py-5">
                          <a
                            href={`mailto:${s.email}`}
                            className="flex items-center gap-2 hover:underline"
                            style={{ color: text }}
                          >
                            <span className="truncate max-w-[200px] inline-block sm:max-w-none">
                              {s.email}
                            </span>
                            <Mail size={14} />
                          </a>
                        </td>
                        <td
                          className="px-6 py-5 text-right"
                          style={{ color: textMuted }}
                        >
                          {new Date(s.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
