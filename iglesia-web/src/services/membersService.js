import { supabase } from './supabaseClient';

export const fetchMembersByArea = async () => {
  const { data, error } = await supabase.rpc('execute_sql', {
    sql: `
      SELECT 
        ma.id AS relacion_id,
        m.id AS miembro_id,
        m.nombre AS nombre_miembro,
        m.correo AS correo_miembro,
        a.nombre AS nombre_area,
        a.descripcion AS descripcion_area
      FROM 
        iglesia.miembros_areas ma
      JOIN 
        iglesia.miembros m ON ma.miembro_id = m.id
      JOIN 
        iglesia.areas a ON ma.area_id = a.id
      ORDER BY 
        a.nombre, m.nombre;
    `
  });

  if (error) {
    console.error('Error fetching members by area:', error.message);
    return [];
  }

  return data;
};
