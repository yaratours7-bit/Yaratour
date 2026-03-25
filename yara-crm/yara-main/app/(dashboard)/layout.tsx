'use client';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import CallToast from '../components/CallToast';
import { useCall } from '../hooks/useCall';
import { useEffect } from 'react';

import { useUser } from '../hooks/useUser';
import { Toaster } from 'sonner';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { initTwilio } = useCall();
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (user) {
      initTwilio();
    }
  }, [user, initTwilio]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth');
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar user={user} />
      <main className="flex-1 p-8 bg-gray-100 overflow-y-auto">
        {children}
      </main>
      <CallToast />
      <Toaster />
    </div>
  );
}
