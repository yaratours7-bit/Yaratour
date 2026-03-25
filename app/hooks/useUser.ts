'use client';

import { createClient } from '@/lib/supabase/client';
import { useQuery } from '@tanstack/react-query';

export function useUser() {
  const supabase = createClient();

  const { data, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, first_name, last_name, phone, avatar_url')
          .eq('id', user.id)
          .single();
        return { ...user, ...profile };
      }
      return null;
    },
  });

  return { user: data, isLoading };
}
