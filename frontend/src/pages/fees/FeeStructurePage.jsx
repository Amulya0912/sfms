import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useGetFeeStructuresQuery, useDeleteFeeStructureMutation, useCreateFeeStructureMutation, useUpdateFeeStructureMutation } from '../../store/api/feeApi';
import { useGetDepartmentsQuery, useGetAcademicYearsQuery } from '../../store/api/academicApi';
import { useGetFeeCategoriesQuery } from '../../store/api/feeApi';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import FormField from '../../components/common/FormField';
import { formatCurrency, formatDate } from '../../utils/formatters';

const FeeStructurePage = () => {
  const { data: response, isLoading } = useGetFeeStructuresQuery({});
  const { data: deptsData } = useGetDepartmentsQuery();
  const { data: yearsData } = useGetAcademicYearsQuery();
  const { data: categoriesData } = useGetFeeCategoriesQuery();

  const [createFeeStructure, { isLoading: isCreating }] = useCreateFeeStructureMutation();
  const [updateFeeStructure, { isLoading: isUpdating }] = useUpdateFeeStructureMutation();
  const [deleteFeeStructure, { isLoading: isDeleting }] = useDeleteFeeStructureMutation();

  const [modalState, setModalState] = useState({ isOpen: false, data: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
  const [formData, setFormData] = useState({});

  const structures = response?.data || [];

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        department_id: parseInt(formData.department_id, 10),
        academic_year_id: parseInt(formData.academic_year_id, 10),
        fee_category_id: parseInt(formData.fee_category_id, 10),
        amount: parseFloat(formData.amount),
      };

      if (modalState.data) {
        await updateFeeStructure({ id: modalState.data.id, ...payload }).unwrap();
        toast.success('Fee structure updated');
      } else {
        await createFeeStructure(payload).unwrap();
        toast.success('Fee structure created');
      }
      setModalState({ isOpen: false, data: null });
    } catch (error) {
      // Handled globally
    }
  };

  const handleDelete = async () => {
    try {
      await deleteFeeStructure(deleteModal.id).unwrap();
      toast.success('Fee structure deleted');
      setDeleteModal({ isOpen: false, id: null });
    } catch (error) {
      // Handled globally
    }
  };

  const openModal = (data = null) => {
    if (data) {
      setFormData({
        department_id: data.department_id,
        academic_year_id: data.academic_year_id,
        fee_category_id: data.fee_category_id,
        batch: data.batch,
        amount: data.amount,
        due_date: data.due_date ? data.due_date.split('T')[0] : '',
      });
    } else {
      setFormData({});
    }
    setModalState({ isOpen: true, data });
  };

  const columns = [
    { 
      header: 'Category', 
      accessor: 'fee_category_name',
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.fee_category_name}</span>
          <span className="text-xs text-text-muted">{row.fee_category_code}</span>
        </div>
      )
    },
    { 
      header: 'Target Audience', 
      accessor: 'audience',
      cell: (row) => (
        <div className="flex flex-col text-sm">
          <span>{row.department_code} • Batch {row.batch}</span>
          <span className="text-xs text-text-muted">{row.academic_year}</span>
        </div>
      )
    },
    { 
      header: 'Amount', 
      accessor: 'amount',
      className: 'font-semibold text-primary-600',
      cell: (row) => formatCurrency(row.amount)
    },
    { header: 'Due Date', accessor: 'due_date', cell: (row) => formatDate(row.due_date) },
    {
      header: 'Actions',
      accessor: 'actions',
      className: 'text-right',
      cellClassName: 'text-right',
      cell: (row) => (
        <div className="flex items-center justify-end gap-2">
          <button 
            onClick={() => openModal(row)}
            className="p-1.5 text-text-muted hover:text-blue-600 transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setDeleteModal({ isOpen: true, id: row.id })}
            className="p-1.5 text-text-muted hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text">Fee Structures</h1>
          <p className="text-sm text-text-muted">Manage fee allocations per department and batch.</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={structures}
        isLoading={isLoading}
        actions={
          <button onClick={() => openModal()} className="btn btn-primary whitespace-nowrap">
            <Plus className="w-4 h-4 mr-2" /> Add Structure
          </button>
        }
      />

      {/* Form Modal */}
      <Modal 
        isOpen={modalState.isOpen} 
        onClose={() => setModalState({ isOpen: false, data: null })}
        title={modalState.data ? "Edit Fee Structure" : "Create Fee Structure"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <FormField 
            label="Department" 
            type="select" 
            value={formData.department_id || ''}
            onChange={(e) => setFormData({...formData, department_id: e.target.value})}
            options={(deptsData?.data || []).map(d => ({ value: d.id, label: d.name }))}
            required 
          />
          <FormField 
            label="Academic Year" 
            type="select" 
            value={formData.academic_year_id || ''}
            onChange={(e) => setFormData({...formData, academic_year_id: e.target.value})}
            options={(yearsData?.data || []).map(y => ({ value: y.id, label: y.year_label }))}
            required 
          />
          <FormField 
            label="Fee Category" 
            type="select" 
            value={formData.fee_category_id || ''}
            onChange={(e) => setFormData({...formData, fee_category_id: e.target.value})}
            options={(categoriesData?.data || []).map(c => ({ value: c.id, label: c.name }))}
            required 
          />
          <FormField 
            label="Batch (Year)" 
            placeholder="e.g., 2024" 
            value={formData.batch || ''}
            onChange={(e) => setFormData({...formData, batch: e.target.value})}
            required 
          />
          <FormField 
            label="Amount (₹)" 
            type="number" 
            step="0.01"
            value={formData.amount || ''}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
            required 
          />
          <FormField 
            label="Due Date" 
            type="date" 
            value={formData.due_date || ''}
            onChange={(e) => setFormData({...formData, due_date: e.target.value})}
          />
          
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button type="button" onClick={() => setModalState({ isOpen: false, data: null })} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isCreating || isUpdating} className="btn btn-primary">
              {isCreating || isUpdating ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Fee Structure"
        message="Are you sure? This action cannot be undone."
        isDestructive={true}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default FeeStructurePage;
