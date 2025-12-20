
import React from 'react';
import { Tier } from '../types';

export const Badge: React.FC<{ tier: Tier }> = ({ tier }) => {
  const colors: Record<Tier, string> = {
    'SSS': 'bg-red-600 text-yellow-100 border-yellow-400 border shadow-[0_0_10px_rgba(234,179,8,0.3)]',
    'SS': 'bg-red-500 text-white',
    'S': 'bg-orange-500 text-white',
    'A+': 'bg-purple-500 text-white',
    'A': 'bg-purple-400 text-white',
    'B': 'bg-blue-500 text-white',
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

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-4 shadow-xl ${className}`}>
    {children}
  </div>
);
