import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/supabaseClient';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout(); // Cierra sesión
    navigate('/'); // Redirige a la página de inicio de sesión
  };

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md fixed w-full top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">CAF Church</h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <button onClick={handleLogout} className="hover:underline">
                Cerrar Sesión
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
