import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error cerrando sesión:', error.message);
  }
};
