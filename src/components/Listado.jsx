import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "../services/supabaseClient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const GeneralAttendanceList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [showModal, setShowModal] = useState(false);
  const [newMember, setNewMember] = useState({
    nombre_completo: "",
    telefono: "",
    dia_asistencia: "",
  });
  const [newMembers, setNewMembers] = useState(new Set());
  const [members, setMembers] = useState([]);
  const [history, setHistory] = useState({});

  useEffect(() => {
    const savedMembers = [];
    setMembers(savedMembers);
    loadAttendanceHistory();
  }, []);

  const loadAttendanceHistory = () => {
    const savedHistory =
      JSON.parse(localStorage.getItem("attendanceHistory")) || {};
    setHistory(savedHistory);
  };
  const markAttendance = (memberId) => {
    const today = new Date().toLocaleDateString();
    const updatedHistory = { ...history };

    if (!updatedHistory[memberId]) {
      updatedHistory[memberId] = [];
    }

    if (!updatedHistory[memberId].includes(today)) {
      updatedHistory[memberId].push(today);
    }

    setHistory(updatedHistory);
    localStorage.setItem("attendanceHistory", JSON.stringify(updatedHistory));
  };

  const tables = [
    "equipo",
    "liderazgo",
    "miembros",
    "nuevos",
    "teens",
    "transicion",
    "registro",
  ];

  // Fetch data from all tables
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      let combinedData = [];
      for (const table of tables) {
        const { data: tableData, error } = await supabase
          .from(table)
          .select("*");
        if (error) throw error;
        combinedData = [...combinedData, ...tableData];
      }

      // Eliminar duplicados por nombre
      const uniqueData = Array.from(
        new Map(
          combinedData.map((item) => [item.nombre_completo, item])
        ).values()
      );

      // Ordenar por nombre

      uniqueData.sort((a, b) =>
        a.nombre_completo?.localeCompare(b.nombre_completo)
      );

      // Obtener la fecha actual
      const today = new Date().toISOString().split("T")[0];

      // Actualizar cada elemento con la última asistencia
      const updatedData = uniqueData.map((item) => ({
        ...item,
        ultima_asistencia: item.dia_asistencia || "N/A", // Si no tiene una última asistencia, asignar "N/A"
        asistencia_hoy: today, // Fecha del día actual
      }));

      setData(updatedData);
      setSelectedUsers(new Set());
      toast.success("Datos cargados correctamente.");
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      toast.error("Error al cargar los datos.");
    } finally {
      setLoading(false);
    }
  }, []); // Aquí puedes agregar dependencias si necesitas

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]); // Ahora React no mostrará la advertencia

  // Handle user selection for export
  const handleUserSelection = async (nombre_completo) => {
    setSelectedUsers((prev) => {
      const newSelection = new Set(prev);
      if (newSelection.has(nombre_completo)) {
        newSelection.delete(nombre_completo);
      } else {
        newSelection.add(nombre_completo);
      }
      return newSelection;
    });
  };
  // Función para guardar la asistencia
  const saveAttendance = async () => {
    if (selectedUsers.size === 0) {
      toast.error("No hay usuarios seleccionados para guardar asistencia.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    try {
      const updates = [];
      const inserts = [];

      for (const nombre of selectedUsers) {
        for (const table of tables) {
          updates.push(
            supabase
              .from(table)
              .update({ ultima_asistencia: today })
              .eq("nombre_completo", nombre)
          );
        }

        inserts.push(
          supabase
            .from("historial_asistencia")
            .insert([{ nombre_completo: nombre, fecha_asistencia: today }])
        );
      }

      // Ejecutar todas las actualizaciones en paralelo
      const updateResults = await Promise.all(updates);
      const insertResults = await Promise.all(inserts);

      updateResults.forEach(({ error }) => {
        if (error) console.error("Error en actualización:", error);
      });

      insertResults.forEach(({ error }) => {
        if (error) console.error("Error en inserción:", error);
      });

      toast.success("Asistencia guardada correctamente.");
      setSelectedUsers(new Set());
      fetchAllData(); // Recargar datos actualizados
    } catch (error) {
      console.error("Error al guardar asistencia:", error);
      toast.error("Error al guardar asistencia.");
    }
  };

  // Export selected data to Excel
  const exportToExcel = () => {
    const selectedData = data.filter((item) =>
      selectedUsers.has(item.nombre_completo)
    );
    if (selectedData.length === 0) {
      toast.error("No hay usuarios seleccionados para exportar.");
      return;
    }

    const sheetData = [
      [
        "Nombre Completo",
        "Teléfono",
        "Última Asistencia",
        "Asistencia del Día",
      ],
      ...selectedData.map((item) => [
        item.nombre_completo || "N/A",
        item.telefono || "N/A",
        item.ultima_asistencia || "N/A",
        item.asistencia_hoy,
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Asistencia");
    XLSX.writeFile(workbook, "asistencia_general.xlsx");
    toast.success("Informe generado correctamente.");
  };
  // Export selected data to pdf
  const exportToPDF = () => {
    const selectedData = data.filter((item) =>
      selectedUsers.has(item.nombre_completo)
    );

    if (selectedData.length === 0) {
      toast.error("No hay usuarios seleccionados para exportar.");
      return;
    }

    const today = new Date().toLocaleDateString(); // Fecha actual del sistema
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(`Reporte de Asistencia - ${today}`, 14, 15); // Título con fecha

    const tableColumn = ["Fecha", "Nombre Completo", "Teléfono", "Asistencia"];
    const tableRows = selectedData.map((item) => [
      today,
      item.nombre_completo || "N/A",
      item.telefono || "N/A",
      item.asistencia_hoy ? "✔️" : "❌",
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 25,
    });

    doc.save(`asistencia_${today.replace(/\//g, "-")}.pdf`);
    toast.success("Informe PDF generado correctamente.");
  };

  // Handle input changes in the new member form
  const handleInputChange = (e) => {
    setNewMember({ ...newMember, [e.target.name]: e.target.value });
  };

  // Add new member to the database
  const addNewMember = async () => {
    if (!newMember.nombre.trim()) {
      toast.error("El nombre es obligatorio.");
      return;
    }

    try {
      const { error } = await supabase.from("registro_nuevo").insert([
        {
          nombre: newMember.nombre,
          telefono: newMember.telefono,
          asistio: newMember.asistio || null,
        },
      ]);

      if (error) {
        console.error("Error al agregar nuevo creyente:", error);
        toast.error("Error al agregar nuevo creyente.");
      } else {
        toast.success("Nuevo creyente agregado correctamente.");
        setShowModal(false);
        setNewMember({ nombre: "", telefono: "", asistio: "" });

        // Recargar datos para que el nuevo creyente aparezca en la lista
        await fetchAllData();
      }
    } catch (error) {
      console.error("Error inesperado:", error);
      toast.error("Error inesperado al agregar creyente.");
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const refreshData = () => {
    fetchAllData(); // Recargar datos desde Supabase
    setSelectedUsers(new Set()); // Desmarcar todo
    toast.info("Lista actualizada.");
  };

  // Filter data based on the search query
  const filteredData = searchQuery
    ? data.filter(
        (item) =>
          item.nombre_completo &&
          item.nombre_completo.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : data;

  return (
    <div className="flex flex-col items-center min-h-screen p-10 bg-gray-50">
      {/* Título de la lista */}
      <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-700">
        Lista General de Asistencia
      </h1>

      {/* Barra de búsqueda */}
      <div className="mb-6 w-full max-w-lg">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar por nombre..."
          className="w-full p-3 border rounded-xl shadow-md"
        />
      </div>

      {/* Botones para generar informe y agregar nuevo creyente */}
      <div className="flex justify-end gap-4 mb-6 w-full max-w-lg">
        <button
          onClick={exportToExcel}
          className="px-5 py-3 text-white bg-green-600 rounded-xl shadow-md hover:bg-green-700"
        >
          Generar Informe Excel
        </button>
        <button
          onClick={exportToPDF}
          className="px-5 py-3 text-white bg-red-600 rounded-xl shadow-md hover:bg-red-700"
        >
          General informe a PDF{" "}
        </button>
        <button
          onClick={() => {
            setShowModal(true);
            setNewMember({
              nombre_completo: "",
              telefono: "",
              dia_asistencia: "",
            });
          }}
          className="px-5 py-3 text-white bg-blue-600 rounded-xl shadow-md hover:bg-blue-700"
        >
          Agregar Nuevo Creyente
        </button>
        <button
          onClick={saveAttendance}
          className="px-5 py-3 text-white bg-purple-600 rounded-xl shadow-md hover:bg-purple-700"
        >
          Guardar asistencia
        </button>
        <button
          onClick={refreshData}
          className="px-5 py-3 text-white bg-gray-600 rounded-xl shadow-md hover:bg-gray-700"
        >
          Actualizar Lista
        </button>
      </div>

      {/* Cuadro de resumen de selección */}
      <div className="flex gap-4 w-full max-w-lg mb-6">
        {/* Contador de seleccionados */}
        <div className="p-4 bg-green-100 border border-green-400 rounded-lg flex-1 text-center">
          <h3 className="font-bold text-green-700">Seleccionados</h3>
          <p className="text-lg">{selectedUsers.size}</p>
        </div>

        {/* Lista de no seleccionados */}
        <div className="p-4 bg-red-100 border border-red-400 rounded-lg flex-1 text-center">
          <h3 className="font-bold text-red-700">No seleccionados</h3>
          <p className="text-lg">{data.length - selectedUsers.size}</p>
        </div>
      </div>

      {/* Tabla de miembros */}

      <div className="w-full max-w-4xl p-6 bg-white shadow-lg rounded-xl overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-700">
              <th className="py-4 px-6">Seleccionar</th>
              <th className="py-4 px-6">Nombre Completo</th>
              <th className="py-4 px-6">Teléfono</th>
              <th className="py-4 px-6">Asistencia del Día</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr
                key={item.nombre_completo}
                className="border-b hover:bg-gray-100"
              >
                <td className="py-4 px-6 text-center">
                  <input
                    type="checkbox"
                    checked={selectedUsers.has(item.nombre_completo)}
                    onChange={() => handleUserSelection(item.nombre_completo)}
                  />
                </td>
                <td className="py-4 px-6">{item.nombre_completo}</td>
                <td className="py-4 px-6">{item.telefono}</td>
                <td className="py-4 px-6">{item.asistencia_hoy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para agregar un nuevo miembro */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="w-96 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-bold mb-4">Agregar Nuevo Creyente</h2>
            <input
              name="nombre"
              placeholder="Nombre"
              value={newMember.nombre}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-2"
            />
            <input
              name="telefono"
              placeholder="Teléfono"
              value={newMember.telefono}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-2"
            />
            <input
              name="asistio"
              type="date"
              value={newMember.asistio}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-2"
            />

            <button
              onClick={addNewMember}
              className="px-4 py-2 text-white bg-blue-500 rounded mr-2"
            >
              Guardar
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-white bg-red-500 rounded"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <ToastContainer />
    </div>
  );
};

export default GeneralAttendanceList;
