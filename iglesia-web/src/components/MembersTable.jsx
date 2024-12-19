import React from 'react';

const MembersTable = ({ members }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 shadow-md rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b">Nombre</th>
            <th className="py-2 px-4 border-b">Correo</th>
            <th className="py-2 px-4 border-b">Rol</th>
            <th className="py-2 px-4 border-b">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{member.nombre}</td>
              <td className="py-2 px-4 border-b">{member.correo}</td>
              <td className="py-2 px-4 border-b">{member.rol}</td>
              <td className="py-2 px-4 border-b">
                <button className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600">
                  Eliminar
                </button>
                <button className="bg-blue-500 text-white py-1 px-2 ml-2 rounded hover:bg-blue-600">
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MembersTable;
