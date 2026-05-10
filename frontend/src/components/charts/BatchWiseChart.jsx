import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useGetBatchWiseStatsQuery } from '../../store/api/dashboardApi';
import LoadingSpinner from '../common/LoadingSpinner';

const BatchWiseChart = () => {
  const { data: response, isLoading } = useGetBatchWiseStatsQuery();

  if (isLoading) return <div className="h-full flex items-center justify-center"><LoadingSpinner /></div>;

  const chartData = (response?.data || []).map(item => ({
    name: item.batch,
    Collected: Number(item.total_paid),
    Pending: Number(item.pending),
  })).slice(0, 5); // Show last 5 batches

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-border p-3 rounded-lg shadow-lg">
          <p className="font-semibold text-text mb-2">Batch {label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm flex items-center gap-2 mb-1" style={{ color: entry.color }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name}: ₹{entry.value.toLocaleString('en-IN')}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        barSize={32}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
          dy={10}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
          tickFormatter={(value) => `₹${value >= 1000 ? (value / 1000) + 'k' : value}`}
          dx={-10}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--border-color)', opacity: 0.4 }} />
        <Legend wrapperStyle={{ paddingTop: '20px' }} />
        <Bar dataKey="Collected" stackId="a" fill="#22c55e" radius={[0, 0, 4, 4]} />
        <Bar dataKey="Pending" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BatchWiseChart;
