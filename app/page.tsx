'use client';

import { useState, useEffect } from 'react';
import TimeButton from '@/components/TimeButton';
import StatusCard from '@/components/StatusCard';
import Navigation from '@/components/Navigation';
import { TimeTracker, DayStatus } from '@/lib/timeTracker';

export default function Home() {
  const [userName, setUserName] = useState('');
  const [dayStatus, setDayStatus] = useState<DayStatus>({
    entrada: false,
    almuerzoInicio: false,
    almuerzoFin: false,
    salida: false
  });
  const [todayEntry, setTodayEntry] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    setUserName(TimeTracker.getUserName());
    setDayStatus(TimeTracker.getDayStatus());
    setTodayEntry(TimeTracker.getTodayEntry());
    
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit' 
      }));
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const handleTimeRecord = (type: 'entrada' | 'almuerzoInicio' | 'almuerzoFin' | 'salida') => {
    TimeTracker.recordTime(type);
    setDayStatus(TimeTracker.getDayStatus());
    setTodayEntry(TimeTracker.getTodayEntry());
  };

  const getStatusMessage = () => {
    if (!dayStatus.entrada) return 'Listo para comenzar el día';
    if (!dayStatus.almuerzoInicio) return 'Trabajando - Recuerda tomar tu almuerzo';
    if (!dayStatus.almuerzoFin) return 'En almuerzo - Disfruta tu descanso';
    if (!dayStatus.salida) return 'De vuelta al trabajo';
    return 'Día de trabajo completado';
  };

  const getWorkingHours = () => {
    if (todayEntry && todayEntry.entrada && todayEntry.salida) {
      return `${todayEntry.horasTrabajadas} horas trabajadas hoy`;
    }
    return '';
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              ¡Hola, {userName}!
            </h1>
            <div className="text-3xl font-mono text-blue-600 mb-4" suppressHydrationWarning={true}>
              {currentTime}
            </div>
            <p className="text-gray-600 mb-4">{getStatusMessage()}</p>
            {getWorkingHours() && (
              <p className="text-green-600 font-semibold">{getWorkingHours()}</p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <TimeButton
            variant="entrada"
            onClick={() => handleTimeRecord('entrada')}
            disabled={dayStatus.entrada}
          >
            <div className="w-5 h-5 flex items-center justify-center mb-1">
              <i className="ri-login-circle-line"></i>
            </div>
            Marcar Entrada
          </TimeButton>
          
          <TimeButton
            variant="salida"
            onClick={() => handleTimeRecord('salida')}
            disabled={!dayStatus.entrada || dayStatus.salida}
          >
            <div className="w-5 h-5 flex items-center justify-center mb-1">
              <i className="ri-logout-circle-line"></i>
            </div>
            Marcar Salida
          </TimeButton>
          
          <TimeButton
            variant="almuerzo-inicio"
            onClick={() => handleTimeRecord('almuerzoInicio')}
            disabled={!dayStatus.entrada || dayStatus.almuerzoInicio || dayStatus.salida}
          >
            <div className="w-5 h-5 flex items-center justify-center mb-1">
              <i className="ri-restaurant-line"></i>
            </div>
            Iniciar Almuerzo
          </TimeButton>
          
          <TimeButton
            variant="almuerzo-fin"
            onClick={() => handleTimeRecord('almuerzoFin')}
            disabled={!dayStatus.almuerzoInicio || dayStatus.almuerzoFin}
          >
            <div className="w-5 h-5 flex items-center justify-center mb-1">
              <i className="ri-restaurant-fill"></i>
            </div>
            Finalizar Almuerzo
          </TimeButton>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Estado del Día</h2>
          
          <StatusCard
            status="Entrada"
            time={todayEntry?.entrada}
            isActive={dayStatus.entrada && !dayStatus.salida}
          />
          
          <StatusCard
            status="Almuerzo"
            time={todayEntry?.almuerzoInicio && todayEntry?.almuerzoFin 
              ? `${todayEntry.almuerzoInicio} - ${todayEntry.almuerzoFin}`
              : todayEntry?.almuerzoInicio}
            isActive={dayStatus.almuerzoInicio && !dayStatus.almuerzoFin}
          />
          
          <StatusCard
            status="Salida"
            time={todayEntry?.salida}
            isActive={dayStatus.salida}
          />
        </div>
      </div>

      <Navigation />
    </div>
  );
}