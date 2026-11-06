"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface AdminOrder {
  _id: string;
  orderRef: string;
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  occasion?: string;
  templateName?: string;
  status: string;
  internalNotes?: string;
  invitationUrl?: string;
  eventDetails?: {
    eventDate?: string;
    venueName?: string;
  };
  createdAt: string;
}

interface AdminTemplate {
  slug: string;
  title: string;
  category: string;
  price: number;
  description: string;
  isPublished: boolean;
}

interface AdminRsvp {
  _id: string;
  name: string;
  attending: "yes" | "no";
  guestCount?: number;
  phone?: string;
  email?: string;
  invitationSlug?: string;
  timestamp: string;
}

interface AdminWish {
  _id: string;
  name: string;
  message: string;
  invitationSlug?: string;
  timestamp: string;
}

interface AdminEnquiry {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  status: string;
  message: string;
  timestamp: string;
}

interface AdminStorageFile {
  originalName: string;
  size: number;
  storageProvider: string;
}

interface DashboardMetrics {
  orders: {
    total: number;
    new: number;
    inProgress: number;
    completed: number;
    cancelled: number;
    recent: AdminOrder[];
  };
  customers: { total: number };
  templates: { total: number; published: number };
  invitations: { active: number };
  wishes: { total: number };
  rsvps: { totalResponses: number; attendingGuests: number };
  enquiries: { pending: number };
  storage: {
    totalFiles: number;
    totalMB: string;
    photoCount: number;
    videoCount: number;
    provider: string;
    recentFiles: AdminStorageFile[];
  };
}

export default function AdminPage() {
  const [mounted, setMounted] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      const saved = localStorage.getItem("admin-token");
      if (saved) setToken(saved);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (newToken: string) => {
    localStorage.setItem("admin-token", newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin-token");
    setToken(null);
  };

  if (!mounted) {
    return <div className="min-h-screen bg-neutral-900" />;
  }

  if (!token) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return <AdminDashboard token={token} onLogout={handleLogout} />;
}

/* ---------------------------------------------------- */
/* LOGIN FORM                                           */
/* ---------------------------------------------------- */
function LoginForm({ onLogin }: { onLogin: (token: string) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      onLogin(data.token);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-neutral-950 via-neutral-900 to-amber-950/30 text-neutral-200">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-neutral-900/90 border border-neutral-800 shadow-2xl backdrop-blur-xl"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto mb-3 text-xl">
            👑
          </div>
          <h1 className="font-display text-2xl font-bold text-white tracking-wide">
            Platform Administration
          </h1>
          <p className="text-xs text-neutral-400 mt-1 font-light">
            My Beloved Digital Invitation Operations
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5 uppercase tracking-wider">
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-neutral-800/80 border border-neutral-700 text-white text-xs focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-neutral-800/80 border border-neutral-700 text-white text-xs focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 rounded-xl font-semibold uppercase tracking-wider text-xs text-neutral-950 shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, #D4AF37, #B8860B)",
            }}
          >
            {loading ? "Authenticating..." : "Sign In to Admin Portal"}
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-neutral-800/80 text-center">
          <Link href="/" className="text-xs text-neutral-500 hover:text-neutral-300">
            ← Back to Public Website
          </Link>
        </div>
      </form>
    </div>
  );
}

