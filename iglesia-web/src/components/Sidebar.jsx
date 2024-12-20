import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => (
  <aside className="bg-gray-800 text-white w-60 h-screen fixed top-16">
    <nav className="p-4">
      <ul className="space-y-4">
        <li>
          <Link to="/dashboard" className="hover:text-blue-400">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/miembros" className="hover:text-blue-400">
            Miembros
          </Link>
        </li>
        <li>
          <Link to="/eventos" className="hover:text-blue-400">
            Eventos
          </Link>
        </li>
        <li>
          <Link to="/soporte" className="hover:text-blue-400">
            Soporte
          </Link>
        </li>
      </ul>
    </nav>
  </aside>
);

export default Sidebar;
