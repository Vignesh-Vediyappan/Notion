import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error);
  return {
    error: error.message || 'An unexpected error occurred',
    success: false,
  };
};

// Helper function to create success response
export const createSuccessResponse = <T>(data: T) => ({
  data,
  error: null,
  success: true,
});

// Database service functions
export const db = {
  // Pages
  pages: {
    async getAll(userId: string) {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },

    async getById(id: string) {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },

    async create(page: Partial<Database['public']['Tables']['pages']['Insert']>) {
      const { data, error } = await supabase
        .from('pages')
        .insert(page)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async update(id: string, updates: Partial<Database['public']['Tables']['pages']['Update']>) {
      const { data, error } = await supabase
        .from('pages')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async delete(id: string) {
      const { error } = await supabase
        .from('pages')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
  },
}; 