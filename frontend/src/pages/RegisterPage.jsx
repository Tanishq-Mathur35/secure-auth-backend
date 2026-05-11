import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import AuthVisual from "../components/AuthVisual";

export default function RegisterPage({ onNavigate }) {
    const { register } = useAuth();
    const [form, setForm] = useState({ username: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await register(form.username, form.email, form.password);
            setSuccess(true);
            setTimeout(() => onNavigate("verify", form.email), 1500);
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                    "Registration failed. Please try again.",
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

                    <h1 className="auth-heading">Create account</h1>
                    <p className="auth-subheading">
                        Get started — we'll send a verification OTP to your
                        email.
                    </p>

                    {error && (
                        <div className="alert alert-error">
                            <span>⚠</span>
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="alert alert-success">
                            <span>✓</span>
                            <span>
                                Account created! Redirecting to verify...
                            </span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Username</label>
                            <input
                                className="form-input"
                                name="username"
                                type="text"
                                placeholder="john_doe"
                                value={form.username}
                                onChange={handleChange}
                                required
                                minLength={3}
                                autoFocus
                            />
                        </div>

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
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                className="form-input"
                                name="password"
                                type="password"
                                placeholder="At least 6 characters"
                                value={form.password}
                                onChange={handleChange}
                                required
                                minLength={6}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? <span className="spinner" /> : null}
                            {loading ? "Creating account..." : "Create account"}
                        </button>
                    </form>

                    <div className="auth-switch">
                        Already have an account?{" "}
                        <button onClick={() => onNavigate("login")}>
                            Sign in
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
