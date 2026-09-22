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

import {
    clearAccessToken,
    getAccessToken,
    setAccessToken,
    getCsrfToken,
} from '@/lib/token';

const VISITOR_USER: CurrentUser = {
    id: 'visitor',
    name: 'Guest',
    email: '',
    role: 'visitor',
    permissions: [],
};

interface AuthContextValue {
    user: CurrentUser | null;
    isLoading: boolean;
    isAuthenticated: boolean;

    setUser: (user: CurrentUser | null) => void;

    login: (
        token: string,
        userData: CurrentUser,
    ) => void;

    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [user, setUserState] = useState<CurrentUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const setUser = useCallback(
        (newUser: CurrentUser | null) => {
            setUserState(newUser);
        },
        [],
    );

    const checkSession = useCallback(async () => {
        setIsLoading(true);

        const token = getAccessToken();

        if (!token) {
            setUserState(VISITOR_USER);
            setIsLoading(false);
            return;
        }

        try {
            const me = await api.auth.getMe();

            setUserState(me as CurrentUser);
        } catch (error: any) {
            const message =
                error?.message?.toLowerCase() ?? '';

            const isAuthError =
                message.includes('hết hạn') ||
                message.includes('đăng nhập') ||
                message.includes('unauthorized') ||
                message.includes('401');

            if (isAuthError) {
                clearAccessToken();
                setUserState(VISITOR_USER);
            } else {
                console.warn(
                    'Unable to verify authentication session.',
                    error,
                );

                setUserState(
                    (prev) => prev ?? VISITOR_USER,
                );
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        checkSession();

        const handleUnauthorized = () => {
            clearAccessToken();
            setUserState(VISITOR_USER);
        };

        window.addEventListener(
            'auth:unauthorized',
            handleUnauthorized,
        );

        return () => {
            window.removeEventListener(
                'auth:unauthorized',
                handleUnauthorized,
            );
        };
    }, [checkSession]);

    const login = useCallback(
        (
            token: string,
            userData: CurrentUser,
        ) => {
            setAccessToken(token);
            setUserState(userData);
        },
        [],
    );

    const logout = useCallback(async () => {
        try {
            const csrfToken = getCsrfToken();

            await api.post(
                '/auth/logout',
                undefined,
                {
                    headers: {
                        'X-CSRF-Token': csrfToken || '',
                    },
                },
            );
        } catch (error) {
            console.warn(
                'Logout request failed:',
                error,
            );
        } finally {
            clearAccessToken();
            setUserState(VISITOR_USER);

            window.location.href = '/login';
        }
    }, []);

    const value: AuthContextValue = {
        user,
        isLoading,
        isAuthenticated:
            !!user && user.role !== 'visitor',
        setUser,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);

    if (!ctx) {
        throw new Error(
            'useAuth must be used within <AuthProvider>',
        );
    }

    return ctx;
}