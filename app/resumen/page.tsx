'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { TimeTracker } from '@/lib/timeTracker';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ResumenPage() {
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [totalHours, setTotalHours] = useState(0);
  const [averageDaily, setAverageDaily] = useState(0);
  const [currentView, setCurrentView] = useState<'weekly' | 'monthly'>('weekly');

  useEffect(() => {
    const weekly = TimeTracker.getWeeklyHours();
    const monthly = TimeTracker.getMonthlyHours();
    const entries = TimeTracker.getAllEntries();
    
    setWeeklyData(weekly.map(w => ({
      ...w,
      weekLabel: `Semana ${new Date(w.week).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}`
    })));
    
    setMonthlyData(monthly.map(m => ({
      ...m,
      monthLabel: new Date(m.month + '-01').toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
    })));
    
    const total = entries.reduce((sum, entry) => sum + (entry.horasTrabajadas || 0), 0);
    setTotalHours(total);
    setAverageDaily(entries.length > 0 ? total / entries.length : 0);
  }, []);

  const formatHours = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const currentData = currentView === 'weekly' ? weeklyData : monthlyData;
  const xDataKey = currentView === 'weekly' ? 'weekLabel' : 'monthLabel';

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Resumen de Horas</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full mr-3">
                  <i className="ri-time-line"></i>
                </div>
                <div>
                  <p className="text-sm text-blue-600">Total de Horas</p>
                  <p className="text-xl font-bold text-blue-900">{formatHours(totalHours)}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 flex items-center justify-center bg-green-500 text-white rounded-full mr-3">
                  <i className="ri-bar-chart-line"></i>
                </div>
                <div>
                  <p className="text-sm text-green-600">Promedio Diario</p>
                  <p className="text-xl font-bold text-green-900">{formatHours(averageDaily)}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 flex items-center justify-center bg-purple-500 text-white rounded-full mr-3">
                  <i className="ri-calendar-line"></i>
                </div>
                <div>
                  <p className="text-sm text-purple-600">Días Registrados</p>
                  <p className="text-xl font-bold text-purple-900">{TimeTracker.getAllEntries().length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Gráfico de Horas</h2>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setCurrentView('weekly')}
                className={`px-3 py-1 rounded-md text-sm font-medium whitespace-nowrap ${
                  currentView === 'weekly' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Semanal
              </button>
              <button
                onClick={() => setCurrentView('monthly')}
                className={`px-3 py-1 rounded-md text-sm font-medium whitespace-nowrap ${
                  currentView === 'monthly' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Mensual
              </button>
            </div>
          </div>
          
          {currentData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={currentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey={xDataKey} 
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis fontSize={12} />
                  <Tooltip 
                    formatter={(value: number) => [formatHours(value), 'Horas']}
                    labelStyle={{ color: '#374151' }}
                  />
                  <Bar dataKey="hours" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 bg-gray-100 rounded-full">
                <i className="ri-bar-chart-line text-2xl text-gray-400"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay datos suficientes</h3>
              <p className="text-gray-500">Registra más horas para ver el gráfico</p>
            </div>
          )}
        </div>
      </div>

      <Navigation />
    </div>
  );
}