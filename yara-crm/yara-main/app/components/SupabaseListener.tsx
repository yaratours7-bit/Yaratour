'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Session } from '@supabase/supabase-js';

export default function SupabaseListener({
  accessToken,
}: {
  accessToken?: string;
}) {
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event: string, session: Session | null) => {
      if (session?.access_token !== accessToken) {
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [accessToken, router, supabase]);

  return null;
}
