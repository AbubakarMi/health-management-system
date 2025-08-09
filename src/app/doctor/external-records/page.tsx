
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This page is no longer used by the doctor role.
// It will redirect to the doctor dashboard.
export default function DeprecatedExternalRecordsPage() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/doctor');
    }, [router]);

    return (
        <div>
            <p>Redirecting...</p>
        </div>
    );
}
