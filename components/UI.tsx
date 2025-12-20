
import React from 'react';
import { Tier } from '../types';

export const Badge: React.FC<{ tier: Tier }> = ({ tier }) => {
  const colors: Record<Tier, string> = {
    'SSS': 'bg-red-600 text-yellow-100 border-yellow-400 border shadow-[0_0_12px_rgba(220,38,38,0.6)] font-black',
    'SS': 'bg-red-500 text-white border-red-300/30 border font-bold',
    'S': 'bg-orange-500 text-white shadow-md shadow-orange-900/20 font-bold',
    'A+': 'bg-purple-600 text-white',
    'A': 'bg-purple-400 text-white',
    'B': 'bg-blue-500 text-white',
    'C': 'bg-blue-400 text-white',
    'D': 'bg-gray-600 text-gray-200',
    'F': 'bg-gray-800 text-gray-500',
  };
  return (
    <span className={`px-2.5 py-1 rounded-lg text-[10px] tracking-widest uppercase shadow-sm ${colors[tier] || 'bg-gray-500'}`}>
      {tier}
    </span>
  );
};

export const Card: React.FC<{ children: React.ReactNode; tier?: Tier; className?: string }> = ({ children, tier, className = '' }) => {
  const isGod = tier === 'SSS';
  return (
    <div className={`
      bg-gray-800/50 backdrop-blur-md border rounded-[2rem] p-5 shadow-2xl transition-all duration-300 overflow-hidden
      ${isGod ? 'border-yellow-500/30 ring-1 ring-yellow-500/10' : 'border-gray-700/50 hover:border-gray-600'}
      ${className}
    `}>
      {isGod && (
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-yellow-500/10 blur-[50px] pointer-events-none rounded-full" />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
