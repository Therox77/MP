export const updateMemberDetails = async (table, memberData) => {
  try {
    const { id, ...updateData } = memberData; // Extrae el ID y los datos a actualizar

    // Validación básica para asegurar que hay datos que actualizar
    if (!id || Object.keys(updateData).length === 0) {
      throw new Error('No se proporcionaron datos válidos para la actualización.');
    }

    // Actualiza los datos en la base de datos
    const { error } = await supabase
      .from(table) // Nombre dinámico de la tabla
      .update(updateData) // Datos a actualizar
      .eq('id', id); // Filtra por ID del miembro

    if (error) {
      throw new Error(`Error al actualizar datos en la tabla ${table}: ${error.message}`);
    }

    return { success: true, message: 'Miembro actualizado correctamente.' };
  } catch (error) {
    console.error('Error al actualizar los datos del miembro:', error.message);
    return { success: false, message: error.message || 'Error inesperado al actualizar los datos.' };
  }
};
