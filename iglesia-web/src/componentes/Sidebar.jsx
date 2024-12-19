import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => (
  <nav style={{ width: '200px', backgroundColor: '#f0f0f0', padding: '10px' }}>
    <ul>
      <li><Link to="/">Inicio</Link></li>
      <li><Link to="/dashboard">Dashboard</Link></li>
      <li><Link to="/register">Registrar Usuario</Link></li>
    </ul>
  </nav>
);

export default Sidebar;
