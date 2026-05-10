import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, Filter, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useGetStudentsQuery, useDeleteStudentMutation } from '../../store/api/studentApi';
import { useGetDepartmentsQuery, useGetAcademicYearsQuery } from '../../store/api/academicApi';
import DataTable from '../../components/common/DataTable';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { formatCurrency, getStatusColor } from '../../utils/formatters';

const FEE_STATUS_OPTIONS = [
  { value: '', label: 'All Students' },
  { value: 'paid', label: 'Paid' },
  { value: 'unpaid', label: 'Unpaid' },
  { value: 'partial', label: 'Partially Paid' },
];

const StudentListPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [feeStatus, setFeeStatus] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [academicYearId, setAcademicYearId] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
  const limit = 10;

  const { data: response, isLoading, isFetching } = useGetStudentsQuery({
    page, limit, search,
    fee_status: feeStatus || undefined,
    department_id: departmentId || undefined,
    academic_year_id: academicYearId || undefined,
  });
  const [deleteStudent, { isLoading: isDeleting }] = useDeleteStudentMutation();
  const { data: deptResponse } = useGetDepartmentsQuery();
  const { data: yearResponse } = useGetAcademicYearsQuery();

  const students = response?.data || [];
  const total = response?.pagination?.total || 0;
  const departments = deptResponse?.data || deptResponse || [];
  const academicYears = yearResponse?.data || yearResponse || [];

  const hasFilters = feeStatus || departmentId || academicYearId;

  const clearFilters = () => {
    setFeeStatus('');
    setDepartmentId('');
    setAcademicYearId('');
    setPage(1);
  };

  const handleDelete = async () => {
    try {
      await deleteStudent(deleteModal.id).unwrap();
      toast.success('Student deactivated successfully');
      setDeleteModal({ isOpen: false, id: null });
    } catch (error) {
      // Error handled by global interceptor
    }
  };

  const columns = [
    { header: 'ID', accessor: 'student_id', className: 'w-28 font-medium' },
    {
      header: 'Student',
      accessor: 'name',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
            {row.first_name?.charAt(0)}{row.last_name?.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{row.first_name} {row.last_name}</span>
            <span className="text-xs text-text-muted">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Academic Info',
      accessor: 'academic',
      cell: (row) => (
        <div className="flex flex-col text-sm">
          <span>{row.department_code} • {row.batch}</span>
          <span className="text-xs text-text-muted">{row.academic_year}</span>
        </div>
      ),
    },
    {
      header: 'Fee Status',
      accessor: 'fee',
      cell: (row) => {
        const pending = parseFloat(row.pending_balance || 0);
        const total = parseFloat(row.total_fee || 0);
        const status = pending <= 0 ? 'Paid' : (pending < total ? 'Partially Paid' : 'Unpaid');
        return (
          <div className="flex flex-col items-start gap-1">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getStatusColor(status)}`}>
              {status}
            </span>
            <span className="text-xs text-text-muted font-medium">Pending: {formatCurrency(row.pending_balance)}</span>
          </div>
        );
      },
    },
    {
      header: 'Actions',
      accessor: 'actions',
      className: 'text-right w-28',
      cellClassName: 'text-right',
      cell: (row) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => navigate(`/students/${row.id}`)}
            className="p-1.5 text-text-muted hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
            title="View Profile"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate(`/students/${row.id}/edit`)}
            className="p-1.5 text-text-muted hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteModal({ isOpen: true, id: row.id })}
            className="p-1.5 text-text-muted hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            title="Deactivate"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Students</h1>
          <p className="text-sm text-text-muted">Manage student records and academic details.</p>
        </div>
        <button
          onClick={() => navigate('/students/new')}
          className="btn btn-primary whitespace-nowrap"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Student
        </button>
      </div>

      {/* Filter Bar */}
      <div className="card p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-text-muted mr-1">
            <Filter className="w-4 h-4" />
            Filters:
          </div>

          {/* Fee Status */}
          <div className="flex flex-col gap-1 min-w-36">
            <label className="text-xs text-text-muted font-medium">Fee Status</label>
            <select
              value={feeStatus}
              onChange={(e) => { setFeeStatus(e.target.value); setPage(1); }}
              className="input-field text-sm py-1.5"
            >
              {FEE_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Department */}
          <div className="flex flex-col gap-1 min-w-44">
            <label className="text-xs text-text-muted font-medium">Department</label>
            <select
              value={departmentId}
              onChange={(e) => { setDepartmentId(e.target.value); setPage(1); }}
              className="input-field text-sm py-1.5"
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.code} — {d.name}</option>
              ))}
            </select>
          </div>

          {/* Academic Year */}
          <div className="flex flex-col gap-1 min-w-44">
            <label className="text-xs text-text-muted font-medium">Academic Year</label>
            <select
              value={academicYearId}
              onChange={(e) => { setAcademicYearId(e.target.value); setPage(1); }}
              className="input-field text-sm py-1.5"
            >
              <option value="">All Years</option>
              {academicYears.map((y) => (
                <option key={y.id} value={y.id}>{y.year_label} ({y.batch_year})</option>
              ))}
            </select>
          </div>

          {/* Clear */}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-text-muted hover:text-red-600 border border-border rounded-lg hover:border-red-300 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
        </div>

        {/* Active filter chips */}
        {hasFilters && (
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border">
            {feeStatus && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-medium">
                Status: {FEE_STATUS_OPTIONS.find((o) => o.value === feeStatus)?.label}
              </span>
            )}
            {departmentId && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-medium">
                Dept: {departments.find((d) => String(d.id) === departmentId)?.code}
              </span>
            )}
            {academicYearId && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-medium">
                Year: {academicYears.find((y) => String(y.id) === academicYearId)?.year_label}
              </span>
            )}
          </div>
        )}
      </div>

      <DataTable
        columns={columns}
        data={students}
        total={total}
        page={page}
        limit={limit}
        onPageChange={setPage}
        onSearch={(s) => { setSearch(s); setPage(1); }}
        isLoading={isLoading || isFetching}
      />

      <ConfirmDialog
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        title="Deactivate Student"
        message="Are you sure you want to deactivate this student? This action will mark them as inactive."
        isDestructive={true}
        isLoading={isDeleting}
        confirmText="Deactivate"
      />
    </div>
  );
};

export default StudentListPage;
