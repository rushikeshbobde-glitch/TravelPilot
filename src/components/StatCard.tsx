import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: 'cyan' | 'emerald' | 'amber' | 'rose' | 'purple';
  badge?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'cyan',
  badge,
  onClick,
}) => {
  const colorMap = {
    cyan: {
      border: 'hover:border-cyan-500/50',
      iconBg: 'bg-cyan-500/10 text-cyan-400',
      glow: 'group-hover:shadow-glow',
    },
    emerald: {
      border: 'hover:border-emerald-500/50',
      iconBg: 'bg-emerald-500/10 text-emerald-400',
      glow: 'group-hover:shadow-glow-emerald',
    },
    amber: {
      border: 'hover:border-amber-500/50',
      iconBg: 'bg-amber-500/10 text-amber-400',
      glow: 'group-hover:shadow-glow-amber',
    },
    rose: {
      border: 'hover:border-rose-500/50',
      iconBg: 'bg-rose-500/10 text-rose-400',
      glow: 'group-hover:shadow-glow-rose',
    },
    purple: {
      border: 'hover:border-purple-500/50',
      iconBg: 'bg-purple-500/10 text-purple-400',
      glow: 'group-hover:shadow-glow',
    },
  };

  const curr = colorMap[color];

  return (
    <div
      onClick={onClick}
      className={`glass-card p-5 group transition-all duration-300 ${curr.border} ${curr.glow} ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-extrabold text-white mt-1.5 tracking-tight">{value}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl ${curr.iconBg} transition-transform group-hover:scale-110`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {badge && (
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
          <span>{badge}</span>
        </div>
      )}
    </div>
  );
};
