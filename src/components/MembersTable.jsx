import React, { useEffect, useState, useCallback } from "react";
import { saveAs } from "file-saver";
import { supabase } from "../services/supabaseClient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MembersTable = () => {
  const [members, setMembers] = useState([]);
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editMember, setEditMember] = useState(null);
  const [editData, setEditData] = useState({});
  const [addMember, setAddMember] = useState(false); // Estado para mostrar el modal "Agregar Miembro"
  const [newMember, setNewMember] = useState({
    nombre_completo: "",
    telefono: "",
    areas_de_servicio: "",
  }); // Datos del nuevo miembro

  const limit = 10;

  const areaTables = {
    equipo: "equipo",
    liderazgo: "liderazgo",
    miembros: "miembros",
    nuevos: "nuevos",
    teens: "teens",
    transicion: "transicion",
    kids: "kids",
  };

  const columnDefinitions = {
    equipo: ["nombre_completo", "telefono", "areas_de_servicio"],
    liderazgo: ["nombre_completo", "telefono", "gmail"],
    miembros: ["nombre_completo", "telefono"],
    nuevos: ["nombre_completo", "telefono", "estado"],
    teens: ["nombre_completo", "fecha_nacimiento", "telefono"],
    transicion: ["nombre_completo", "telefono", "estado"],
    kids: [
      "nombre_completo",
      "fecha_de_nacimiento",
      "nombre_apoderado",
      "telefono",
    ],
  };

  const Spinner = () => (
    <div className="flex justify-center items-center py-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
    </div>
  );

  const fetchData = async (area = "", page = 1) => {
    if (!area || !areaTables[area]) {
      toast.error("Por favor, selecciona un área válida.");
      return;
    }
    setLoading(true);
    try {
      const offset = (page - 1) * limit;
      const { data, error, count } = await supabase
        .from(areaTables[area])
        .select("*", { count: "exact" })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      setMembers(data || []);
      setFilteredMembers(data || []);
      setTotalPages(Math.ceil((count || 0) / limit));
    } catch (error) {
      toast.error("No se pudieron cargar los datos.");
      console.error("Error al cargar datos:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExportToCSV = () => {
    if (!filteredMembers.length) {
      toast.error("No hay datos para exportar.");
      return;
    }
    const headers =
      columnDefinitions[selectedArea]?.map((col) => col.replace(/_/g, " ")) ||
      [];
    const csvContent = [
      headers.join(","),
      ...filteredMembers.map((row) =>
        columnDefinitions[selectedArea]?.map((col) => row[col] || "").join(",")
      ),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `${selectedArea || "miembros"}.csv`);
  };

  useEffect(() => {
    if (searchQuery) {
      const filtered = members.filter(
        (member) =>
          member.nombre_completo
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          member.id?.toString().includes(searchQuery)
      );
      setFilteredMembers(filtered);
    } else {
      setFilteredMembers(members);
    }
  }, [searchQuery, members]);

  useEffect(() => {
    if (selectedArea) fetchData(selectedArea, page);
  }, [selectedArea, page]);

  const handleEditClick = (member) => {
    setEditMember(member);
    setEditData({ ...member });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value === "true",
    }));
  };

  const handleSaveChanges = async () => {
    if (!editData.nombre_completo || !editData.id) {
      toast.error("Por favor, complete todos los campos.");
      return;
    }

    try {
      const { error } = await supabase
        .from(areaTables[selectedArea])
        .update(editData)
        .eq("id", editData.id);

      if (error) throw error;

      toast.success("¡Miembro actualizado correctamente!");
      setEditMember(null);
      fetchData(selectedArea, page);
    } catch (error) {
      toast.error("Error al actualizar los datos.");
      console.error("Error al actualizar:", error.message);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-6 text-blue-600">
        Gestión de Miembros y Áreas
      </h1>

      {/* Filtros */}
      <div className="flex flex-wrap gap-6 mb-8 justify-center">
        <input
          type="text"
          placeholder="Buscar por nombre o ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 p-3 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-1/3 bg-white text-gray-800 placeholder-gray-400"
        />
        <select
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
          className="border border-gray-300 p-3 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-1/3 bg-white text-gray-800"
        >
          <option value="">Selecciona un Área</option>
          {Object.keys(areaTables).map((area) => (
            <option key={area} value={area}>
              {area.charAt(0).toUpperCase() + area.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Botón de Exportar CSV */}
      <div className="flex justify-end gap-4 mb-4">
        <button
          onClick={handleExportToCSV}
          className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 flex items-center"
        >
          Exportar a CSV
        </button>
      </div>

      {/* Spinner o Tabla */}
      {loading ? (
        <Spinner />
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full border-collapse">
            <thead className="bg-blue-600">
              <tr>
                {/* Encabezados dinámicos basados en columnDefinitions */}
                <th className="py-4 px-6 text-left text-sm font-medium">
                  Seleccionar
                </th>
                {columnDefinitions[selectedArea]?.map((column, idx) => (
                  <th
                    key={idx}
                    className="py-4 px-6 text-left text-sm font-medium"
                  >
                    {column.replace(/_/g, " ").toUpperCase()}
                  </th>
                ))}
                <th className="py-4 px-6 text-left text-sm font-medium">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member, index) => (
                <tr
                  key={member.id}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="py-4 px-6">
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(member)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedMembers((prev) => [...prev, member]);
                        } else {
                          setSelectedMembers((prev) =>
                            prev.filter((m) => m.id !== member.id)
                          );
                        }
                      }}
                    />
                  </td>
                  {/* Renderizado dinámico de columnas basado en columnDefinitions */}
                  {columnDefinitions[selectedArea]?.map((column, idx) => (
                    <td key={idx} className="py-4 px-6">
                      {member[column] || "N/A"}
                    </td>
                  ))}
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleEditClick(member)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow hover:bg-yellow-600"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginación */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-300 rounded-l-lg hover:bg-gray-400 disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="px-4 py-2 bg-white border border-gray-300">{`Página ${page} de ${totalPages}`}</span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={page >= totalPages}
          className="px-4 py-2 bg-gray-300 rounded-r-lg hover:bg-gray-400 disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>

      {/* Modal de Edición */}
      {editMember && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-semibold mb-4">Editar Miembro</h2>

            {/* Campos de edición */}
            <div className="mb-4">
              <label className="block font-medium">Gmail</label>
              <input
                type="email"
                name="gmail"
                value={editData.gmail || ""}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 rounded-lg w-full"
              />
            </div>

            <div className="mb-4">
              <label className="block font-medium">Teléfono</label>
              <input
                type="text"
                name="telefono"
                value={editData.telefono || ""}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 rounded-lg w-full"
              />
            </div>

            {/* Datos del miembro */}
            <div className="mb-4">
              <label className="block font-medium">Fecha de Nacimiento</label>
              <input
                type="date"
                name="fecha_nacimiento"
                value={editData.fecha_nacimiento || ""}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 rounded-lg w-full"
              />
            </div>

            <div className="mb-4">
              <label className="block font-medium">Bautizado</label>
              <select
                name="bautizado"
                value={editData.bautizado ? "true" : "false"}
                onChange={handleSelectChange}
                className="border border-gray-300 p-2 rounded-lg w-full"
              >
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            </div>
            {/* Introducción a la Teología Básica */}
            <div className="mb-4">
              <label className="block font-medium">
                Introducción a la Teología Básica
              </label>
              <select
                name="estudio_a_la_teologia_basica"
                value={editData.estudio_a_la_teologia_basica || "none"}
                onChange={handleSelectChange}
                className="border border-gray-300 p-2 rounded-lg w-full"
              >
                <option value="none">No Aplicable</option>
                <option value="true">Hecho</option>
                <option value="false">No Hecho</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block font-medium">alpha</label>
              <select
                name="alpha"
                value={editData.alpha || "none"}
                onChange={handleSelectChange}
                className="border border-gray-300 p-2 rounded-lg w-full"
              >
                <option value="none">No Aplicable</option>
                <option value="true">Hecho</option>
                <option value="false">No Hecho</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block font-medium">Pathways</label>
              <select
                name="pathways"
                value={editData.pathways || "none"}
                onChange={handleSelectChange}
                className="border border-gray-300 p-2 rounded-lg w-full"
              >
                <option value="none">No Aplicable</option>
                <option value="true">Hecho</option>
                <option value="false">No Hecho</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block font-medium">Estudios teologicos</label>
              <textarea
                name="estudios_teologicos"
                value={editData.estudios_teologicos || ""}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 rounded-lg w-full"
              />
            </div>

            {/* Botones para guardar o cancelar */}
            <div className="flex justify-end gap-4">
              <button
                onClick={handleSaveChanges}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
              >
                Guardar
              </button>
              <button
                onClick={() => setEditMember(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-600"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast notifications */}
      <ToastContainer />
    </div>
  );
};

export default MembersTable;
