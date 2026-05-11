import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import AuthVisual from "../components/AuthVisual";

export default function VerifyPage({ email, onNavigate }) {
    const { verifyEmail } = useAuth();
    const [digits, setDigits] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const inputs = useRef([]);

    const handleDigit = (idx, val) => {
        const char = val.replace(/\D/g, "").slice(-1);
        const newDigits = [...digits];
        newDigits[idx] = char;
        setDigits(newDigits);
        setError("");
        if (char && idx < 5) {
            inputs.current[idx + 1]?.focus();
        }
        if (newDigits.every((d) => d) && char) {
            submitOtp(newDigits.join(""));
        }
    };

    const handleKeyDown = (idx, e) => {
        if (e.key === "Backspace" && !digits[idx] && idx > 0) {
            inputs.current[idx - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, 6);
        const newDigits = pasted
            .split("")
            .concat(Array(6).fill(""))
            .slice(0, 6);
        setDigits(newDigits);
        if (pasted.length === 6) submitOtp(pasted);
        else inputs.current[pasted.length]?.focus();
    };

    const submitOtp = async (otp) => {
        if (!email) {
            setError("Email not found. Please register again.");
            return;
        }
        setLoading(true);
        setError("");
        try {
            await verifyEmail(email, otp);
            setSuccess(true);
            setTimeout(() => onNavigate("login"), 1800);
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                    "Invalid OTP. Please try again.",
            );
            setDigits(["", "", "", "", "", ""]);
            inputs.current[0]?.focus();
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

                    <h1 className="auth-heading">Check your email</h1>
                    <p className="auth-subheading">
                        We sent a 6-digit code to{" "}
                        <span className="mono-tag">
                            {email || "your email"}
                        </span>
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
                            <span>Email verified! Redirecting to login...</span>
                        </div>
                    )}

                    <div className="otp-inputs" onPaste={handlePaste}>
                        {digits.map((d, i) => (
                            <input
                                key={i}
                                ref={(el) => (inputs.current[i] = el)}
                                className={`otp-digit${d ? " filled" : ""}`}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={d}
                                onChange={(e) => handleDigit(i, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(i, e)}
                                autoFocus={i === 0}
                                disabled={loading || success}
                            />
                        ))}
                    </div>

                    <button
                        className="btn btn-primary"
                        disabled={loading || digits.some((d) => !d)}
                        onClick={() => submitOtp(digits.join(""))}
                    >
                        {loading ? <span className="spinner" /> : null}
                        {loading ? "Verifying..." : "Verify email"}
                    </button>

                    <div className="auth-switch">
                        Wrong email?{" "}
                        <button onClick={() => onNavigate("register")}>
                            Register again
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
