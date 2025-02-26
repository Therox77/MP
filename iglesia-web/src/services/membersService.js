import { supabase } from './supabaseClient';

/**
 * Obtiene las áreas disponibles desde la tabla `areas`.
 */
export const fetchAreas = async () => {
  try {
    const { data, error } = await supabase
      .from('areas') // Nombre de la tabla
      .select('nombre'); // Selecciona solo la columna `nombre`

    if (error) {
      console.error(`Error al obtener áreas: ${error.message}`);
      return { success: false, data: [] };
    }

    return {
      success: true,
      data: data?.map((area) => area.nombre) || [],
    };
  } catch (error) {
    console.error('Error inesperado en fetchAreas:', error.message);
    return { success: false, data: [] };
  }
};

/**
 * Obtiene miembros de una tabla específica con soporte de paginación.
 * @param {string} table - Nombre de la tabla.
 * @param {number} page - Página actual.
 * @param {number} limit - Cantidad de resultados por página.
 */
export const fetchMembersFromTable = async (table, page = 1, limit = 10) => {
  const validTables = [
    'equipo',
    'liderazgo',
    'miembros',
    'nuevos',
    'teens',
    'transicion',
    'kids', // Asegura que la tabla `kids` esté incluida.
  ];

  if (!table || !validTables.includes(table)) {
    console.error('Error: Tabla no válida o no especificada.');
    return { success: false, data: [], total: 0 };
  }

  const offset = (page - 1) * limit;

  try {
    const { data, error, count } = await supabase
      .from(table)
      .select('*', { count: 'exact' }) // Selecciona todas las columnas y cuenta resultados.
      .range(offset, offset + limit - 1);

    if (error) {
      console.error(`Error al obtener datos de la tabla ${table}: ${error.message}`);
      return { success: false, data: [], total: 0 };
    }

    return {
      success: true,
      data: data || [],
      total: count || 0,
    };
  } catch (error) {
    console.error('Error inesperado en fetchMembersFromTable:', error.message);
    return { success: false, data: [], total: 0 };
  }
};

/**
 * Obtiene los detalles de un miembro específico por ID.
 * @param {string} table - Nombre de la tabla.
 * @param {number} memberId - ID del miembro.
 */
export const fetchMemberDetails = async (table, memberId) => {
  const validTables = [
    'equipo',
    'liderazgo',
    'miembros',
    'nuevos',
    'teens',
    'transicion',
    'kids', // Incluye `kids` para validación.
  ];

  if (!table || !validTables.includes(table) || !memberId) {
    console.error('Error: Parámetros inválidos para obtener detalles del miembro.');
    return { success: false, data: null };
  }

  try {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', memberId)
      .single();

    if (error) {
      console.error(`Error al obtener detalles del miembro ${memberId}: ${error.message}`);
      return { success: false, data: null };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error inesperado en fetchMemberDetails:', error.message);
    return { success: false, data: null };
  }
};

/**
 * Actualiza los detalles de un miembro.
 * @param {string} table - Nombre de la tabla.
 * @param {object} memberData - Datos del miembro a actualizar.
 */
export const updateMemberDetails = async (table, memberData) => {
  const validTables = [
    'equipo',
    'liderazgo',
    'miembros',
    'nuevos',
    'teens',
    'transicion',
    'kids', // Valida el uso de la tabla `kids`.
  ];

  if (!table || !validTables.includes(table) || !memberData || !memberData.id) {
    console.error('Error: Parámetros inválidos para actualizar miembro.');
    return { success: false, message: 'Datos insuficientes para la actualización.' };
  }

  const { id, ...updateData } = memberData;

  if (Object.keys(updateData).length === 0) {
    console.error('Error: No hay datos para actualizar.');
    return { success: false, message: 'No hay datos para actualizar.' };
  }

  try {
    const { error } = await supabase
      .from(table)
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error(`Error al actualizar miembro ${id}: ${error.message}`);
      return { success: false, message: `Error al actualizar: ${error.message}` };
    }

    return { success: true };
  } catch (error) {
    console.error('Error inesperado en updateMemberDetails:', error.message);
    return { success: false, message: 'Error inesperado en la actualización.' };
  }
};
