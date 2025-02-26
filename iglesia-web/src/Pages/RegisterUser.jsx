import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';

const RegisterUser = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleCreateUser = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp(
      { email, password },
      { data: { username } } // Almacena el nombre de usuario en el perfil
    );

    if (error) {
      alert('Error creando usuario: ' + error.message);
    } else {
      alert('Usuario creado exitosamente.');
      setUsername('');
      setEmail('');
      setPassword('');
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-100 min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Registrar Nuevo Usuario</h2>
        <form onSubmit={handleCreateUser}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-semibold text-gray-600 mb-2">
              Nombre de Usuario
            </label>
            <input
              id="username"
              type="text"
              placeholder="Nombre de Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-600 mb-2">
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              placeholder="Correo del Usuario"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-600 mb-2">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              placeholder="Contraseña del Usuario"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded font-semibold hover:bg-blue-600 transition-all"
          >
            Crear Usuario
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterUser;
