import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// If Supabase env vars are not configured, create a harmless dummy client so the
// site can still build and render. Features that depend on Supabase will just
// behave as if there is no data.
function createSafeSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    const notConfiguredError = new Error('Supabase is not configured (missing URL or anon key).');

    const dummy = {
      from() {
        return {
          async select() {
            return { data: [], error: notConfiguredError };
          },
          async insert() {
            return { data: null, error: notConfiguredError };
          },
          async update() {
            return { data: null, error: notConfiguredError };
          },
          async delete() {
            return { data: null, error: notConfiguredError };
          },
        };
      },
      auth: {
        async getUser() {
          return { data: { user: null }, error: null };
        },
      },
    } as any;

    return dummy;
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = createSafeSupabaseClient();
