'use client';

interface TimeButtonProps {
  onClick: () => void;
  disabled?: boolean;
  variant: 'entrada' | 'almuerzo-inicio' | 'almuerzo-fin' | 'salida';
  children: React.ReactNode;
}

export default function TimeButton({ onClick, disabled, variant, children }: TimeButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'entrada':
        return 'bg-green-500 hover:bg-green-600 text-white';
      case 'almuerzo-inicio':
        return 'bg-orange-500 hover:bg-orange-600 text-white';
      case 'almuerzo-fin':
        return 'bg-yellow-500 hover:bg-yellow-600 text-white';
      case 'salida':
        return 'bg-red-500 hover:bg-red-600 text-white';
      default:
        return 'bg-gray-500 hover:bg-gray-600 text-white';
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap ${getVariantStyles()}`}
    >
      {children}
    </button>
  );
}