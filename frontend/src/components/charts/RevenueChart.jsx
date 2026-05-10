import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useGetMonthlyRevenueQuery } from '../../store/api/dashboardApi';
import LoadingSpinner from '../common/LoadingSpinner';

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const RevenueChart = () => {
  const { data: response, isLoading } = useGetMonthlyRevenueQuery();

  if (isLoading) return <div className="h-full flex items-center justify-center"><LoadingSpinner /></div>;

  const chartData = (response?.data || []).map(item => ({
    name: monthNames[item.month - 1],
    total: Number(item.total),
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-border p-3 rounded-lg shadow-lg">
          <p className="font-semibold text-text mb-1">{label}</p>
          <p className="text-primary-600 font-medium">
            ₹{payload[0].value.toLocaleString('en-IN')}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={chartData}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
          </linearGradient>
        </defs>
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
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="total"
          stroke="#22c55e"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorTotal)"
          activeDot={{ r: 6, strokeWidth: 0, fill: '#16a34a' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default RevenueChart;
