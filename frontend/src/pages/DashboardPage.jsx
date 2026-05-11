import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function DashboardPage({ onLogout }) {
    const { user, accessToken, logout, logoutAll, refreshAccessToken, getMe } =
        useAuth();
    const [loading, setLoading] = useState(null);
    const [refreshed, setRefreshed] = useState(false);
    const [message, setMessage] = useState("");

    const initials = user?.username
        ? user.username.slice(0, 2).toUpperCase()
        : "??";

    const handleLogout = async () => {
        setLoading("logout");
        try {
            await logout();
            onLogout();
        } finally {
            setLoading(null);
        }
    };

    const handleLogoutAll = async () => {
        setLoading("logout-all");
        try {
            await logoutAll();
            onLogout();
        } finally {
            setLoading(null);
        }
    };

    const handleRefresh = async () => {
        setLoading("refresh");
        setMessage("");
        try {
            await refreshAccessToken();
            setRefreshed(true);
            setMessage("Token refreshed successfully!");
            setTimeout(() => setMessage(""), 3000);
        } catch (err) {
            setMessage("Failed to refresh token.");
        } finally {
            setLoading(null);
        }
    };

    const handleGetMe = async () => {
        setLoading("getme");
        setMessage("");
        try {
            await getMe();
            setMessage("Profile fetched from server successfully!");
            setTimeout(() => setMessage(""), 3000);
        } catch {
            setMessage("Failed to fetch profile. Token may be expired.");
        } finally {
            setLoading(null);
        }
    };

    const truncateToken = (token) => {
        if (!token) return "No token";
        return token.slice(0, 50) + "..." + token.slice(-20);
    };

    return (
        <div className="dashboard">
            {/* Topbar */}
            <header className="topbar">
                <div className="topbar-logo">
                    <div className="topbar-logo-icon">🔐</div>
                    <span>SecureAuth</span>
                </div>
                <div className="topbar-actions">
                    <div className="avatar">{initials}</div>
                    <button
                        className="btn btn-ghost btn-sm"
                        onClick={handleLogout}
                        disabled={loading === "logout"}
                    >
                        {loading === "logout" ? (
                            <span
                                className="spinner"
                                style={{ width: 12, height: 12 }}
                            />
                        ) : null}
                        Sign out
                    </button>
                </div>
            </header>

            {/* Main content */}
            <main className="dashboard-main">
                <div className="dashboard-greeting fade-in">
                    <h1>Hello, {user?.username || "User"} 👋</h1>
                    <p>Your authentication session is active and secure.</p>
                </div>

                {message && (
                    <div
                        className={`alert ${message.includes("success") ? "alert-success" : "alert-error"} fade-in`}
                    >
                        <span>{message.includes("success") ? "✓" : "⚠"}</span>
                        <span>{message}</span>
                    </div>
                )}

                {/* Stats */}
                <div className="stats-grid fade-in fade-in-delay-1">
                    <div className="stat-card">
                        <p className="stat-label">Session status</p>
                        <p className="stat-value">Active</p>
                        <span className="stat-badge">● Live</span>
                    </div>
                    <div className="stat-card">
                        <p className="stat-label">Access token</p>
                        <p className="stat-value">15m</p>
                        <span className="stat-badge">Short-lived</span>
                    </div>
                    <div className="stat-card">
                        <p className="stat-label">Refresh token</p>
                        <p className="stat-value">7d</p>
                        <span className="stat-badge">Rotating</span>
                    </div>
                </div>

                {/* Profile */}
                <div className="profile-card fade-in fade-in-delay-2">
                    <div className="profile-card-header">
                        <div className="profile-avatar-lg">{initials}</div>
                        <div>
                            <div className="profile-name">
                                {user?.username || "—"}
                            </div>
                            <div className="profile-verified-badge">
                                ✓ Verified
                            </div>
                        </div>
                        <div style={{ marginLeft: "auto" }}>
                            <button
                                className="btn btn-ghost btn-sm"
                                onClick={handleGetMe}
                                disabled={!!loading}
                            >
                                {loading === "getme" ? (
                                    <span
                                        className="spinner"
                                        style={{ width: 12, height: 12 }}
                                    />
                                ) : null}
                                Fetch profile
                            </button>
                        </div>
                    </div>

                    <div className="profile-fields">
                        <div className="profile-field">
                            <span className="profile-field-label">
                                Username
                            </span>
                            <span className="profile-field-value">
                                {user?.username || "—"}
                            </span>
                        </div>
                        <div className="profile-field">
                            <span className="profile-field-label">Email</span>
                            <span className="profile-field-value">
                                {user?.email || "—"}
                            </span>
                        </div>
                        <div className="profile-field">
                            <span className="profile-field-label">
                                Auth method
                            </span>
                            <span className="profile-field-value mono-tag">
                                JWT + Refresh Tokens
                            </span>
                        </div>
                        <div className="profile-field">
                            <span className="profile-field-label">Hashing</span>
                            <span className="profile-field-value mono-tag">
                                SHA-256
                            </span>
                        </div>
                    </div>
                </div>

                {/* Token Display */}
                <div className="token-card fade-in fade-in-delay-3">
                    <h3>Access Token</h3>
                    <div className="token-display">
                        {truncateToken(accessToken)}
                    </div>
                    <div className="token-actions">
                        <button
                            className="btn btn-ghost btn-sm"
                            onClick={handleRefresh}
                            disabled={!!loading}
                        >
                            {loading === "refresh" ? (
                                <span
                                    className="spinner"
                                    style={{ width: 12, height: 12 }}
                                />
                            ) : null}
                            🔄 Rotate token
                        </button>
                        <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => {
                                if (accessToken)
                                    navigator.clipboard.writeText(accessToken);
                            }}
                        >
                            📋 Copy token
                        </button>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="fade-in fade-in-delay-3">
                    <p className="section-heading">Session management</p>
                    <div className="danger-zone">
                        <p className="danger-zone-title">⚠ Danger zone</p>
                        <p className="danger-zone-desc">
                            Logging out from all devices revokes every active
                            session immediately. Old refresh tokens become
                            invalid across all browsers and devices.
                        </p>
                        <button
                            className="btn btn-danger"
                            onClick={handleLogoutAll}
                            disabled={!!loading}
                        >
                            {loading === "logout-all" ? (
                                <span
                                    className="spinner"
                                    style={{
                                        width: 12,
                                        height: 12,
                                        borderColor: "rgba(239,68,68,0.3)",
                                        borderTopColor: "#ef4444",
                                    }}
                                />
                            ) : null}
                            Revoke all sessions
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
