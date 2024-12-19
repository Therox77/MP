import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import LoginUser from './pages/LoginUser';
import RegisterUser from './pages/RegisterUser';

const App = () => (
  <Router>
    <Header />
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ margin: '20px', flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<LoginUser />} />
          <Route path="/register" element={<RegisterUser />} />
        </Routes>
      </div>
    </div>
  </Router>
);

export default App;
