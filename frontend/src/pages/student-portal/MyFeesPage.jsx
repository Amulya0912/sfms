import React from 'react';
import { IndianRupee, FileText, Calendar, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useGetMyFeesQuery } from '../../store/api/studentApi';
import StatCard from '../../components/common/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatCurrency, formatDate, getStatusColor } from '../../utils/formatters';

const FeeStatusBadge = ({ amount, paid }) => {
  if (paid >= amount && amount > 0) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
        <CheckCircle className="w-3 h-3" /> Paid
      </span>
    );
  }
  if (paid > 0 && paid < amount) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
        <Clock className="w-3 h-3" /> Partially Paid
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
      <AlertCircle className="w-3 h-3" /> Unpaid
    </span>
  );
};

const MyFeesPage = () => {
  const { data, isLoading, isError } = useGetMyFeesQuery();

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="card flex flex-col items-center justify-center py-16 text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mb-3" />
        <p className="text-lg font-semibold text-text">Unable to load fee details</p>
        <p className="text-sm text-text-muted mt-1">Please try again or contact the administration.</p>
      </div>
    );
  }

  const { feeStructures = [], summary = {} } = data?.data || data || {};
  const { totalFee = 0, totalPaid = 0, totalPending = 0 } = summary;

  // Group fee structures by academic year label
  const grouped = feeStructures.reduce((acc, fs) => {
    const key = fs.academic_year || fs.batch || 'General';
    if (!acc[key]) acc[key] = [];
    acc[key].push(fs);
    return acc;
  }, {});

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text">My Fees</h1>
        <p className="text-sm text-text-muted mt-1">
          Complete year-wise breakdown of your fee structure, payments, and pending dues.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Fee"
          value={formatCurrency(totalFee)}
          icon={FileText}
          colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
        />
        <StatCard
          title="Total Paid"
          value={formatCurrency(totalPaid)}
          icon={CheckCircle}
          colorClass="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
        />
        <StatCard
          title="Pending Due"
          value={formatCurrency(totalPending)}
          icon={IndianRupee}
          colorClass={totalPending > 0
            ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
            : "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
          }
        />
      </div>

      {/* Fee structures grouped by year */}
      {feeStructures.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <FileText className="w-14 h-14 text-text-muted mb-4 opacity-40" />
          <p className="text-lg font-semibold text-text">No fee structures assigned</p>
          <p className="text-sm text-text-muted mt-1">
            Your fee details will appear here once set up by the administration.
          </p>
        </div>
      ) : (
        Object.entries(grouped).map(([yearLabel, structures]) => (
          <div key={yearLabel} className="card overflow-hidden">
            {/* Year Header */}
            <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-b border-border">
              <Calendar className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
              <h2 className="font-semibold text-text">{yearLabel}</h2>
            </div>

            {/* Fee Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-border text-text-muted text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold">Fee Type</th>
                    <th className="px-6 py-3 text-right font-semibold">Total Amount</th>
                    <th className="px-6 py-3 text-right font-semibold">Paid</th>
                    <th className="px-6 py-3 text-right font-semibold">Pending</th>
                    <th className="px-6 py-3 text-center font-semibold">Due Date</th>
                    <th className="px-6 py-3 text-center font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {structures.map((fs) => {
                    const paid = parseFloat(fs.paid_amount || 0);
                    const total = parseFloat(fs.amount || 0);
                    const pending = Math.max(0, total - paid);
                    const isOverdue = fs.due_date && new Date(fs.due_date) < new Date() && pending > 0;

                    return (
                      <tr
                        key={fs.id}
                        className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                          pending > 0 ? 'bg-red-50/30 dark:bg-red-900/5' : ''
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-text">{fs.fee_category_name}</span>
                            <span className="text-xs text-text-muted">{fs.fee_category_code}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right font-medium">
                          {formatCurrency(total)}
                        </td>
                        <td className="px-6 py-4 text-right text-green-600 font-medium">
                          {formatCurrency(paid)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={`font-semibold ${pending > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {formatCurrency(pending)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`text-sm ${isOverdue ? 'text-red-500 font-semibold' : 'text-text-muted'}`}>
                            {fs.due_date ? formatDate(fs.due_date) : '—'}
                            {isOverdue && <span className="block text-xs text-red-400">Overdue</span>}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <FeeStatusBadge amount={total} paid={paid} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                {/* Row total for this year */}
                <tfoot className="border-t-2 border-border bg-slate-50 dark:bg-slate-800/40">
                  <tr>
                    <td className="px-6 py-3 font-semibold text-text text-xs uppercase">Year Total</td>
                    <td className="px-6 py-3 text-right font-bold text-text">
                      {formatCurrency(structures.reduce((s, f) => s + parseFloat(f.amount || 0), 0))}
                    </td>
                    <td className="px-6 py-3 text-right font-bold text-green-600">
                      {formatCurrency(structures.reduce((s, f) => s + parseFloat(f.paid_amount || 0), 0))}
                    </td>
                    <td className="px-6 py-3 text-right font-bold text-red-600">
                      {formatCurrency(structures.reduce((s, f) => s + Math.max(0, parseFloat(f.amount || 0) - parseFloat(f.paid_amount || 0)), 0))}
                    </td>
                    <td colSpan={2} />
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyFeesPage;
