import React, { useEffect, useState } from 'react';
import MembersTable from '../components/MembersTable';
import { fetchUserRole } from '../services/usersService';
import { supabase } from '../services/supabaseClient';

const Dashboard = () => {
  const [members, setMembers] = useState([]);
  const [role, setRole] = useState(null);

  // Fetch members
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const { data, error } = await supabase.from('profiles').select('id, nombre, correo, rol');
        if (error) console.error('Error fetching members:', error);
        else setMembers(data);
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };
    fetchMembers();
  }, []);

  // Fetch user role
  useEffect(() => {
    const getRole = async () => {
      try {
        const userId = supabase.auth.user()?.id;
        const userRole = await fetchUserRole(userId);
        setRole(userRole);
      } catch (error) {
        console.error('Error fetching role:', error);
      }
    };
    getRole();
  }, []);

  if (!role) return <p>Cargando...</p>;

  return (
    <div className="ml-64 p-5">
      <h2 className="text-3xl font-bold mb-4">Dashboard</h2>

      {/* Tarjetas Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-500 text-white p-4 rounded shadow-md">
          <h3 className="text-xl font-bold">Miembros</h3>
          <p>Gestión y estadísticas de miembros.</p>
        </div>
        <div className="bg-green-500 text-white p-4 rounded shadow-md">
          <h3 className="text-xl font-bold">Eventos</h3>
          <p>Calendario de actividades.</p>
        </div>
        <div className="bg-yellow-500 text-white p-4 rounded shadow-md">
          <h3 className="text-xl font-bold">Finanzas</h3>
          <p>Reporte de ingresos y egresos.</p>
        </div>
        <div className="bg-red-500 text-white p-4 rounded shadow-md">
          <h3 className="text-xl font-bold">Soporte</h3>
          <p>Ayuda y contacto.</p>
        </div>
      </div>

      {/* Tabla de Miembros */}
      <div>
        <h3 className="text-2xl font-bold mb-4">Lista de Miembros</h3>
        <MembersTable members={members} />
      </div>
    </div>
  );
};

export default Dashboard;
