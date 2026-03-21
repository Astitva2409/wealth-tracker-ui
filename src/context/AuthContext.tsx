/* eslint-disable react-refresh/only-export-components */
// =============================================================
//  src/context/AuthContext.tsx

import { createContext, useContext, useState, type ReactNode } from 'react';
import { loginApi, signupApi } from '../api/authApi';

export interface AuthUser {
    email: string;
    name: string;
    token: string;
}

interface AuthContextType {
    user: AuthUser | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'wealth_tracker_token';
const USER_KEY = 'wealth_tracker_user';

export function AuthProvider({ children }: { children: ReactNode }) {

    // On refresh — check if user is already logged in
    const [user, setUser] = useState<AuthUser | null>(() => {
        try {
            const saved = localStorage.getItem(USER_KEY);
            return saved ? (JSON.parse(saved) as AuthUser) : null;
        } catch {
            return null;
        }
    });

    // ── Login ─────────────────────────────────────────────────
    // WEEK 3 CHANGE: replaced fake setTimeout with real API call
    const login = async (email: string, password: string): Promise<void> => {
        // loginApi calls POST /api/auth/login
        // If credentials are wrong, backend returns 401
        // Axios throws an error → caught in Login.tsx's try/catch
        const authResponse = await loginApi({ email, password });

        const loggedInUser: AuthUser = {
            email: authResponse.email,
            name: authResponse.name,    // real name from DB now
            token: authResponse.token,
        };

        localStorage.setItem(TOKEN_KEY, authResponse.token);
        localStorage.setItem(USER_KEY, JSON.stringify(loggedInUser));
        setUser(loggedInUser);
    };

    // ── Signup ────────────────────────────────────────────────
    // WEEK 3 CHANGE: replaced fake setTimeout with real API call
    const signup = async (
        name: string,
        email: string,
        password: string
    ): Promise<void> => {
        // signupApi calls POST /api/auth/signup
        // If email already exists, backend returns 409
        // Axios throws → caught in Signup.tsx's try/catch
        const authResponse = await signupApi({ name, email, password });

        const newUser: AuthUser = {
            email: authResponse.email,
            name: authResponse.name,
            token: authResponse.token,
        };

        localStorage.setItem(TOKEN_KEY, authResponse.token);
        localStorage.setItem(USER_KEY, JSON.stringify(newUser));
        setUser(newUser);
    };

    // ── Logout ────────────────────────────────────────────────
    // No change — just clear storage and reset state
    const logout = () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: user !== null,
            login,
            signup,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}