export default function AuthVisual() {
    const features = [
        { icon: "🔑", text: "JWT · 15min access tokens" },
        { icon: "🔄", text: "Refresh token rotation" },
        { icon: "📧", text: "OTP email verification" },
        { icon: "🖥️", text: "Multi-session management" },
        { icon: "🛡️", text: "SHA-256 · HttpOnly cookies" },
    ];

    return (
        <div className="auth-visual">
            <div className="auth-visual-grid" />

            <div>
                <div className="auth-visual-badge">
                    secure-auth-backend v1.0
                </div>
            </div>

            <div>
                <h2 className="auth-visual-headline">
                    Authentication
                    <br />
                    <em>done right.</em>
                </h2>
            </div>

            <div className="auth-visual-features">
                {features.map((f) => (
                    <div key={f.text} className="auth-feature-item">
                        <div className="auth-feature-icon">{f.icon}</div>
                        <span>{f.text}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
