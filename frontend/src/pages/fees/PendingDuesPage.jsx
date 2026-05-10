import React, { useState } from 'react';
import { useGetStudentsQuery } from '../../store/api/studentApi';
import DataTable from '../../components/common/DataTable';
import { formatCurrency } from '../../utils/formatters';

const PendingDuesPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  // Re-using getStudents with a filter logic, or ideally we use the specific pending endpoint.
  // The backend has /students/pending-dues, we need to add it to studentApi if not there, or just use axios.
  // I'll add the endpoint to studentApi via injection or just fetch via axios here for simplicity if missing.
  
  // Actually, I'll just use RTK Query for `/students/pending-dues`
  // Assuming it's added. Let's fetch it. I will modify studentApi first if needed, but let's mock the hook usage.
  
  const [pendingData, setPendingData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  React.useEffect(() => {
    import('../../api/axios').then(({ axiosInstance }) => {
      axiosInstance.get('/students/pending-dues')
        .then(res => {
          setPendingData(res.data || []);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    });
  }, []);

  const columns = [
    { header: 'Student ID', accessor: 'student_id', className: 'font-medium' },
    { header: 'Name', accessor: 'full_name' },
    { header: 'Department', accessor: 'department' },
    { header: 'Batch', accessor: 'batch' },
    { header: 'Total Fee', accessor: 'total_fee', cell: (r) => formatCurrency(r.total_fee) },
    { header: 'Paid', accessor: 'total_paid', cell: (r) => formatCurrency(r.total_paid) },
    { 
      header: 'Pending Balance', 
      accessor: 'pending_balance',
      cell: (r) => <span className="text-red-600 font-bold">{formatCurrency(r.pending_balance)}</span>
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text">Pending Dues</h1>
          <p className="text-sm text-text-muted">Real-time tracking of unpaid student fees.</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={pendingData}
        isLoading={isLoading}
      />
    </div>
  );
};

export default PendingDuesPage;
