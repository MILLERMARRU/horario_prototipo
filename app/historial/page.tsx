'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { TimeTracker, TimeEntry } from '@/lib/timeTracker';

export default function HistorialPage() {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<TimeEntry[]>([]);
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    const allEntries = TimeTracker.getAllEntries().sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setEntries(allEntries);
    setFilteredEntries(allEntries);
  }, []);

  useEffect(() => {
    if (dateFilter) {
      const filtered = entries.filter(entry => 
        entry.date.includes(dateFilter)
      );
      setFilteredEntries(filtered);
    } else {
      setFilteredEntries(entries);
    }
  }, [dateFilter, entries]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatHours = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Historial de Asistencia</h1>
          
          <div className="mb-6">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Filtrar por fecha"
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {filteredEntries.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 bg-gray-100 rounded-full">
              <i className="ri-file-list-line text-2xl text-gray-400"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay registros</h3>
            <p className="text-gray-500">Comienza a registrar tus horas de trabajo</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEntries.map((entry) => (
              <div key={entry.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {formatDate(entry.date)}
                  </h3>
                  {entry.horasTrabajadas && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      {formatHours(entry.horasTrabajadas)}
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 block">Entrada</span>
                    <span className="font-medium">
                      {entry.entrada || '-'}
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-gray-500 block">Inicio Almuerzo</span>
                    <span className="font-medium">
                      {entry.almuerzoInicio || '-'}
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-gray-500 block">Fin Almuerzo</span>
                    <span className="font-medium">
                      {entry.almuerzoFin || '-'}
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-gray-500 block">Salida</span>
                    <span className="font-medium">
                      {entry.salida || '-'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Navigation />
    </div>
  );
}