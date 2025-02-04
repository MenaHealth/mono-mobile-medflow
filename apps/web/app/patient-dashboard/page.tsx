"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import DashboardView from '@/components/PatientDashboard/DashboardView';
import StackedLoader from '../../components/ui/StackedLoader';

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (status === 'authenticated' && session?.user?.accountType) {
            const timer = setTimeout(() => setIsLoading(false), 500);
            return () => clearTimeout(timer);
        }
    }, [status, session?.user?.accountType]);

    if (status === "loading" || isLoading) {
        return (
            <div className="fixed inset-0 flex flex-col items-center justify-center">
                <StackedLoader />
            </div>
        );
    }

    if (status === "unauthenticated") {
        return <div>Access Denied</div>;
    }

    if (!session?.user?.accountType) {
        return <div>Error: User account type not available</div>;
    }

    return (
        <div className="w-full h-screen mt-12">
            <DashboardView session={session} />
        </div>
    );
}

