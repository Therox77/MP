import React, { useEffect, useState } from 'react';
import { fetchMembersByArea } from '../services/membersService';

const MembersTable = () => {
  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [areas, setAreas] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchMembersByArea();
      setMembers(data);

      // Filtrar áreas únicas para el dropdown
      const uniqueAreas = [...new Set(data.map((row) => row.nombre_area))];
      setAreas(uniqueAreas);

      setFilteredMembers(data);
      setLoading(false);
    };

    fetchData();
  }, []);

  // Filtrar miembros dinámicamente por búsqueda o área seleccionada
  useEffect(() => {
    let filtered = members;

    if (searchQuery) {
      filtered = filtered.filter((member) =>
        member.nombre_miembro.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedArea) {
      filtered = filtered.filter((member) => member.nombre_area === selectedArea);
    }

    setFilteredMembers(filtered);
  }, [searchQuery, selectedArea, members]);

  if (loading) {
    return <p>Cargando datos...</p>;
  }

  return (
    <div className="p-5 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Miembros y Áreas</h2>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full md:w-1/3"
        />

        <select
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full md:w-1/3"
        >
          <option value="">Todas las Áreas</option>
          {areas.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b">Nombre del Miembro</th>
              <th className="py-2 px-4 border-b">Correo</th>
              <th className="py-2 px-4 border-b">Área</th>
              <th className="py-2 px-4 border-b">Descripción del Área</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((row) => (
              <tr key={row.relacion_id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{row.nombre_miembro}</td>
                <td className="py-2 px-4 border-b">{row.correo_miembro}</td>
                <td className="py-2 px-4 border-b">{row.nombre_area}</td>
                <td className="py-2 px-4 border-b">{row.descripcion_area}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MembersTable;
