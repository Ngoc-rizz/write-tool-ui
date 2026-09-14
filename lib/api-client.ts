const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

interface FetchOptions extends RequestInit {
    data?: unknown;
    skipAuth?: boolean;
}

function getAccessToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('accessToken')
}

function setAccessToken(token: string) {
    localStorage.setItem('accessToken', token);
}

function clearAccessToken() {
    localStorage.removeItem('accessToken');
}

function getCsrfToken(): string | null {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(/(?:^|;\s*)csrfToken=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : null;
}

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
    const csrfToken = getCsrfToken();

    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'X-CSRF-Token': csrfToken || '',
        },
    });

    if (!res.ok) {
        clearAccessToken();
        if (typeof window !== 'undefined') window.location.href = '/login';
        throw new Error('Refresh token hết hạn, vui lòng đăng nhập lại');
    }

    const result = await res.json();
    setAccessToken(result.accessToken);
    return result.accessToken;
}

export const api = {
    async request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
        const { data, headers, skipAuth, ...customConfig } = options;
        const token = skipAuth ? null : getAccessToken();

        const buildConfig = (authToken: string | null): RequestInit => ({
            ...customConfig,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...(authToken && { Authorization: `Bearer ${authToken}` }),
                ...(headers || {}),
            },
            ...(data !== undefined && { body: JSON.stringify(data) }),
        });

        let response = await fetch(`${API_BASE_URL}${endpoint}`, buildConfig(token));

        if (response.status === 401 && !skipAuth) {
            if (!isRefreshing) {
                isRefreshing = true;
                refreshPromise = refreshAccessToken().finally(() => {
                    isRefreshing = false;
                });
            }

            try {
                const newToken = await refreshPromise!;
                response = await fetch(`${API_BASE_URL}${endpoint}`, buildConfig(newToken));
            } catch {
                throw new Error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
            }
        }

        const resData = await response.json().catch(() => null);

        if (!response.ok) {
            const errorMessage = resData?.message || resData?.error || `Lỗi ${response.status}`;
            throw new Error(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage);
        }

        return resData as T;
    },
    get: <T>(endpoint: string, options?: Omit<FetchOptions, 'method'>) =>
        api.request<T>(endpoint, { ...options, method: 'GET' }),

    post: <T>(
        endpoint: string,
        data: unknown,
        options?: Omit<FetchOptions, 'method' | 'body'>
    ) => api.request<T>(endpoint, { ...options, method: 'POST', data }),

    patch: <T>(
        endpoint: string,
        data: unknown,
        options?: Omit<FetchOptions, 'method' | 'body'>
    ) => api.request<T>(endpoint, { ...options, method: 'PATCH', data }),

    put: <T>(
        endpoint: string,
        data: unknown,
        options?: Omit<FetchOptions, 'method' | 'body'>
    ) => api.request<T>(endpoint, { ...options, method: 'PUT', data }),

    delete: <T>(endpoint: string, options?: Omit<FetchOptions, 'method'>) =>
        api.request<T>(endpoint, { ...options, method: 'DELETE' }),

    auth: {
        login: (data: unknown) => api.post<any>('/auth/login', data, { skipAuth: true }),
        register: (data: unknown) => api.post<any>('/auth/register', data, { skipAuth: true }),
        verifyEmail: (data: { email: string; token: string }) =>
            api.post<any>('/auth/verify-email', data, { skipAuth: true }),
        resendVerification: (data: { email: string }) =>
            api.post<any>('/auth/resend-verification', data, { skipAuth: true }),
        logout: () => api.request('/auth/logout'),
        getMe: () => api.request('/auth/me'),
        forgotPassword: (data: unknown) =>
            api.post<any>('/auth/forgot-password', data, { skipAuth: true }),
        resetPassword: (data: { email: string; token: string; newPassword: string }) =>
            api.post<any>('/auth/reset-password', data, { skipAuth: true }),
    },
};

export { setAccessToken, clearAccessToken, getAccessToken, getCsrfToken };