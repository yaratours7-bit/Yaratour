import { createBrowserClient } from '@supabase/ssr';

// Create a Supabase client in the browser. If environment variables are not
// configured (for example, in a demo or incomplete hosted environment), we
// fall back to a harmless "dummy" client so the app can still build and
// render without crashing. Actual CRM features that depend on Supabase will
// simply no-op or report that Supabase is not configured.
export const createClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    const notConfiguredError = new Error('Supabase is not configured (missing URL or anon key).');

    const dummy = {
      auth: {
        async signInWithPassword() {
          return { data: null, error: notConfiguredError };
        },
        async signUp() {
          return { data: null, error: notConfiguredError };
        },
        async getUser() {
          return { data: { user: null }, error: null };
        },
        async signOut() {
          return { error: null };
        },
      },
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
      storage: {
        from() {
          return {
            async upload() {
              return { data: null, error: notConfiguredError };
            },
            getPublicUrl() {
              return { data: { publicUrl: '' }, error: null };
            },
          };
        },
      },
    } as any;

    return dummy;
  }

  return createBrowserClient(url, key);
};
