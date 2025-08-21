export interface TimeEntry {
  id: string;
  date: string;
  entrada?: string;
  almuerzoInicio?: string;
  almuerzoFin?: string;
  salida?: string;
  horasTrabajadas?: number;
}

export interface DayStatus {
  entrada: boolean;
  almuerzoInicio: boolean;
  almuerzoFin: boolean;
  salida: boolean;
}

export class TimeTracker {
  private static STORAGE_KEY = 'timetracker-data';
  private static USER_KEY = 'timetracker-user';

  static getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  static getCurrentTime(): string {
    return new Date().toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  static getAllEntries(): TimeEntry[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  static getTodayEntry(): TimeEntry | null {
    const entries = this.getAllEntries();
    const today = this.getCurrentDate();
    return entries.find(entry => entry.date === today) || null;
  }

  static saveEntry(entry: TimeEntry): void {
    const entries = this.getAllEntries();
    const existingIndex = entries.findIndex(e => e.id === entry.id);
    
    if (existingIndex >= 0) {
      entries[existingIndex] = entry;
    } else {
      entries.push(entry);
    }
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(entries));
  }

  static calculateWorkedHours(entry: TimeEntry): number {
    if (!entry.entrada || !entry.salida) return 0;
    
    const entrada = new Date(`${entry.date}T${entry.entrada}:00`);
    const salida = new Date(`${entry.date}T${entry.salida}:00`);
    
    let workedMs = salida.getTime() - entrada.getTime();
    
    // Descontar tiempo de almuerzo
    if (entry.almuerzoInicio && entry.almuerzoFin) {
      const almuerzoInicio = new Date(`${entry.date}T${entry.almuerzoInicio}:00`);
      const almuerzoFin = new Date(`${entry.date}T${entry.almuerzoFin}:00`);
      const almuerzoMs = almuerzoFin.getTime() - almuerzoInicio.getTime();
      workedMs -= almuerzoMs;
    }
    
    return Math.round((workedMs / (1000 * 60 * 60)) * 100) / 100;
  }

  static recordTime(type: keyof Omit<TimeEntry, 'id' | 'date' | 'horasTrabajadas'>): void {
    const today = this.getCurrentDate();
    const currentTime = this.getCurrentTime();
    const existingEntry = this.getTodayEntry();
    
    const entry: TimeEntry = existingEntry || {
      id: today,
      date: today,
    };
    
    entry[type] = currentTime;
    
    // Calcular horas trabajadas si hay entrada y salida
    if (entry.entrada && entry.salida) {
      entry.horasTrabajadas = this.calculateWorkedHours(entry);
    }
    
    this.saveEntry(entry);
  }

  static getDayStatus(): DayStatus {
    const todayEntry = this.getTodayEntry();
    
    return {
      entrada: !!todayEntry?.entrada,
      almuerzoInicio: !!todayEntry?.almuerzoInicio,
      almuerzoFin: !!todayEntry?.almuerzoFin,
      salida: !!todayEntry?.salida,
    };
  }

  static getUserName(): string {
    if (typeof window === 'undefined') return 'Usuario';
    return localStorage.getItem(this.USER_KEY) || 'Usuario';
  }

  static setUserName(name: string): void {
    localStorage.setItem(this.USER_KEY, name);
  }

  static getWeeklyHours(): { week: string; hours: number }[] {
    const entries = this.getAllEntries();
    const weeklyData: { [key: string]: number } = {};
    
    entries.forEach(entry => {
      if (entry.horasTrabajadas) {
        const date = new Date(entry.date);
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        const weekKey = weekStart.toISOString().split('T')[0];
        
        weeklyData[weekKey] = (weeklyData[weekKey] || 0) + entry.horasTrabajadas;
      }
    });
    
    return Object.entries(weeklyData).map(([week, hours]) => ({
      week,
      hours: Math.round(hours * 100) / 100
    }));
  }

  static getMonthlyHours(): { month: string; hours: number }[] {
    const entries = this.getAllEntries();
    const monthlyData: { [key: string]: number } = {};
    
    entries.forEach(entry => {
      if (entry.horasTrabajadas) {
        const monthKey = entry.date.substring(0, 7);
        monthlyData[monthKey] = (monthlyData[monthKey] || 0) + entry.horasTrabajadas;
      }
    });
    
    return Object.entries(monthlyData).map(([month, hours]) => ({
      month,
      hours: Math.round(hours * 100) / 100
    }));
  }

  static exportToCSV(): string {
    const entries = this.getAllEntries();
    const headers = ['Fecha', 'Entrada', 'Inicio Almuerzo', 'Fin Almuerzo', 'Salida', 'Horas Trabajadas'];
    
    const csvContent = [
      headers.join(','),
      ...entries.map(entry => [
        entry.date,
        entry.entrada || '',
        entry.almuerzoInicio || '',
        entry.almuerzoFin || '',
        entry.salida || '',
        entry.horasTrabajadas || ''
      ].join(','))
    ].join('\\n');
    
    return csvContent;
  }
}