import React, { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners'; // Spinner
import MembersTable from '../components/MembersTable'; // Tabla de miembros
import { fetchUserRole } from '../services/usersService';
import { supabase } from '../services/supabaseClient';

const Dashboard = () => {
  const [members, setMembers] = useState([]);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch members from Supabase
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const { data, error } = await supabase.from('profiles').select('id, nombre, correo, rol');
        if (error) console.error('Error fetching members:', error);
        else setMembers(data);
      } catch (error) {
        console.error('Error fetching members:', error);
      }
      setLoading(false); // Una vez se cargan los miembros, deja de cargar
    };
    fetchMembers();
  }, []);

  // Fetch user role from Supabase
  useEffect(() => {
    const getRole = async () => {
      try {
        const userId = supabase.auth.user()?.id;
        const userRole = await fetchUserRole(userId);
        setRole(userRole);
      } catch (error) {
        console.error('Error fetching role:', error);
      }
      setLoading(false); // Una vez se obtiene el rol, deja de cargar
    };
    getRole();
  }, []);

  // Mientras se cargan los datos, mostramos el spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#36d7b7" size={50} />
      </div>
    );
  }

  return (
    <div className="ml-64 p-5">
      <h2 className="text-3xl font-bold mb-4">Dashboard</h2>

      {/* Mostrar diferentes tarjetas dependiendo del rol del usuario */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {role === 'admin' && (
          <div className="bg-blue-500 text-white p-4 rounded shadow-md">
            <h3 className="text-xl font-bold">Miembros</h3>
            <p>Gestión y estadísticas de miembros.</p>
          </div>
        )}
        {role === 'admin' && (
          <div className="bg-green-500 text-white p-4 rounded shadow-md">
            <h3 className="text-xl font-bold">Eventos</h3>
            <p>Calendario de actividades.</p>
          </div>
        )}
        {role === 'admin' && (
          <div className="bg-yellow-500 text-white p-4 rounded shadow-md">
            <h3 className="text-xl font-bold">Finanzas</h3>
            <p>Reporte de ingresos y egresos.</p>
          </div>
        )}
        {role === 'user' && (
          <div className="bg-red-500 text-white p-4 rounded shadow-md">
            <h3 className="text-xl font-bold">Soporte</h3>
            <p>Ayuda y contacto.</p>
          </div>
        )}
      </div>

      {/* Mostrar la tabla de miembros solo si el rol es 'admin' */}
      {role === 'admin' && (
        <div>
          <h3 className="text-2xl font-bold mb-4">Lista de Miembros</h3>
          <MembersTable members={members} />
        </div>
      )}

      {/* Si el rol es 'user', mostrar contenido diferente */}
      {role === 'user' && (
        <div>
          <h3 className="text-2xl font-bold mb-4">Bienvenido, Usuario</h3>
          <p>Este es tu panel de usuario. No tienes acceso a la gestión de miembros.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
