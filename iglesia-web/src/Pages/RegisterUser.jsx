import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

const RegisterUser = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      alert('Error registrando usuario: ' + error.message);
    } else {
      alert('Registro exitoso, por favor inicia sesión.');
      navigate('/');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Regístrate</h2>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded mb-4"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded mb-4"
        />
        <button
          type="submit"
          className="bg-green-500 text-white py-2 px-4 rounded w-full hover:bg-green-600"
        >
          Registrarse
        </button>
        <p className="text-center mt-4">
          ¿Ya tienes una cuenta?{' '}
          <button
            onClick={() => navigate('/')}
            className="text-blue-500 underline hover:text-blue-700"
          >
            Inicia Sesión
          </button>
        </p>
      </form>
    </div>
  );
};

export default RegisterUser;
