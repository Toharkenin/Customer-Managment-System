import { createContext, useContext, useState, ReactNode } from 'react';


interface AuthContextProps {
    admin: string | null;
    login: (email: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({
    admin: null,
    login: () => { },
    logout: () => { },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [admin, setAdmin] = useState<string | null>(null);

    const login = (email: string) => {
        setAdmin(email);
    };

    const logout = () => {
        setAdmin(null);
    };

    return (
        <AuthContext.Provider value={{ admin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
export const useAuth = () => {
    return useContext(AuthContext);
};
