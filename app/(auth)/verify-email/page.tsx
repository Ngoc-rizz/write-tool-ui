import { Suspense } from 'react';
import { VerifyEmailForm } from '@/modules/auth';

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <VerifyEmailForm />
    </Suspense>
  );
}
