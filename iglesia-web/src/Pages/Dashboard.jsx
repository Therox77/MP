import React, { useEffect, useState } from 'react';
import { fetchUserRole } from '../services/usersService';

const Dashboard = () => {
  const [role, setRole] = useState(null);

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
    <div>
      <h2>Dashboard</h2>
      {role === 'admin' ? (
        <p>Bienvenido Administrador</p>
      ) : (
        <p>Bienvenido Miembro</p>
      )}
    </div>
  );
};

export default Dashboard;
