import { getErrorMessage } from '../utils/error-mapper';
import { getAccessToken, API_BASE_URL, refreshAccessToken, clearAccessToken } from './token';


interface FetchOptions extends RequestInit {
    data?: unknown;
    skipAuth?: boolean;
}

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;
let isRedirecting = false;

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


        let response;
        try {
            response = await fetch(`${API_BASE_URL}${endpoint}`, buildConfig(token));
        } catch (error) {
            throw new Error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại.');
        }

        if (response.status === 401 && !skipAuth) {
            if (!token) {
                throw new Error(getErrorMessage(401, 'Vui lòng đăng nhập để sử dụng tính năng này'));
            }

            if (!isRefreshing) {
                isRefreshing = true;
                refreshPromise = refreshAccessToken().finally(() => {
                    isRefreshing = false;
                });
            }

            try {
                const newToken = await refreshPromise!;
                response = await fetch(`${API_BASE_URL}${endpoint}`, buildConfig(newToken));

                if (response.status === 401) {
                    if (typeof window !== 'undefined') {
                        window.dispatchEvent(new Event('auth:unauthorized'));
                    }
                }
            } catch {
                if (typeof window !== 'undefined' && window.location.pathname !== '/login' && !isRedirecting) {
                    isRedirecting = true;
                    clearAccessToken();
                    window.location.href = '/login';
                    // Reset flag sau khi đã schedule redirect, cho phép redirect lại ở session tiếp theo
                    setTimeout(() => { isRedirecting = false; }, 100);
                }
                throw new Error(getErrorMessage(401, 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại'));
            }
        }

        const resData = await response.json().catch(() => null);
        if (!response.ok) {
            const rawMessage = resData?.message || resData?.error;
            throw new Error(getErrorMessage(response.status, rawMessage));
        }

        if (resData && typeof resData === 'object' && 'success' in resData && 'data' in resData) {
            return resData.data.data as T;
        }

        return resData.data as T;
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