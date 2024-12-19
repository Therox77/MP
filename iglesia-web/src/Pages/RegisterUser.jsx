import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';

const RegisterUser = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert('Error registrando usuario: ' + error.message);
    else alert('Usuario registrado exitosamente.');
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Registrar Usuario</h2>
      <input type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Registrar</button>
    </form>
  );
};

export default RegisterUser;
