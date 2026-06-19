"use client";

import { useState, useEffect, useCallback } from "react";

interface Wish {
  _id: string;
  name: string;
  message: string;
  timestamp: string;
}

export default function AdminPage() {
  const [mounted, setMounted] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("admin-token");
    if (saved) setToken(saved);
  }, []);

  const handleLogin = (newToken: string) => {
    localStorage.setItem("admin-token", newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin-token");
    setToken(null);
  };

  if (!mounted) return <div style={{ minHeight: "100vh", background: "#f5f5f5" }} />;

  if (!token) return <LoginForm onLogin={handleLogin} />;
  return <Dashboard token={token} onLogout={handleLogout} />;
}

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
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#f5f5f5" }}>
      <form onSubmit={handleSubmit}
        style={{
          background: "white", padding: "40px", borderRadius: "12px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.1)", width: "100%", maxWidth: "400px",
        }}
      >
        <h1 style={{ margin: "0 0 8px", fontSize: "24px", fontWeight: 600, color: "#333" }}>Admin Login</h1>
        <p style={{ margin: "0 0 24px", fontSize: "14px", color: "#888" }}>Wedding Invitation Manager</p>

        {error && (
          <div style={{ padding: "10px 14px", background: "#fee", color: "#c00", borderRadius: "8px", fontSize: "14px", marginBottom: "16px" }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#555", marginBottom: "6px" }}>Username</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
            style={{ width: "100%", padding: "10px 14px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box" }}
            required />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#555", marginBottom: "6px" }}>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "10px 14px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box" }}
            required />
        </div>

        <button type="submit" disabled={loading}
          style={{
            width: "100%", padding: "12px", background: loading ? "#999" : "#4A7BB5",
            color: "white", border: "none", borderRadius: "8px", fontSize: "15px",
            fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}

function Dashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchWishes = useCallback(async () => {
    try {
      const res = await fetch("/api/wishes");
      const data = await res.json();
      setWishes(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishes();
  }, [fetchWishes]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this wish?")) return;
    setDeleting(id);

    try {
      const res = await fetch(`/api/wishes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setWishes((prev) => prev.filter((w) => w._id !== id));
      }
    } catch {
      // ignore
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <header
        style={{
          background: "white", padding: "16px 24px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "20px", fontWeight: 600, color: "#333" }}>Wish Manager</h1>
        <button onClick={onLogout} type="button"
          style={{
            padding: "8px 16px", background: "transparent", border: "1px solid #ddd",
            borderRadius: "6px", fontSize: "13px", color: "#666", cursor: "pointer",
          }}
        >
          Logout
        </button>
      </header>

      <main style={{ maxWidth: "800px", margin: "0 auto", padding: "24px" }}>
        {loading ? (
          <p style={{ color: "#888", textAlign: "center", padding: "40px" }}>Loading wishes...</p>
        ) : wishes.length === 0 ? (
          <p style={{ color: "#888", textAlign: "center", padding: "40px" }}>No wishes yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {wishes.map((wish) => (
              <div key={wish._id}
                style={{
                  background: "white", padding: "16px 20px", borderRadius: "10px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                  display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <strong style={{ fontSize: "15px", color: "#333" }}>{wish.name}</strong>
                    <span style={{ fontSize: "12px", color: "#aaa" }}>
                      {new Date(wish.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: "14px", color: "#666", lineHeight: 1.5 }}>{wish.message}</p>
                </div>
                <button onClick={() => handleDelete(wish._id)} disabled={deleting === wish._id}
                  style={{
                    padding: "6px 12px", background: deleting === wish._id ? "#f5f5f5" : "#fee",
                    border: "1px solid #fcc", borderRadius: "6px", fontSize: "12px",
                    color: deleting === wish._id ? "#999" : "#c00",
                    cursor: deleting === wish._id ? "not-allowed" : "pointer",
                    whiteSpace: "nowrap", flexShrink: 0,
                  }}
                >
                  {deleting === wish._id ? "..." : "Delete"}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
