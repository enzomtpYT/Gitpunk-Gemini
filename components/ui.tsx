import React from 'react';
import { LucideIcon } from 'lucide-react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: LucideIcon;
}

export const CyberCard: React.FC<CardProps> = ({ children, className = "", title, icon: Icon }) => (
  <div className={`bg-cyber-dark border border-cyber-gray p-4 rounded-sm shadow-[0_0_10px_rgba(0,0,0,0.5)] relative overflow-hidden ${className}`}>
    {/* Decorative corner accents */}
    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyber-neonGreen"></div>
    <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyber-neonGreen"></div>
    <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyber-neonGreen"></div>
    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyber-neonGreen"></div>
    
    {(title || Icon) && (
      <div className="flex items-center gap-2 mb-4 border-b border-cyber-gray pb-2">
        {Icon && <Icon className="text-cyber-neonGreen w-5 h-5" />}
        {title && <h3 className="text-cyber-neonBlue font-bold uppercase tracking-wider text-sm">{title}</h3>}
      </div>
    )}
    {children}
  </div>
);

export const StatBox: React.FC<{ label: string; value: string | number; color?: string }> = ({ label, value, color = "text-white" }) => (
  <div className="flex flex-col">
    <span className="text-gray-500 text-xs uppercase tracking-widest mb-1">{label}</span>
    <span className={`text-2xl font-bold font-mono ${color} drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]`}>
      {value}
    </span>
  </div>
);
