import React, { useState } from 'react';
import { Download, FileText, Receipt } from 'lucide-react';
import { useGetReceiptsQuery } from '../../store/api/receiptApi';
import DataTable from '../../components/common/DataTable';
import { formatCurrency, formatDate, getStatusColor } from '../../utils/formatters';
import { useAuth } from '../../hooks/useAuth';
import { axiosInstance } from '../../api/axios';
import toast from 'react-hot-toast';

const ReceiptListPage = () => {
  const { user } = useAuth();
  const isStudent = user?.role === 'student';
  const [page, setPage] = useState(1);
  const [isDownloading, setIsDownloading] = useState(null);
  const limit = 10;

  const { data: response, isLoading, isFetching } = useGetReceiptsQuery({ page, limit });

  const receipts = response?.data || [];
  const total = response?.pagination?.total || receipts.length;

  const handleDownload = async (id, receiptNo) => {
    setIsDownloading(id);
    try {
      const res = await axiosInstance({
        url: `/receipts/${id}/download`,
        method: 'GET',
        responseType: 'blob',
      });
      // axiosInstance interceptor returns response.data, but for blobs the interceptor
      // returns the raw response — check which shape we got
      const blobData = res instanceof Blob ? res : new Blob([res], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blobData);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Receipt_${receiptNo}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Receipt downloaded successfully');
    } catch (err) {
      toast.error('Failed to download receipt');
    } finally {
      setIsDownloading(null);
    }
  };

  const DownloadBtn = ({ row }) => (
    <button
      onClick={() => handleDownload(row.id, row.receipt_no)}
      disabled={isDownloading === row.id}
      className="btn btn-secondary text-xs py-1.5 px-3 inline-flex items-center gap-1"
    >
      {isDownloading === row.id ? (
        <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <Download className="w-3 h-3" />
      )}
      PDF
    </button>
  );

  // Columns for Accountant / Admin — includes student info
  const adminColumns = [
    {
      header: 'Receipt No.',
      accessor: 'receipt_no',
      cell: (row) => (
        <span className="font-mono font-semibold text-primary-600 dark:text-primary-400 text-xs">
          {row.receipt_no}
        </span>
      ),
    },
    {
      header: 'Student',
      accessor: 'student',
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-text">{row.student_name}</span>
          <span className="text-xs text-text-muted font-mono">{row.student_code}</span>
        </div>
      ),
    },
    {
      header: 'Academic Year',
      accessor: 'academic_year',
      cell: (row) => <span className="text-sm">{row.academic_year || '—'}</span>,
    },
    {
      header: 'Fee Type',
      accessor: 'fee_category',
      cell: (row) => <span className="text-sm">{row.fee_category}</span>,
    },
    {
      header: 'Transaction ID',
      accessor: 'transaction_ref',
      cell: (row) => (
        <span className="font-mono text-xs text-text-muted">{row.transaction_ref || 'N/A'}</span>
      ),
    },
    {
      header: 'Paid Amount',
      accessor: 'amount_paid',
      cell: (row) => (
        <span className="font-semibold text-green-600">{formatCurrency(row.amount_paid)}</span>
      ),
    },
    {
      header: 'Payment Date',
      accessor: 'payment_date',
      cell: (row) => <span className="text-sm">{formatDate(row.payment_date)}</span>,
    },
    {
      header: 'Status',
      accessor: 'payment_status',
      cell: (row) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(row.payment_status)}`}>
          {row.payment_status}
        </span>
      ),
    },
    {
      header: 'Download',
      accessor: 'actions',
      className: 'text-right',
      cellClassName: 'text-right',
      cell: (row) => <DownloadBtn row={row} />,
    },
  ];

  // Student columns — no student info column (they only see their own)
  const studentColumns = [
    {
      header: 'Receipt No.',
      accessor: 'receipt_no',
      cell: (row) => (
        <span className="font-mono font-semibold text-primary-600 dark:text-primary-400 text-xs">
          {row.receipt_no}
        </span>
      ),
    },
    {
      header: 'Payment Date',
      accessor: 'payment_date',
      cell: (row) => <span className="text-sm">{formatDate(row.payment_date)}</span>,
    },
    {
      header: 'Academic Year',
      accessor: 'academic_year',
      cell: (row) => <span className="text-sm">{row.academic_year || '—'}</span>,
    },
    {
      header: 'Fee Type',
      accessor: 'fee_category',
      cell: (row) => <span className="text-sm font-medium">{row.fee_category}</span>,
    },
    {
      header: 'Transaction ID',
      accessor: 'transaction_ref',
      cell: (row) => (
        <span className="font-mono text-xs text-text-muted">{row.transaction_ref || 'N/A'}</span>
      ),
    },
    {
      header: 'Paid Amount',
      accessor: 'amount_paid',
      cell: (row) => (
        <span className="font-semibold text-green-600">{formatCurrency(row.amount_paid)}</span>
      ),
    },
    {
      header: 'Status',
      accessor: 'payment_status',
      cell: (row) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(row.payment_status)}`}>
          {row.payment_status}
        </span>
      ),
    },
    {
      header: 'Download',
      accessor: 'actions',
      className: 'text-right',
      cellClassName: 'text-right',
      cell: (row) => <DownloadBtn row={row} />,
    },
  ];

  const columns = isStudent ? studentColumns : adminColumns;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-text">Receipts</h1>
          <p className="text-sm text-text-muted mt-1">
            {isStudent
              ? 'Your payment receipts and transaction history.'
              : 'All student payment receipts — most recent first.'}
          </p>
        </div>
        <div className="flex items-center gap-2 text-text-muted">
          <Receipt className="w-5 h-5" />
          <span className="text-sm font-medium">
            {receipts.length} receipt{receipts.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {receipts.length === 0 && !isLoading ? (
        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <FileText className="w-14 h-14 text-text-muted mb-4 opacity-40" />
          <p className="text-lg font-semibold text-text">No receipts found</p>
          <p className="text-sm text-text-muted mt-1">
            {isStudent
              ? 'Once a payment is recorded, your receipts will appear here.'
              : 'No payment receipts have been generated yet.'}
          </p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={receipts}
          total={total}
          page={page}
          limit={limit}
          onPageChange={total > limit ? setPage : undefined}
          isLoading={isLoading || isFetching}
        />
      )}
    </div>
  );
};

export default ReceiptListPage;
