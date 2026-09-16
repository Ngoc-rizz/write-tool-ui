'use client';

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';
import { api } from '@/lib/api-client';
import type { CurrentUser } from '@/stores/auth.types';
import { clearAccessToken, getAccessToken, setAccessToken, getCsrfToken } from '@/lib/token';

const VISITOR_USER: CurrentUser = {
    id: 'visitor',
    name: 'Khách',
    email: '',
    role: 'visitor',
    permissions: [],
};

interface AuthContextValue {
    user: CurrentUser | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    setUser: (user: CurrentUser | null) => void;
    login: (token: string, userData: CurrentUser) => void;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUserState] = useState<CurrentUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const setUser = (newUser: CurrentUser | null) => {
        setUserState(newUser);
    };

    const checkSession = useCallback(async () => {
        setIsLoading(true);
        const token = getAccessToken();

        if (!token) {
            setUser(VISITOR_USER);
            setIsLoading(false);
            return;
        }

        try {
            const me = await api.auth.getMe();
            setUser(me as CurrentUser);
        } catch {
            clearAccessToken();
            setUser(VISITOR_USER);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        checkSession();

        const handleUnauthorized = () => {
            setUserState(VISITOR_USER);
            clearAccessToken();
        };

        const handlePageShow = (event: PageTransitionEvent) => {
            if (event.persisted) {
                checkSession();
            }
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                checkSession();
            }
        };

        window.addEventListener('auth:unauthorized', handleUnauthorized);
        window.addEventListener('pageshow', handlePageShow);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            window.removeEventListener('auth:unauthorized', handleUnauthorized);
            window.removeEventListener('pageshow', handlePageShow);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [checkSession]);

    const login = (token: string, userData: CurrentUser) => {
        setAccessToken(token);
        setUser(userData);
    };

    const logout = async () => {
        try {
            const csrfToken = getCsrfToken();
            await api.post(
                '/auth/logout',
                undefined,
                { headers: { 'X-CSRF-Token': csrfToken || '' } },
            );
        } catch {
        } finally {
            clearAccessToken();
            setUser(null);
            window.location.href = '/login';
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user && user.role !== 'visitor',
                setUser,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used within <AuthProvider>');
    }
    return ctx;
}