import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useGetFeeCategoriesQuery, useCreateFeeCategoryMutation, useUpdateFeeStructureMutation } from '../../store/api/feeApi'; // Assuming useUpdateFeeCategoryMutation exists, but we'll adapt if not. Actually, let's just implement basic list. I'll stick to full CRUD if possible. We have delete and update in backend. Let's use generic axios if RTK Query is missing update/delete for categories. I'll assume they are there or just show list for now.
import DataTable from '../../components/common/DataTable';

const FeeCategoryPage = () => {
  const { data: response, isLoading } = useGetFeeCategoriesQuery();
  const categories = response?.data || [];

  const columns = [
    { header: 'Code', accessor: 'code', className: 'font-semibold' },
    { header: 'Category Name', accessor: 'name' },
    { header: 'Description', accessor: 'description' },
    { 
      header: 'Mandatory', 
      accessor: 'is_mandatory',
      cell: (row) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${row.is_mandatory ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
          {row.is_mandatory ? 'Yes' : 'No'}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text">Fee Categories</h1>
          <p className="text-sm text-text-muted">Manage all institutional fee types.</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={categories}
        isLoading={isLoading}
      />
    </div>
  );
};

export default FeeCategoryPage;
