
import React from 'react';
import { Tier } from '../types';
import { Gem } from 'lucide-react';

export const Badge: React.FC<{ tier: Tier }> = ({ tier }) => {
  const colors: Record<Tier, string> = {
    'SSS': 'bg-gradient-to-r from-red-600 via-orange-500 to-red-600 text-yellow-100 border-yellow-400 border animate-pulse font-black',
    'SS': 'bg-red-500 text-white border-red-300/30 border font-bold',
    'S': 'bg-orange-500 text-white shadow-md shadow-orange-900/20 font-bold',
    'A': 'bg-purple-600 text-white',
    'B': 'bg-blue-500 text-white',
    'C': 'bg-blue-400 text-white',
    'D': 'bg-gray-600 text-gray-200',
    'F': 'bg-gray-800 text-gray-500',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[8px] tracking-[0.1em] uppercase shadow-sm ${colors[tier] || 'bg-gray-500'}`}>
      {tier}
    </span>
  );
};

export const Card: React.FC<{ children: React.ReactNode; tier?: Tier; className?: string }> = ({ children, tier, className = '' }) => {
  const isGod = tier === 'SSS';
  return (
    <div className={`
      relative transition-all duration-500 rounded-[2rem] border group overflow-hidden
      ${isGod 
        ? 'bg-gradient-to-br from-gray-900 to-gray-950 border-yellow-500/20 shadow-2xl' 
        : 'bg-gray-900/40 backdrop-blur-xl border-white/5 hover:border-orange-500/20'}
      ${className}
    `}>
      {isGod && (
        <div className="absolute -bottom-6 -right-6 opacity-[0.03] group-hover:opacity-[0.07] group-hover:rotate-12 transition-all duration-1000 pointer-events-none">
          <Gem className="text-yellow-500 w-48 h-48" />
        </div>
      )}
      <div className="relative z-10 p-5">
        {children}
      </div>
    </div>
  );
};
