import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye } from 'lucide-react';
import { useGetPaymentsQuery } from '../../store/api/paymentApi';
import DataTable from '../../components/common/DataTable';
import { formatCurrency, formatDateTime, getStatusColor } from '../../utils/formatters';

const PaymentListPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: response, isLoading, isFetching } = useGetPaymentsQuery({ page, limit });
  const payments = response?.data || [];
  const total = response?.pagination?.total || 0;

  const columns = [
    { 
      header: 'Student', 
      accessor: 'student',
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.student_name}</span>
          <span className="text-xs text-text-muted">{row.student_code}</span>
        </div>
      )
    },
    { 
      header: 'Fee Details', 
      accessor: 'fee',
      cell: (row) => (
        <div className="flex flex-col text-sm">
          <span>{row.fee_category}</span>
          <span className="text-xs text-text-muted">{row.department}</span>
        </div>
      )
    },
    { 
      header: 'Amount Paid', 
      accessor: 'amount_paid',
      className: 'font-semibold',
      cell: (row) => formatCurrency(row.amount_paid)
    },
    { 
      header: 'Payment Info', 
      accessor: 'info',
      cell: (row) => (
        <div className="flex flex-col text-sm">
          <span>{row.payment_method}</span>
          <span className="text-xs text-text-muted">{formatDateTime(row.payment_date)}</span>
        </div>
      )
    },
    { 
      header: 'Status', 
      accessor: 'status',
      cell: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(row.status)}`}>
          {row.status}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text">Payment History</h1>
          <p className="text-sm text-text-muted">Track and manage all student fee payments.</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={payments}
        total={total}
        page={page}
        limit={limit}
        onPageChange={setPage}
        isLoading={isLoading || isFetching}
        actions={
          <button 
            onClick={() => navigate('/payments/new')}
            className="btn btn-primary whitespace-nowrap"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Payment
          </button>
        }
      />
    </div>
  );
};

export default PaymentListPage;
