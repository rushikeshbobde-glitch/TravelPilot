import React from 'react';
import { PriorityLevel } from '../types';

export const PriorityBadge: React.FC<{ priority?: PriorityLevel; className?: string }> = ({
  priority = 'MEDIUM',
  className = '',
}) => {
  const config = {
    HIGH: {
      bg: 'bg-rose-500/15 border-rose-500/30 text-rose-300',
      label: 'High Priority',
      dot: 'bg-rose-400',
    },
    MEDIUM: {
      bg: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
      label: 'Med Priority',
      dot: 'bg-amber-400',
    },
    LOW: {
      bg: 'bg-slate-700/50 border-slate-600 text-slate-300',
      label: 'Low Priority',
      dot: 'bg-slate-400',
    },
  };

  const curr = config[priority] || config.MEDIUM;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${curr.bg} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${curr.dot}`} />
      {curr.label}
    </span>
  );
};
