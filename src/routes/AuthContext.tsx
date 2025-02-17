import { getAuth, signOut } from "firebase/auth";
import { createContext, useContext, useState, ReactNode } from "react";
import { useNavigate } from 'react-router-dom';

interface AuthContextProps {
    admin: string | null;
    login: (email: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextProps>({
    admin: null,
    login: () => { },
    logout: () => { },
    isAuthenticated: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [admin, setAdmin] = useState<string | null>(() => {
        try {
            return localStorage.getItem("admin");
        } catch {
            return null;
        }
    });

    const navigate = useNavigate();

    const login = (email: string) => {
        try {
            setAdmin(email);
            localStorage.setItem("admin", email);
        } catch (error) {
            console.error("Failed to login:", error);
        }
    };

    const logout = async () => {
        try {
            const auth = getAuth();
            await signOut(auth);

            setAdmin(null);
            localStorage.removeItem("admin");
            localStorage.removeItem("loginTime");
            navigate('/login');

        } catch (error) {
            console.error("Failed to logout:", error);
        }
    };

    const isAuthenticated = !!admin;

    return (
        <AuthContext.Provider value={{ admin, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
