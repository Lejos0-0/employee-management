import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

function App() {
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estado del formulario
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
    department: '',
    salary: '',
    hire_date: ''
  });

  // Cargar empleados y estadísticas
  useEffect(() => {
    loadEmployees();
    loadStats();
  }, []);

  const loadEmployees = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/employees`);
      setEmployees(response.data.data);
    } catch (error) {
      console.error('Error cargando empleados:', error);
      alert('Error al cargar empleados');
    }
  };

  const loadStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/stats`);
      setStats(response.data.data);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      position: '',
      department: '',
      salary: '',
      hire_date: ''
    });
    setEditingEmployee(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingEmployee) {
        await axios.put(`${API_BASE_URL}/employees/${editingEmployee.id}`, formData);
        alert('Empleado actualizado exitosamente');
      } else {
        await axios.post(`${API_BASE_URL}/employees`, formData);
        alert('Empleado creado exitosamente');
      }

      resetForm();
      loadEmployees();
      loadStats();
    } catch (error) {
      console.error('Error guardando empleado:', error);
      alert(error.response?.data?.error || 'Error al guardar empleado');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (employee) => {
    setFormData({
      name: employee.name,
      email: employee.email,
      position: employee.position,
      department: employee.department,
      salary: employee.salary.toString(),
      hire_date: employee.hire_date
    });
    setEditingEmployee(employee);
    setShowForm(true);
    setSidebarOpen(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este empleado?')) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/employees/${id}`);
      alert('Empleado eliminado exitosamente');
      loadEmployees();
      loadStats();
    } catch (error) {
      console.error('Error eliminando empleado:', error);
      alert('Error al eliminar empleado');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-MX');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Empleados</h1>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              {sidebarOpen ? 'Cerrar' : 'Menú'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className={`sidebar ${sidebarOpen ? 'open' : ''} md:w-1/4 bg-white rounded-lg shadow p-6 md:block ${sidebarOpen ? 'block fixed inset-0 z-50 md:relative' : 'hidden'}`}>
            <div className="md:hidden flex justify-end mb-4">
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Estadísticas */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Estadísticas</h2>
              <div className="space-y-3">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-600">Total Empleados</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {stats.totalEmployees?.total || 0}
                  </p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-green-600">Nómina Total</p>
                  <p className="text-lg font-bold text-green-900">
                    {formatCurrency(stats.totalSalary?.total || 0)}
                  </p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-sm text-purple-600">Salario Promedio</p>
                  <p className="text-lg font-bold text-purple-900">
                    {formatCurrency(stats.avgSalary?.average || 0)}
                  </p>
                </div>
              </div>
            </div>

            {/* Botón Nuevo Empleado */}
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
                setSidebarOpen(false);
              }}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-200"
            >
              + Nuevo Empleado
            </button>
          </div>

          {/* Contenido Principal */}
          <div className="flex-1">
            {showForm ? (
              /* Formulario de Empleado */
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-6">
                  {editingEmployee ? 'Editar Empleado' : 'Nuevo Empleado'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Puesto *
                      </label>
                      <input
                        type="text"
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Departamento *
                      </label>
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Seleccionar departamento</option>
                        <option value="Tecnología">Tecnología</option>
                        <option value="Operaciones">Operaciones</option>
                        <option value="Diseño">Diseño</option>
                        <option value="Analítica">Analítica</option>
                        <option value="Ventas">Ventas</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Recursos Humanos">Recursos Humanos</option>
                        <option value="Finanzas">Finanzas</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Salario *
                      </label>
                      <input
                        type="number"
                        name="salary"
                        value={formData.salary}
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de Contratación *
                      </label>
                      <input
                        type="date"
                        name="hire_date"
                        value={formData.hire_date}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition duration-200"
                    >
                      {loading ? 'Guardando...' : (editingEmployee ? 'Actualizar' : 'Crear')}
                    </button>

                    <button
                      type="button"
                      onClick={resetForm}
                      className="bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-600 transition duration-200"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* Lista de Empleados */
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-bold">Lista de Empleados</h2>
                  <p className="text-gray-600">Total: {employees.length} empleados</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Empleado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Puesto
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Departamento
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Salario
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha Contratación
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {employees.map((employee) => (
                        <tr key={employee.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {employee.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {employee.email}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{employee.position}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              {employee.department}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(employee.salary)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(employee.hire_date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleEdit(employee)}
                              className="text-indigo-600 hover:text-indigo-900 mr-3"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDelete(employee.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {employees.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No hay empleados registrados</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;