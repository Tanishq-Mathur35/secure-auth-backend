import { useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import VerifyPage from "./pages/VerifyPage";
import DashboardPage from "./pages/DashboardPage";

function AppRouter() {
    const [page, setPage] = useState("login");
    const [verifyEmail, setVerifyEmail] = useState("");
    const [isAuthed, setIsAuthed] = useState(false);

    const navigate = (to, email) => {
        if (to === "verify" && email) setVerifyEmail(email);
        setPage(to);
    };

    const handleLogin = () => {
        setIsAuthed(true);
        setPage("dashboard");
    };

    const handleLogout = () => {
        setIsAuthed(false);
        setPage("login");
    };

    if (isAuthed && page === "dashboard") {
        return <DashboardPage onLogout={handleLogout} />;
    }

    if (page === "register") {
        return <RegisterPage onNavigate={navigate} />;
    }

    if (page === "verify") {
        return <VerifyPage email={verifyEmail} onNavigate={navigate} />;
    }

    return <LoginPage onNavigate={navigate} onLogin={handleLogin} />;
}

export default function App() {
    return (
        <AuthProvider>
            <AppRouter />
        </AuthProvider>
    );
}
