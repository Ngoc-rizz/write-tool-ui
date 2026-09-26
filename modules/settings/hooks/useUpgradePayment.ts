'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { api } from '@/lib/api-client';

export type PaymentPhase = 'idle' | 'loading' | 'qr' | 'success' | 'expired' | 'error';

interface PaymentData {
    id: string;
    qrCode: string;
    transferContent: string;
    amount: number;
    expiredAt: string;
}

interface UseUpgradePaymentReturn {
    phase: PaymentPhase;
    payment: PaymentData | null;
    error: string | null;
    secondsLeft: number;
    initiateUpgrade: () => void;
    reset: () => void;
}

const PAYMENT_DURATION_SEC = 15 * 60; // 15 minutes

function generateIdempotencyKey(): string {
    const ts = Date.now().toString(36);
    const rand = Math.random().toString(36).substring(2, 10);
    return `idem_${ts}_${rand}`;
}

export function useUpgradePayment(): UseUpgradePaymentReturn {
    const [phase, setPhase] = useState<PaymentPhase>('idle');
    const [payment, setPayment] = useState<PaymentData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [secondsLeft, setSecondsLeft] = useState(PAYMENT_DURATION_SEC);

    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const isRequestingRef = useRef(false);

    // Cleanup all intervals
    const clearTimers = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        if (pollRef.current) {
            clearInterval(pollRef.current);
            pollRef.current = null;
        }
    }, []);

    // Start countdown from expiredAt
    const startCountdown = useCallback((expiredAt: string) => {
        const expMs = new Date(expiredAt).getTime();

        const tick = () => {
            const now = Date.now();
            const remaining = Math.max(0, Math.floor((expMs - now) / 1000));
            setSecondsLeft(remaining);

            if (remaining <= 0) {
                setPhase('expired');
                clearTimers();
            }
        };

        tick(); // immediate first tick
        timerRef.current = setInterval(tick, 1000);
    }, [clearTimers]);

    // Poll payment status every 5s
    const startPolling = useCallback((paymentId: string) => {
        pollRef.current = setInterval(async () => {
            try {
                const res = await api.get<any>(`/payments/${paymentId}`);
                if (res?.status === 'SUCCESS') {
                    setPhase('success');
                    clearTimers();
                }
            } catch {
                // Silently ignore polling errors
            }
        }, 5000);
    }, [clearTimers]);

    // Main action — create payment
    const initiateUpgrade = useCallback(async () => {
        // Anti double-click guard
        if (isRequestingRef.current) return;
        isRequestingRef.current = true;

        setPhase('loading');
        setError(null);

        try {
            const result = await api.post<PaymentData>('/payments', {
                planType: 'PRO',
                idempotencyKey: generateIdempotencyKey(),
            });

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

    // Reset to initial state
    const reset = useCallback(() => {
        clearTimers();
        setPhase('idle');
        setPayment(null);
        setError(null);
        setSecondsLeft(PAYMENT_DURATION_SEC);
        isRequestingRef.current = false;
    }, [clearTimers]);

    // Cleanup on unmount
    useEffect(() => {
        return () => clearTimers();
    }, [clearTimers]);

    return { phase, payment, error, secondsLeft, initiateUpgrade, reset };
}
