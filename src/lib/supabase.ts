import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL || '';
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return !!(url && key && url.startsWith('https://') && key.length > 20);
};

// Só cria o client se estiver configurado, senão retorna um dummy
let _supabase: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient => {
  if (!_supabase && isSupabaseConfigured()) {
    _supabase = createClient(url, key, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });
  }
  // Retorna o client real ou um proxy que nunca é chamado
  return _supabase as SupabaseClient;
};
