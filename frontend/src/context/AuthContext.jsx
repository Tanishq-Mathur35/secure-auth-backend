import { createContext, useContext, useState, useCallback } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(false);

    const login = useCallback(async (email, password) => {
        const { data } = await api.post("/api/auth/login", { email, password });
        setUser(data.user);
        setAccessToken(data.accessToken);
        return data;
    }, []);

    const register = useCallback(async (username, email, password) => {
        const { data } = await api.post("/api/auth/register", {
            username,
            email,
            password,
        });
        return data;
    }, []);

    const verifyEmail = useCallback(async (email, otp) => {
        const { data } = await api.post("/api/auth/verify-email", {
            email,
            otp,
        });
        return data;
    }, []);

    const logout = useCallback(async () => {
        try {
            await api.get("/api/auth/logout");
        } catch {}
        setUser(null);
        setAccessToken(null);
    }, []);

    const logoutAll = useCallback(async () => {
        try {
            await api.get("/api/auth/logout-all");
        } catch {}
        setUser(null);
        setAccessToken(null);
    }, []);

    const refreshAccessToken = useCallback(async () => {
        const { data } = await api.get("/api/auth/refresh-token");
        setAccessToken(data.accessToken);
        return data.accessToken;
    }, []);

    const getMe = useCallback(
        async (token) => {
            const tkn = token || accessToken;
            const { data } = await api.get("/api/auth/get-me", {
                headers: { Authorization: `Bearer ${tkn}` },
            });
            setUser(data.user);
            return data.user;
        },
        [accessToken],
    );

    return (
        <AuthContext.Provider
            value={{
                user,
                accessToken,
                loading,
                setLoading,
                login,
                register,
                verifyEmail,
                logout,
                logoutAll,
                refreshAccessToken,
                getMe,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
