export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export function getAccessToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('accessToken')
}

export function setAccessToken(token: string) {
    localStorage.setItem('accessToken', token);
}

export function clearAccessToken() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('u');
}



export function getCsrfToken(): string | null {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(/(?:^|;\s*)csrfToken=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : null;
}

export async function refreshAccessToken(): Promise<string> {
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
        throw new Error('Refresh token hết hạn');
    }

    const result = await res.json();
    setAccessToken(result.accessToken);
    return result.accessToken;
}
