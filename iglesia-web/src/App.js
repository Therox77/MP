import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginUser from './Pages/LoginUser';
import RegisterUser from './Pages/RegisterUser';
import Dashboard from './Pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<LoginUser />} />
      <Route path="/register" element={<RegisterUser />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin', 'member']}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  </Router>
);

export default App;
