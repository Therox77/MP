import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <Sidebar />
      <main className="ml-64 pt-16 p-5">
        <h2 className="text-3xl font-bold mb-8">Bienvenido a la Intranet</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card
            title="Miembros"
            description="Gestión de miembros de la iglesia"
            bgColor="bg-blue-500"
            onClick={() => navigate('/miembros')}
          />
          <Card
            title="Eventos"
            description="Gestión de eventos y actividades"
            bgColor="bg-green-500"
            onClick={() => navigate('/eventos')}
          />
          <Card
            title="Soporte"
            description="Ayuda y contacto con soporte"
            bgColor="bg-yellow-500"
            onClick={() => navigate('/soporte')}
          />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
