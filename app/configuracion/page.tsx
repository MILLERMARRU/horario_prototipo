'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { TimeTracker } from '@/lib/timeTracker';

export default function ConfiguracionPage() {
  const [userName, setUserName] = useState('');
  const [tempName, setTempName] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const name = TimeTracker.getUserName();
    setUserName(name);
    setTempName(name);
  }, []);

  const handleSaveName = () => {
    TimeTracker.setUserName(tempName);
    setUserName(tempName);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleExportCSV = () => {
    const csvData = TimeTracker.exportToCSV();
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registro-horas-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    if (confirm('¿Estás seguro de que deseas eliminar todos los registros? Esta acción no se puede deshacer.')) {
      localStorage.removeItem('timetracker-data');
      alert('Todos los registros han sido eliminados.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Configuración</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Configuración Personal */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Información Personal</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de Usuario
                </label>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ingresa tu nombre"
                  />
                  <button
                    onClick={handleSaveName}
                    className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap"
                  >
                    Guardar
                  </button>
                </div>
                {showSuccess && (
                  <p className="mt-2 text-sm text-green-600">¡Nombre guardado exitosamente!</p>
                )}
              </div>
            </div>
          </div>

          {/* Exportar Datos */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Exportar Datos</h2>
            
            <div className="space-y-4">
              <p className="text-gray-600">
                Descarga todos tus registros de horas en formato CSV para uso externo o respaldo.
              </p>
              
              <button
                onClick={handleExportCSV}
                className="w-full md:w-auto px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2 whitespace-nowrap"
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className="ri-download-line"></i>
                </div>
                <span>Exportar a CSV</span>
              </button>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total de Días Registrados</p>
                <p className="text-2xl font-bold text-gray-900">{TimeTracker.getAllEntries().length}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Horas Totales</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(TimeTracker.getAllEntries().reduce((sum, entry) => sum + (entry.horasTrabajadas || 0), 0))}h
                </p>
              </div>
            </div>
          </div>

          {/* Zona Peligrosa */}
          <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
            <h2 className="text-lg font-semibold text-red-900 mb-4">Zona Peligrosa</h2>
            
            <div className="space-y-4">
              <p className="text-red-600">
                Esta acción eliminará permanentemente todos tus registros de horas. No se puede deshacer.
              </p>
              
              <button
                onClick={handleClearData}
                className="w-full md:w-auto px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-2 whitespace-nowrap"
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className="ri-delete-bin-line"></i>
                </div>
                <span>Eliminar Todos los Registros</span>
              </button>
            </div>
          </div>

          {/* Información de la App */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Acerca de la App</h2>
            
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Versión:</strong> 1.0.0</p>
              <p><strong>Almacenamiento:</strong> Local del navegador</p>
              <p><strong>Funciona sin conexión:</strong> Sí</p>
              <p><strong>Respaldo automático:</strong> No disponible</p>
            </div>
          </div>
        </div>
      </div>

      <Navigation />
    </div>
  );
}