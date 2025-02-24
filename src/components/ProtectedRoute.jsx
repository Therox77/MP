import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error obteniendo usuario:', error);
      } else {
        setUser(data?.user);
      }
    };

    fetchUser();
  }, []);

  if (user === null) {
    return <div>Cargando...</div>; // Mostrar un estado de carga mientras obtenemos el usuario
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
