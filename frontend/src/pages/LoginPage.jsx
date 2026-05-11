import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import AuthVisual from "../components/AuthVisual";

export default function LoginPage({ onNavigate, onLogin }) {
    const { login } = useAuth();
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const data = await login(form.email, form.password);
            onLogin(data);
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                    "Login failed. Please try again.",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <AuthVisual />
            <div className="auth-form-panel">
                <div className="auth-form-container fade-in">
                    <div className="auth-logo">
                        <div className="auth-logo-icon">🔐</div>
                        <span className="auth-logo-text">SecureAuth</span>
                    </div>

                    <h1 className="auth-heading">Welcome back</h1>
                    <p className="auth-subheading">
                        Sign in to your account to continue.
                    </p>

                    {error && (
                        <div className="alert alert-error">
                            <span>⚠</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                className="form-input"
                                name="email"
                                type="email"
                                placeholder="john@example.com"
                                value={form.email}
                                onChange={handleChange}
                                required
                                autoFocus
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                className="form-input"
                                name="password"
                                type="password"
                                placeholder="Your password"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? <span className="spinner" /> : null}
                            {loading ? "Signing in..." : "Sign in"}
                        </button>
                    </form>

                    <div className="auth-divider">or</div>

                    <div className="auth-switch">
                        Don't have an account?{" "}
                        <button onClick={() => onNavigate("register")}>
                            Create one
                        </button>
                    </div>

                    <div
                        className="auth-switch"
                        style={{ marginTop: "0.75rem" }}
                    >
                        Need to verify email?{" "}
                        <button onClick={() => onNavigate("verify")}>
                            Verify OTP
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
