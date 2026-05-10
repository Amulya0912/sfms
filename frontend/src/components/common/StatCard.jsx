import React from 'react';
import { cn } from './LoadingSpinner';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, colorClass }) => {
  return (
    <div className="card flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-text-muted mb-1">{title}</p>
          <h4 className="text-2xl font-bold text-text">{value}</h4>
        </div>
        <div className={cn("p-3 rounded-xl", colorClass)}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      
      {trend && (
        <div className="flex items-center gap-2 mt-auto">
          <span className={cn(
            "text-xs font-medium px-2 py-1 rounded-md",
            trend === 'up' ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
            trend === 'down' ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
            "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
          )}>
            {trend === 'up' ? '+' : trend === 'down' ? '-' : ''}{trendValue}
          </span>
          <span className="text-xs text-text-muted">vs last month</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
