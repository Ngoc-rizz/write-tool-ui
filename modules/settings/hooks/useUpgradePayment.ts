'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { api } from '@/lib/api-client';
import { useAuth } from '@/stores/AuthProvider';

export type PaymentPhase = 'idle' | 'loading' | 'qr' | 'success' | 'expired' | 'error';

interface PaymentData {
    id: string;
    qrCode: string;
    transferContent: string;
    amount: number;
    expiredAt: string;
    status: string;
}

const PAYMENT_DURATION_SEC = 15 * 60;
const IDEM_KEY = 'upgrade_idem';
const DEAD = ['EXPIRED', 'CANCELLED', 'FAILED'];

function getIdempotencyKey(): string {
    const k = sessionStorage.getItem(IDEM_KEY) ?? crypto.randomUUID();
    sessionStorage.setItem(IDEM_KEY, k);
    return k;
}

export function useUpgradePayment() {
    const { setUser } = useAuth();
    const [phase, setPhase] = useState<PaymentPhase>('idle');
    const [payment, setPayment] = useState<PaymentData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [secondsLeft, setSecondsLeft] = useState(PAYMENT_DURATION_SEC);

    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const isRequestingRef = useRef(false);

    const clearTimers = useCallback(() => {
        if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
        if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
    }, []);

    const startCountdown = useCallback((expiredAt: string) => {
        const expMs = new Date(expiredAt).getTime();
        const tick = () => {
            const remaining = Math.max(0, Math.floor((expMs - Date.now()) / 1000));
            setSecondsLeft(remaining);
            if (remaining <= 0) {
                sessionStorage.removeItem(IDEM_KEY);
                setPhase('expired');
                clearTimers();
            }
        };
        tick();
        timerRef.current = setInterval(tick, 1000);
    }, [clearTimers]);

    const startPolling = useCallback((paymentId: string) => {
        if (pollRef.current) {
            clearInterval(pollRef.current);
        }
        pollRef.current = setInterval(async () => {
            try {
                const p = await api.get<PaymentData>(`/payments/${paymentId}`);

                if (p.status === 'SUCCESS') {
                    clearTimers();
                    sessionStorage.removeItem(IDEM_KEY);
                    try {
                        const me = await api.auth.getMe();
                        setUser(me as any); // badge chuyển sang Pro ngay
                    } catch { /* bỏ qua */ }
                    setPhase('success');
                } else if (p.status === 'EXPIRED') {
                    clearTimers();
                    sessionStorage.removeItem(IDEM_KEY);
                    setPhase('expired');
                } else if (p.status === 'FAILED' || p.status === 'CANCELLED') {
                    clearTimers();
                    sessionStorage.removeItem(IDEM_KEY);
                    setError('Giao dịch không thành công.');
                    setPhase('error');
                }
            } catch { /* lỗi mạng thoáng qua, thử lại lần sau */ }
        }, 2000);
    }, [clearTimers, setUser]);

    const initiateUpgrade = useCallback(async () => {
        if (isRequestingRef.current) return;
        isRequestingRef.current = true;

        setPhase('loading');
        setError(null);

        try {
            let result = await api.post<PaymentData>('/payments', {
                planType: 'PRO',
                idempotencyKey: getIdempotencyKey(),
            });

            // Key cũ trỏ tới payment đã chết → bỏ key, tạo lại 1 lần
            if (DEAD.includes(result.status)) {
                sessionStorage.removeItem(IDEM_KEY);
                result = await api.post<PaymentData>('/payments', {
                    planType: 'PRO',
                    idempotencyKey: getIdempotencyKey(),
                });
            }

            setPayment(result);
            setPhase('qr');
            startCountdown(result.expiredAt);
            startPolling(result.id);
        } catch (err: any) {
            setError(err.message || 'Không thể tạo thanh toán. Vui lòng thử lại.');
            setPhase('error');
        } finally {
            isRequestingRef.current = false;
        }
    }, [startCountdown, startPolling]);

    const reset = useCallback(() => {
        clearTimers();
        setPhase('idle');
        setPayment(null);
        setError(null);
        setSecondsLeft(PAYMENT_DURATION_SEC);
        isRequestingRef.current = false;
    }, [clearTimers]);

    useEffect(() => () => clearTimers(), [clearTimers]);

    return { phase, payment, error, secondsLeft, initiateUpgrade, reset };
}