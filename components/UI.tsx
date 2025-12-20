
import React from 'react';
import { Tier } from '../types';

export const Badge: React.FC<{ tier: Tier }> = ({ tier }) => {
  // Added missing 'C' tier color configuration to satisfy Record<Tier, string> requirement
  const colors: Record<Tier, string> = {
    'SSS': 'bg-red-600 text-yellow-100 border-yellow-400 border shadow-[0_0_10px_rgba(234,179,8,0.4)]',
    'SS': 'bg-red-500 text-white border-red-300 border-opacity-30 border',
    'S': 'bg-orange-500 text-white',
    'A+': 'bg-purple-600 text-white',
    'A': 'bg-purple-400 text-white',
    'B': 'bg-blue-500 text-white',
    'C': 'bg-blue-400 text-white',
    'D': 'bg-gray-600 text-gray-200',
    'F': 'bg-gray-800 text-gray-500',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-wider uppercase ${colors[tier] || 'bg-gray-500'}`}>
      {tier}
    </span>
  );
};

export const ProgressBar: React.FC<{ value: number, max: number, color: 'red' | 'green' | 'blue' | 'orange' }> = ({ value, max, color }) => {
  const colorMap = {
    red: 'bg-red-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    orange: 'bg-orange-500'
  };
  const percentage = (value / max) * 100;
  return (
    <div className="flex-1 h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
      <div 
        className={`h-full ${colorMap[color]} transition-all duration-500 rounded-full`} 
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export const Card: React.FC<{ children: React.ReactNode; tier?: Tier; className?: string }> = ({ children, tier, className = '' }) => {
  const isMythic = tier === 'SSS';
  const isLowTier = tier && ['B', 'D', 'F'].includes(tier);

  return (
    <div className={`
      bg-gray-800/80 backdrop-blur-sm border rounded-2xl p-4 shadow-xl transition-all
      ${isMythic ? 'border-red-500/50 shadow-red-900/20 ring-1 ring-red-500/20 animate-none hover:shadow-red-500/30' : 'border-gray-700/50'}
      ${isLowTier ? 'opacity-60 grayscale-[0.3]' : 'opacity-100'}
      ${className}
    `}>
      {isMythic && (
        <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none">
          <div className="absolute top-[-5px] right-[-5px] w-[30px] h-[30px] bg-red-600 rotate-45 transform origin-center opacity-20 blur-xl" />
        </div>
      )}
      {children}
    </div>
  );
};
