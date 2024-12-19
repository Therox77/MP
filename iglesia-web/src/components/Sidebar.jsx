import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => (
  <nav className="bg-gray-800 text-white w-60 h-screen p-5 fixed">
    <ul className="space-y-4">
      <li>
        <Link to="/" className="hover:text-blue-400">Inicio</Link>
      </li>
      <li>
        <Link to="/dashboard" className="hover:text-blue-400">Dashboard</Link>
      </li>
      <li>
        <Link to="/register" className="hover:text-blue-400">Registrar Usuario</Link>
      </li>
    </ul>
  </nav>
);

export default Sidebar;
