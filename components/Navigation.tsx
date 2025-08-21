'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Inicio', icon: 'ri-home-line' },
    { href: '/historial', label: 'Historial', icon: 'ri-history-line' },
    { href: '/resumen', label: 'Resumen', icon: 'ri-bar-chart-line' },
    { href: '/configuracion', label: 'Config', icon: 'ri-settings-line' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
              pathname === item.href
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <i className={item.icon}></i>
            </div>
            <span className="text-xs mt-1 whitespace-nowrap">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}