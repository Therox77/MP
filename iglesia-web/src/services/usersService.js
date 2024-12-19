import { supabase } from './supabaseClient';

export const fetchUserRole = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data.role;
};
