'use client';

interface StatusCardProps {
  status: string;
  time?: string;
  isActive?: boolean;
}

export default function StatusCard({ status, time, isActive }: StatusCardProps) {
  return (
    <div className={`p-4 rounded-lg border-2 ${isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}>
      <div className="flex items-center justify-between">
        <span className={`font-medium ${isActive ? 'text-blue-700' : 'text-gray-700'}`}>
          {status}
        </span>
        {time && (
          <span className={`text-sm ${isActive ? 'text-blue-600' : 'text-gray-600'}`}>
            {time}
          </span>
        )}
        {isActive && (
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        )}
      </div>
    </div>
  );
}