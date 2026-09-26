'use client';

import React from 'react';
import styles from './UpgradeModal.module.css';
import { useUpgradePayment, type PaymentPhase } from '../hooks/useUpgradePayment';

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

function formatTime(totalSeconds: number): string {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN').format(amount);
}

function getTimerClass(secondsLeft: number): string {
    if (secondsLeft <= 60) return `${styles.timer} ${styles.timerDanger}`;
    if (secondsLeft <= 180) return `${styles.timer} ${styles.timerWarning}`;
    return styles.timer;
}

export default function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
    const { phase, payment, error, secondsLeft, initiateUpgrade, reset } = useUpgradePayment();

    if (!isOpen) return null;

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) handleClose();
    };

    return (
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={styles.modal} role="dialog" aria-modal="true">
                {/* Close button */}
                <button
                    className={styles.closeBtn}
                    onClick={handleClose}
                    aria-label="Đóng"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                {/* Header Banner */}
                <div className={styles.headerBanner}>
                    <div className={styles.headerIcon}>✦</div>
                    <h2 className={styles.headerTitle}>Nâng cấp Pro</h2>
                    <p className={styles.headerSubtitle}>Mở khóa toàn bộ tính năng viết lách</p>
                </div>

                {/* Body — render by phase */}
                <div className={styles.body}>
                    {phase === 'idle' && <IdlePhase onUpgrade={initiateUpgrade} />}
                    {phase === 'loading' && <LoadingPhase />}
                    {phase === 'qr' && payment && (
                        <QrPhase payment={payment} secondsLeft={secondsLeft} />
                    )}
                    {phase === 'success' && <SuccessPhase onDone={handleClose} />}
                    {phase === 'expired' && <ExpiredPhase onRetry={() => { reset(); initiateUpgrade(); }} />}
                    {phase === 'error' && <ErrorPhase message={error} onRetry={() => { reset(); initiateUpgrade(); }} onClose={handleClose} />}
                </div>
            </div>
        </div>
    );
}


/* ─── Sub-phases ─────────────────────────────────────────────── */

function IdlePhase({ onUpgrade }: { onUpgrade: () => void }) {
    return (
        <>
            {/* Plan summary */}
            <div className={styles.planSummary}>
                <div>
                    <div className={styles.planName}>Gói Pro</div>
                    <div className={styles.planBadge}>✦ PRO</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <span className={styles.planPrice}>{formatCurrency(1000)}</span>
                    <span className={styles.planPriceCurrency}> VNĐ</span>
                </div>
            </div>

            {/* Feature list */}
            <div className={styles.featureList}>
                <div className={styles.featureItem}>
                    <span className={styles.featureCheck}>✓</span>
                    Không giới hạn số lượng tài liệu
                </div>
                <div className={styles.featureItem}>
                    <span className={styles.featureCheck}>✓</span>
                    Xuất file DOCX, PDF không watermark
                </div>
                <div className={styles.featureItem}>
                    <span className={styles.featureCheck}>✓</span>
                    Thống kê chi tiết quá trình viết
                </div>
                <div className={styles.featureItem}>
                    <span className={styles.featureCheck}>✓</span>
                    Hỗ trợ ưu tiên qua email
                </div>
            </div>

            <button className={styles.upgradeBtn} onClick={onUpgrade}>
                Thanh toán ngay
            </button>
        </>
    );
}

function LoadingPhase() {
    return (
        <div className={styles.successSection}>
            <div className={styles.spinner} />
            <p className={styles.successMessage}>Đang tạo mã thanh toán...</p>
        </div>
    );
}

function QrPhase({ payment, secondsLeft }: { payment: { qrCode: string; transferContent: string; amount: number }; secondsLeft: number }) {
    return (
        <div className={styles.qrSection}>
            {/* QR code */}
            <div className={styles.qrWrapper}>
                <img
                    className={styles.qrImage}
                    src={payment.qrCode}
                    alt="QR thanh toán"
                    draggable={false}
                />
            </div>

            <p className={styles.qrInstructions}>
                Mở ứng dụng ngân hàng và quét mã QR phía trên.<br />
                Nội dung chuyển khoản sẽ được điền tự động.
            </p>

            {/* Transfer content */}
            <div className={styles.transferInfo}>
                <span className={styles.transferLabel}>Nội dung CK</span>
                <span className={styles.transferValue}>{payment.transferContent}</span>
            </div>

            <div className={styles.transferInfo}>
                <span className={styles.transferLabel}>Số tiền</span>
                <span className={styles.transferValue}>{formatCurrency(payment.amount)} VNĐ</span>
            </div>

            {/* Timer */}
            <div className={getTimerClass(secondsLeft)}>
                <span className={styles.timerIcon}>⏱</span>
                Hết hạn sau {formatTime(secondsLeft)}
            </div>

            {/* Waiting indicator */}
            <div className={styles.waitingIndicator}>
                <span className={styles.waitingDot} />
                Đang chờ xác nhận thanh toán...
            </div>
        </div>
    );
}

function SuccessPhase({ onDone }: { onDone: () => void }) {
    return (
        <div className={styles.successSection}>
            <div className={styles.successIcon}>✓</div>
            <h3 className={styles.successTitle}>Thanh toán thành công!</h3>
            <p className={styles.successMessage}>
                Tài khoản của bạn đã được nâng cấp lên gói <strong>Pro</strong>.<br />
                Tất cả tính năng đã được mở khóa.
            </p>
            <button className={styles.doneBtn} onClick={onDone}>
                Tuyệt vời!
            </button>
        </div>
    );
}

function ExpiredPhase({ onRetry }: { onRetry: () => void }) {
    return (
        <div className={styles.expiredSection}>
            <div className={styles.expiredIcon}>⏱</div>
            <h3 className={styles.expiredTitle}>Mã QR đã hết hạn</h3>
            <p className={styles.expiredMessage}>
                Phiên thanh toán đã quá thời gian cho phép.<br />
                Bạn có thể tạo mã mới để tiếp tục.
            </p>
            <button className={styles.retryBtn} onClick={onRetry}>
                Tạo mã mới
            </button>
        </div>
    );
}

function ErrorPhase({ message, onRetry, onClose }: { message: string | null; onRetry: () => void; onClose: () => void }) {
    return (
        <div className={styles.errorSection}>
            <div className={styles.errorIcon}>!</div>
            <h3 className={styles.errorTitle}>Có lỗi xảy ra</h3>
            <p className={styles.errorMessage}>
                {message || 'Không thể tạo thanh toán. Vui lòng thử lại sau.'}
            </p>
            <button className={styles.retryBtn} onClick={onRetry}>
                Thử lại
            </button>
        </div>
    );
}
