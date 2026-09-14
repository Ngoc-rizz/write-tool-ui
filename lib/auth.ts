import { api, setAccessToken, clearAccessToken, getCsrfToken } from './api-client';

interface LoginResponse {
    accessToken: string;
    csrfToken: string;
    user: {
        id: string;
        email: string;
        name: string;
        planType: string;
    };
}


export async function login(email: string, password: string) {
    const result = await api.post<LoginResponse>(
        '/auth/login',
        { email, password },
        { skipAuth: true },
    );

    setAccessToken(result.accessToken);
    return result.user;
}

export async function logout() {
    const csrfToken = getCsrfToken();

    await api.post(
        '/auth/logout',
        undefined,
        { headers: { 'X-CSRF-Token': csrfToken || '' } },
    );

    clearAccessToken();
    window.location.href = '/login';
}