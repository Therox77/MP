import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginUser from './Pages/LoginUser';
import RegisterUser from './Pages/RegisterUser';
import Dashboard from './Pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import MembersTable from './components/MembersTable';
import Listado from './components/Listado'; // Asegúrate de importar el componente Listado

const App = () => (
  <Router>
    <Routes>
      {/* Ruta para Login */}
      <Route path="/" element={<LoginUser />} />

      {/* Ruta para Registro */}
      <Route path="/register" element={<RegisterUser />} />

      {/* Ruta para Dashboard protegida */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin', 'member']}>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Ruta para Miembros protegida */}
      <Route
        path="/miembros"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <MembersTable />
          </ProtectedRoute>
        }
      />

      {/* Ruta para Listado */}
      <Route path="/listado" element={<Listado />} />
    </Routes>
  </Router>
);

export default App;