/* ---------------------------------------------------- */
/* FULL EXECUTIVE ADMIN DASHBOARD                       */
/* ---------------------------------------------------- */
function AdminDashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [tab, setTab] = useState<
    "overview" | "orders" | "templates" | "rsvps" | "wishes" | "enquiries" | "storage"
  >("overview");

  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [templates, setTemplates] = useState<AdminTemplate[]>([]);
  const [rsvps, setRsvps] = useState<AdminRsvp[]>([]);
  const [wishes, setWishes] = useState<AdminWish[]>([]);
  const [enquiries, setEnquiries] = useState<AdminEnquiry[]>([]);
  const [storageData, setStorageData] = useState<{
    totalMB: string;
    totalFiles: number;
    provider: string;
    photoCount: number;
    videoCount: number;
    recentFiles: AdminStorageFile[];
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [orderFilter, setOrderFilter] = useState("ALL");
  const [orderSearch, setOrderSearch] = useState("");

  // Edit / status update modal state
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [newInternalNotes, setNewInternalNotes] = useState("");
  const [newInvitationUrl, setNewInvitationUrl] = useState("");
  const [updatingOrder, setUpdatingOrder] = useState(false);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [mRes, oRes, tRes, rRes, wRes, eRes, sRes] = await Promise.all([
        fetch("/api/admin/metrics", { headers }),
        fetch("/api/orders", { headers }),
        fetch("/api/templates?all=true", { headers }),
        fetch("/api/rsvp", { headers }),
        fetch("/api/wishes", { headers }),
        fetch("/api/enquiries", { headers }),
        fetch("/api/storage", { headers }),
      ]);

      if (mRes.ok) {
        const mData = await mRes.json();
        if (mData && !mData.error) setMetrics(mData);
      }
      if (oRes.ok) {
        const oData = await oRes.json();
        if (Array.isArray(oData)) setOrders(oData);
      }
      if (tRes.ok) {
        const tData = await tRes.json();
        if (Array.isArray(tData)) setTemplates(tData);
      }
      if (rRes.ok) {
        const rData = await rRes.json();
        if (rData && Array.isArray(rData.rsvps)) setRsvps(rData.rsvps);
      }
      if (wRes.ok) {
        const wData = await wRes.json();
        if (Array.isArray(wData)) setWishes(wData);
      }
      if (eRes.ok) {
        const eData = await eRes.json();
        if (Array.isArray(eData)) setEnquiries(eData);
      }
      if (sRes.ok) {
        const sData = await sRes.json();
        if (sData && !sData.error) setStorageData(sData);
      }
    } catch (err) {
      console.warn("Failed to fetch admin data:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAllData();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchAllData]);

  // Handle Order Update
  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setUpdatingOrder(true);

    try {
      const res = await fetch(`/api/orders/${selectedOrder.orderRef}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
          internalNotes: newInternalNotes,
          invitationUrl: newInvitationUrl,
        }),
      });

      if (res.ok) {
        setSelectedOrder(null);
        fetchAllData();
      }
    } catch {
      alert("Failed to update order");
    } finally {
      setUpdatingOrder(false);
    }
  };

  // Delete Wish
  const handleDeleteWish = async (id: string) => {
    if (!confirm("Are you sure you want to delete this wish?")) return;
    try {
      const res = await fetch(`/api/wishes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setWishes((prev) => prev.filter((w) => w._id !== id));
      }
    } catch {
      alert("Failed to delete wish");
    }
  };

  // Export RSVPs as CSV
  const exportRsvpsCsv = () => {
    if (rsvps.length === 0) {
      alert("No RSVPs to export");
      return;
    }
    const headers = ["Invitation", "Name", "Attending", "Guests", "Email", "Phone", "Date"];
    const rows = rsvps.map((r) => [
      r.invitationSlug || "",
      `"${r.name.replace(/"/g, '""')}"`,
      r.attending,
      r.guestCount || 1,
      r.email || "",
      r.phone || "",
      new Date(r.timestamp).toLocaleDateString(),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `rsvps_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesFilter = orderFilter === "ALL" || o.status === orderFilter;
    const matchesSearch =
      orderSearch.trim() === "" ||
      o.orderRef?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer?.name?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer?.phone?.includes(orderSearch);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200">
      {/* Top Admin Bar */}
      <header className="bg-neutral-900 border-b border-neutral-800 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold text-sm">
            👑
          </div>
          <div>
            <h1 className="font-display font-bold text-base text-white tracking-wide">
              My Beloved Admin Console
            </h1>
            <span className="text-[10px] text-neutral-400">
              Environment: Production • Node Single Instance
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="px-3.5 py-1.5 rounded-full text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 transition-colors"
          >
            Visit Live Site ↗
          </Link>
          <button
            onClick={onLogout}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-rose-300 bg-rose-950/40 border border-rose-800/80 hover:bg-rose-900/60 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-neutral-900/60 border-b border-neutral-800 px-6 overflow-x-auto">
        <div className="flex gap-2 py-2 min-w-max">
          {[
            { id: "overview" as const, label: "📊 Overview" },
            { id: "orders" as const, label: `📦 Orders (${orders.length})` },
            { id: "templates" as const, label: `🎨 Templates (${templates.length})` },
            { id: "rsvps" as const, label: `💌 RSVPs (${rsvps.length})` },
            { id: "wishes" as const, label: `✨ Wishes (${wishes.length})` },
            { id: "enquiries" as const, label: `💬 Enquiries (${enquiries.length})` },
            { id: "storage" as const, label: "☁️ Storage & Media" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                tab === t.id
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-800/60"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto p-6">
        {loading ? (
          <div className="py-24 text-center">
            <div className="inline-block w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs text-neutral-400 uppercase tracking-widest">
              Syncing database metrics...
            </p>
          </div>
        ) : (
          <>
            {/* 1. OVERVIEW TAB */}
            {tab === "overview" && metrics && (
              <div className="space-y-8">
                {/* Metric Cards Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 shadow-sm">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                      Total Orders
                    </span>
                    <div className="font-display text-3xl font-bold text-white mt-1">
                      {metrics.orders.total}
                    </div>
                    <div className="text-[11px] text-amber-400 mt-1">
                      {metrics.orders.new} New • {metrics.orders.inProgress} In Production
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 shadow-sm">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                      Unique Customers
                    </span>
                    <div className="font-display text-3xl font-bold text-emerald-400 mt-1">
                      {metrics.customers.total}
                    </div>
                    <div className="text-[11px] text-neutral-400 mt-1">
                      Verified email records
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 shadow-sm">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                      Active Published Invites
                    </span>
                    <div className="font-display text-3xl font-bold text-amber-300 mt-1">
                      {metrics.invitations.active}
                    </div>
                    <div className="text-[11px] text-neutral-400 mt-1">
                      {metrics.templates.published} templates published
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 shadow-sm">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                      Attending Guests
                    </span>
                    <div className="font-display text-3xl font-bold text-sky-400 mt-1">
                      {metrics.rsvps.attendingGuests}
                    </div>
                    <div className="text-[11px] text-neutral-400 mt-1">
                      Across {metrics.rsvps.totalResponses} confirmed responses
                    </div>
                  </div>
                </div>

                {/* Recent Orders Overview */}
                <div className="p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display font-bold text-base text-white">
                      Recent Orders
                    </h3>
                    <button
                      onClick={() => setTab("orders")}
                      className="text-xs text-amber-400 hover:underline"
                    >
                      View All Orders ({orders.length}) →
                    </button>
                  </div>

                  {orders.length === 0 ? (
                    <p className="text-xs text-neutral-500 py-6 text-center">
                      No orders placed yet.
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-neutral-800 text-neutral-400 font-semibold">
                            <th className="pb-3">Reference</th>
                            <th className="pb-3">Customer</th>
                            <th className="pb-3">Occasion</th>
                            <th className="pb-3">Template</th>
                            <th className="pb-3">Status</th>
                            <th className="pb-3">Date</th>
                            <th className="pb-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800/60">
                          {orders.slice(0, 6).map((o) => (
                            <tr key={o._id} className="hover:bg-neutral-800/30">
                              <td className="py-3 font-mono font-bold text-amber-300">
                                {o.orderRef}
                              </td>
                              <td className="py-3 text-white">
                                {o.customer?.name}
                                <span className="block text-[10px] text-neutral-400">
                                  {o.customer?.phone}
                                </span>
                              </td>
                              <td className="py-3 text-neutral-300">{o.occasion}</td>
                              <td className="py-3 text-neutral-300">{o.templateName}</td>
                              <td className="py-3">
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-950/60 text-amber-300 border border-amber-800/60">
                                  {o.status}
                                </span>
                              </td>
                              <td className="py-3 text-neutral-400">
                                {new Date(o.createdAt).toLocaleDateString()}
                              </td>
                              <td className="py-3 text-right">
                                <button
                                  onClick={() => {
                                    setSelectedOrder(o);
                                    setNewStatus(o.status);
                                    setNewInternalNotes(o.internalNotes || "");
                                    setNewInvitationUrl(o.invitationUrl || "");
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[11px]"
                                >
                                  Manage
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2. ORDERS MANAGEMENT TAB */}
            {tab === "orders" && (
              <div className="space-y-6">
                {/* Search & Filter Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
                  <div className="flex items-center gap-2 w-full sm:w-80">
                    <input
                      type="text"
                      placeholder="Search by ref, customer name, phone..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {[
                      "ALL",
                      "NEW",
                      "CONTACTED",
                      "DETAILS_RECEIVED",
                      "IN_PROGRESS",
                      "COMPLETED",
                      "CANCELLED",
                    ].map((st) => (
                      <button
                        key={st}
                        onClick={() => setOrderFilter(st)}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                          orderFilter === st
                            ? "bg-amber-500 text-neutral-950"
                            : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Orders Table */}
                <div className="p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-neutral-800 text-neutral-400 font-semibold">
                        <th className="pb-3">Reference</th>
                        <th className="pb-3">Customer Info</th>
                        <th className="pb-3">Event Details</th>
                        <th className="pb-3">Design</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Published Link</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/60">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-neutral-500">
                            No orders found matching your search.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((o) => (
                          <tr key={o._id} className="hover:bg-neutral-800/30">
                            <td className="py-3 font-mono font-bold text-amber-300">
                              {o.orderRef}
                            </td>
                            <td className="py-3">
                              <span className="font-semibold text-white block">
                                {o.customer?.name}
                              </span>
                              <span className="text-[10px] text-neutral-400 block">
                                {o.customer?.email}
                              </span>
                              <span className="text-[10px] text-neutral-400 block">
                                {o.customer?.phone}
                              </span>
                            </td>
                            <td className="py-3 text-neutral-300">
                              <div>{o.eventDetails?.eventDate}</div>
                              <div className="text-[10px] text-neutral-400">
                                {o.eventDetails?.venueName}
                              </div>
                            </td>
                            <td className="py-3 text-neutral-300">{o.templateName}</td>
                            <td className="py-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                  o.status === "COMPLETED"
                                    ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                                    : o.status === "CANCELLED"
                                    ? "bg-rose-950 text-rose-300 border border-rose-800"
                                    : "bg-amber-950 text-amber-300 border border-amber-800"
                                }`}
                              >
                                {o.status}
                              </span>
                            </td>
                            <td className="py-3">
                              {o.invitationUrl ? (
                                <a
                                  href={o.invitationUrl}
                                  target="_blank"
                                  className="text-[11px] text-amber-400 hover:underline"
                                >
                                  View Live ↗
                                </a>
                              ) : (
                                <span className="text-[11px] text-neutral-500">Not linked</span>
                              )}
                            </td>
                            <td className="py-3 text-right">
                              <button
                                onClick={() => {
                                  setSelectedOrder(o);
                                  setNewStatus(o.status);
                                  setNewInternalNotes(o.internalNotes || "");
                                  setNewInvitationUrl(o.invitationUrl || "");
                                }}
                                className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500 hover:text-neutral-950 transition-colors text-[11px] font-medium"
                              >
                                Process Order
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. TEMPLATES MANAGEMENT TAB */}
            {tab === "templates" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-lg text-white">
                    Platform Templates ({templates.length})
                  </h3>
                  <button
                    onClick={() =>
                      alert("To add a new template, you can register via the API or contact dev.")
                    }
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 text-neutral-950"
                  >
                    + Add New Template
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {templates.map((t) => (
                    <div
                      key={t.slug}
                      className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800">
                            {t.category}
                          </span>
                          <span className="text-xs font-mono font-bold text-neutral-300">
                            ₹{t.price}
                          </span>
                        </div>
                        <h4 className="font-display font-bold text-base text-white mb-1">
                          {t.title}
                        </h4>
                        <p className="text-xs text-neutral-400 line-clamp-2 mb-4">
                          {t.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-neutral-800 text-xs">
                        <span
                          className={`font-semibold ${
                            t.isPublished ? "text-emerald-400" : "text-neutral-500"
                          }`}
                        >
                          {t.isPublished ? "● Published" : "○ Draft"}
                        </span>
                        <Link
                          href={`/preview/${t.slug}`}
                          target="_blank"
                          className="text-amber-400 hover:underline"
                        >
                          Live Preview ↗
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. RSVPS TAB */}
            {tab === "rsvps" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-bold text-lg text-white">
                      Guest RSVP Confirmations
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Total responses: {rsvps.length}
                    </p>
                  </div>
                  <button
                    onClick={exportRsvpsCsv}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition-colors"
                  >
                    <span>📥</span> Export RSVPs (CSV)
                  </button>
                </div>

                <div className="p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-neutral-800 text-neutral-400 font-semibold">
                        <th className="pb-3">Guest Name</th>
                        <th className="pb-3">Attending</th>
                        <th className="pb-3">Headcount</th>
                        <th className="pb-3">Contact</th>
                        <th className="pb-3">Invitation</th>
                        <th className="pb-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/60">
                      {rsvps.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-neutral-500">
                            No RSVPs received yet.
                          </td>
                        </tr>
                      ) : (
                        rsvps.map((r) => (
                          <tr key={r._id} className="hover:bg-neutral-800/30">
                            <td className="py-3 font-semibold text-white">{r.name}</td>
                            <td className="py-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                  r.attending === "yes"
                                    ? "bg-emerald-950 text-emerald-300"
                                    : "bg-rose-950 text-rose-300"
                                }`}
                              >
                                {r.attending === "yes" ? "Attending" : "Declined"}
                              </span>
                            </td>
                            <td className="py-3 text-neutral-200">{r.guestCount || 1}</td>
                            <td className="py-3 text-neutral-400">{r.phone || r.email || "—"}</td>
                            <td className="py-3 text-neutral-300">{r.invitationSlug}</td>
                            <td className="py-3 text-neutral-400">
                              {new Date(r.timestamp).toLocaleDateString()}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 5. WISHES MODERATION TAB */}
            {tab === "wishes" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-lg text-white">
                    Guest Blessings & Wishes ({wishes.length})
                  </h3>
                </div>

                <div className="grid gap-3">
                  {wishes.length === 0 ? (
                    <div className="p-8 text-center text-neutral-500 bg-neutral-900 rounded-2xl">
                      No wishes posted yet.
                    </div>
                  ) : (
                    wishes.map((w) => (
                      <div
                        key={w._id}
                        className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex items-start justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <strong className="text-white text-xs">{w.name}</strong>
                            <span className="text-[10px] text-neutral-500">
                              {new Date(w.timestamp).toLocaleDateString()}
                            </span>
                            {w.invitationSlug && (
                              <span className="text-[10px] text-amber-400">
                                • {w.invitationSlug}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-neutral-300 leading-relaxed">{w.message}</p>
                        </div>

                        <button
                          onClick={() => handleDeleteWish(w._id)}
                          className="px-2.5 py-1 rounded bg-rose-950/60 border border-rose-800 text-rose-300 hover:bg-rose-900 text-[11px] shrink-0"
                        >
                          Delete
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* 6. ENQUIRIES TAB */}
            {tab === "enquiries" && (
              <div className="space-y-6">
                <h3 className="font-display font-bold text-lg text-white">
                  Customer Enquiries ({enquiries.length})
                </h3>

                <div className="grid gap-3">
                  {enquiries.length === 0 ? (
                    <div className="p-8 text-center text-neutral-500 bg-neutral-900 rounded-2xl">
                      No customer enquiries at this time.
                    </div>
                  ) : (
                    enquiries.map((e) => (
                      <div
                        key={e._id}
                        className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <strong className="text-white text-sm">{e.name}</strong>
                            <span className="text-xs text-neutral-400 ml-2">({e.email})</span>
                            {e.phone && (
                              <span className="text-xs text-neutral-400 ml-2">• {e.phone}</span>
                            )}
                          </div>
                          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-950 text-amber-300 border border-amber-800">
                            {e.status}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-300 leading-relaxed mb-2 font-light">
                          {e.message}
                        </p>
                        <span className="text-[10px] text-neutral-500">
                          Received on: {new Date(e.timestamp).toLocaleString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* 7. STORAGE & MEDIA TAB */}
            {tab === "storage" && storageData && (
              <div className="space-y-6">
                <h3 className="font-display font-bold text-lg text-white">
                  Media & Google Drive Storage Management
                </h3>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800">
                    <span className="text-[11px] uppercase font-bold text-neutral-400">
                      Total Storage Consumed
                    </span>
                    <div className="font-display text-3xl font-bold text-amber-300 mt-1">
                      {storageData.totalMB} MB
                    </div>
                    <div className="text-[11px] text-neutral-500 mt-1">
                      {storageData.totalFiles} uploaded items
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800">
                    <span className="text-[11px] uppercase font-bold text-neutral-400">
                      Active Storage Provider
                    </span>
                    <div className="font-display text-xl font-bold text-white mt-1">
                      {storageData.provider}
                    </div>
                    <div className="text-[11px] text-emerald-400 mt-1">
                      Hashing & Deduplication Active
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800">
                    <span className="text-[11px] uppercase font-bold text-neutral-400">
                      Media Breakdown
                    </span>
                    <div className="font-display text-xl font-bold text-white mt-1">
                      {storageData.photoCount} Photos • {storageData.videoCount} Videos
                    </div>
                    <div className="text-[11px] text-neutral-400 mt-1">
                      Safe retention policy enabled
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800">
                  <h4 className="font-display font-bold text-sm text-white mb-4">
                    Recent Uploaded Media Assets
                  </h4>
                  {storageData.recentFiles && storageData.recentFiles.length > 0 ? (
                    <div className="space-y-2">
                      {storageData.recentFiles.map((f: AdminStorageFile, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-xs px-4 py-2.5 rounded-xl bg-neutral-800/40 border border-neutral-800"
                        >
                          <div>
                            <span className="text-white font-medium">{f.originalName}</span>
                            <span className="text-[10px] text-neutral-500 ml-2">
                              ({(f.size / 1024).toFixed(1)} KB)
                            </span>
                          </div>
                          <span className="text-amber-400 text-[11px]">
                            {f.storageProvider}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-500">No media uploaded yet.</p>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* PROCESS ORDER MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl text-xs">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-6">
              <div>
                <h3 className="font-display font-bold text-lg text-white">
                  Process Order: {selectedOrder.orderRef}
                </h3>
                <span className="text-neutral-400">
                  Customer: {selectedOrder.customer?.name} ({selectedOrder.customer?.phone})
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-neutral-500 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateOrder} className="space-y-4">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  Update Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white outline-none"
                >
                  <option value="NEW">NEW</option>
                  <option value="CONTACTED">CONTACTED</option>
                  <option value="DETAILS_RECEIVED">DETAILS_RECEIVED</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  Associate Published Invitation URL
                </label>
                <input
                  type="text"
                  placeholder="e.g. https://mybeloved.in/invite/harsha-indu"
                  value={newInvitationUrl}
                  onChange={(e) => setNewInvitationUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white outline-none"
                />
                <span className="text-[10px] text-neutral-500 mt-1 block">
                  When published, customer can access their live link on the tracking portal.
                </span>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  Internal Notes (Private to Admin)
                </label>
                <textarea
                  rows={3}
                  placeholder="Record customer preferences, audio files received, design revisions..."
                  value={newInternalNotes}
                  onChange={(e) => setNewInternalNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingOrder}
                  className="px-5 py-2 rounded-xl bg-amber-500 text-neutral-950 font-bold"
                >
                  {updatingOrder ? "Saving..." : "Save Order Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
