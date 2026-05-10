import React from 'react';
import { Users, Building2, IndianRupee, AlertCircle, ArrowUpRight } from 'lucide-react';
import { 
  useGetDashboardStatsQuery, 
  useGetRecentTransactionsQuery 
} from '../../store/api/dashboardApi';
import StatCard from '../../components/common/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatCurrency, formatDateTime, getStatusColor } from '../../utils/formatters';
import RevenueChart from '../../components/charts/RevenueChart';
import BatchWiseChart from '../../components/charts/BatchWiseChart';

const DashboardPage = () => {
  const { data: statsData, isLoading: isStatsLoading } = useGetDashboardStatsQuery();
  const { data: recentTxData, isLoading: isTxLoading } = useGetRecentTransactionsQuery();

  if (isStatsLoading) {
    return <div className="h-full flex items-center justify-center"><LoadingSpinner size="lg" /></div>;
  }

  const stats = statsData?.data || { totalStudents: 0, totalDepartments: 0, totalCollected: 0, totalPending: 0 };
  const recentTransactions = recentTxData?.data || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text">Dashboard Overview</h1>
        <p className="text-sm text-text-muted">Welcome to the Student Fee Management System.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Students" 
          value={stats.totalStudents} 
          icon={Users}
          colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400"
        />
        <StatCard 
          title="Total Departments" 
          value={stats.totalDepartments} 
          icon={Building2}
          colorClass="bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400"
        />
        <StatCard 
          title="Total Collected" 
          value={formatCurrency(stats.totalCollected)} 
          icon={IndianRupee}
          colorClass="bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400"
          trend="up"
          trendValue="12%"
        />
        <StatCard 
          title="Pending Dues" 
          value={formatCurrency(stats.totalPending)} 
          icon={AlertCircle}
          colorClass="bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card h-[400px]">
            <h3 className="text-lg font-semibold text-text mb-4">Monthly Revenue Collection</h3>
            <div className="h-[300px] w-full">
              <RevenueChart />
            </div>
          </div>
          
          <div className="card h-[400px]">
            <h3 className="text-lg font-semibold text-text mb-4">Batch-wise Collection & Dues</h3>
            <div className="h-[300px] w-full">
              <BatchWiseChart />
            </div>
          </div>
        </div>

        <div className="card lg:col-span-1 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-text">Recent Transactions</h3>
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
              View all <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
            {isTxLoading ? (
              <div className="py-8"><LoadingSpinner /></div>
            ) : recentTransactions.length === 0 ? (
              <p className="text-center text-text-muted py-8">No recent transactions</p>
            ) : (
              recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-start justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent hover:border-border transition-colors">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-sm text-text">{tx.student_name}</span>
                    <span className="text-xs text-text-muted">{tx.student_code} • {tx.fee_category}</span>
                    <span className="text-xs text-text-muted">{formatDateTime(tx.payment_date)}</span>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="font-semibold text-sm text-text">+{formatCurrency(tx.amount_paid)}</span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${getStatusColor(tx.status)}`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
