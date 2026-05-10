import React, { useState } from 'react';
import { Plus, Edit, Trash2, X, Eye, EyeOff, UserPlus, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  useGetUsersQuery,
  useGetRolesQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from '../../store/api/userApi';
import DataTable from '../../components/common/DataTable';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const EMPTY_FORM = {
  full_name: '',
  username: '',
  email: '',
  password: '',
  role_id: '',
  is_active: 1,
};

const validate = (form, isEdit) => {
  const errors = {};
  if (!form.full_name.trim()) errors.full_name = 'Full name is required';
  if (!form.username.trim()) errors.username = 'Username is required';
  else if (form.username.length < 3) errors.username = 'Username must be at least 3 characters';
  if (!form.email.trim()) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Invalid email format';
  if (!isEdit && !form.password) errors.password = 'Password is required';
  if (!isEdit && form.password && form.password.length < 6)
    errors.password = 'Password must be at least 6 characters';
  if (isEdit && form.password && form.password.length < 6)
    errors.password = 'New password must be at least 6 characters';
  if (!form.role_id) errors.role_id = 'Role is required';
  return errors;
};

const UserFormModal = ({ isOpen, onClose, editUser, roles, onCreate, onUpdate, isSaving }) => {
  const [form, setForm] = useState(editUser
    ? { ...editUser, password: '', role_id: String(editUser.role_id) }
    : EMPTY_FORM
  );
  const [errors, setErrors] = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const isEdit = !!editUser;

  React.useEffect(() => {
    if (isOpen) {
      setForm(editUser
        ? { ...editUser, password: '', role_id: String(editUser.role_id) }
        : EMPTY_FORM
      );
      setErrors({});
    }
  }, [isOpen, editUser]);

  const set = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => { const n = { ...e }; delete n[key]; return n; });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form, isEdit);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const payload = { ...form, role_id: parseInt(form.role_id, 10) };
    if (!payload.password) delete payload.password; // Don't send empty password on edit

    try {
      if (isEdit) {
        await onUpdate({ id: editUser.id, ...payload }).unwrap();
        toast.success('User updated successfully');
      } else {
        await onCreate(payload).unwrap();
        toast.success('User created successfully');
      }
      onClose();
    } catch (err) {
      // Handled by global interceptor
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-lg border border-border animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
              {isEdit ? <ShieldCheck className="w-4 h-4 text-primary-600 dark:text-primary-400" /> : <UserPlus className="w-4 h-4 text-primary-600 dark:text-primary-400" />}
            </div>
            <h2 className="text-lg font-semibold text-text">{isEdit ? 'Edit User' : 'Add New Member'}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-text-muted transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-text mb-1">Full Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.full_name}
              onChange={(e) => set('full_name', e.target.value)}
              placeholder="e.g. Ramesh Kumar"
              className={`input-field w-full ${errors.full_name ? 'border-red-400' : ''}`}
            />
            {errors.full_name && <p className="text-xs text-red-500 mt-1">{errors.full_name}</p>}
          </div>

          {/* Username + Email */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1">Username <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => set('username', e.target.value)}
                placeholder="e.g. rameshhk"
                disabled={isEdit}
                className={`input-field w-full ${isEdit ? 'opacity-60 cursor-not-allowed' : ''} ${errors.username ? 'border-red-400' : ''}`}
              />
              {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">Email <span className="text-red-500">*</span></label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                placeholder="email@sfms.edu"
                className={`input-field w-full ${errors.email ? 'border-red-400' : ''}`}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-text mb-1">
              Password {isEdit ? <span className="text-text-muted font-normal">(leave blank to keep current)</span> : <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => set('password', e.target.value)}
                placeholder={isEdit ? '••••••••' : 'Min 6 characters'}
                className={`input-field w-full pr-10 ${errors.password ? 'border-red-400' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
              >
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </div>

          {/* Role + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1">Role <span className="text-red-500">*</span></label>
              <select
                value={form.role_id}
                onChange={(e) => set('role_id', e.target.value)}
                className={`input-field w-full ${errors.role_id ? 'border-red-400' : ''}`}
              >
                <option value="">Select role...</option>
                {(roles || []).map((r) => (
                  <option key={r.id} value={r.id} className="capitalize">
                    {r.name.replace('_', ' ')}
                  </option>
                ))}
              </select>
              {errors.role_id && <p className="text-xs text-red-500 mt-1">{errors.role_id}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">Status</label>
              <select
                value={form.is_active}
                onChange={(e) => set('is_active', parseInt(e.target.value, 10))}
                className="input-field w-full"
              >
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2 border-t border-border mt-2">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isSaving} className="btn btn-primary">
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </span>
              ) : isEdit ? 'Save Changes' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const UserManagementPage = () => {
  const { data: response, isLoading } = useGetUsersQuery();
  const { data: rolesResponse } = useGetRolesQuery();
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const [modal, setModal] = useState({ isOpen: false, editUser: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

  const users = response?.data || [];
  const roles = rolesResponse?.data || rolesResponse || [];

  const handleDelete = async () => {
    try {
      await deleteUser(deleteModal.id).unwrap();
      toast.success('User deactivated successfully');
      setDeleteModal({ isOpen: false, id: null });
    } catch (error) {
      // Handled globally
    }
  };

  const openAdd = () => setModal({ isOpen: true, editUser: null });
  const openEdit = (user) => setModal({ isOpen: true, editUser: user });
  const closeModal = () => setModal({ isOpen: false, editUser: null });

  const columns = [
    { header: 'Username', accessor: 'username', className: 'font-medium font-mono' },
    { header: 'Full Name', accessor: 'full_name' },
    { header: 'Email', accessor: 'email', className: 'text-text-muted' },
    {
      header: 'Role',
      accessor: 'role',
      cell: (row) => (
        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 uppercase">
          {row.role?.replace('_', ' ')}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'is_active',
      cell: (row) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
          row.is_active
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
        }`}>
          {row.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      className: 'text-right',
      cellClassName: 'text-right',
      cell: (row) => (
        <div className="flex items-center justify-end gap-1">
          {/* Edit — allow for all but protect super_admin self-lock */}
          <button
            onClick={() => openEdit(row)}
            className="p-1.5 text-text-muted hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
            title="Edit User"
          >
            <Edit className="w-4 h-4" />
          </button>
          {row.role !== 'super_admin' && (
            <button
              onClick={() => setDeleteModal({ isOpen: true, id: row.id })}
              className="p-1.5 text-text-muted hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
              title="Deactivate"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text">User Management</h1>
          <p className="text-sm text-text-muted">Manage administrators, accountants, staff, and students.</p>
        </div>
        <button onClick={openAdd} className="btn btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add New Member
        </button>
      </div>

      <DataTable
        columns={columns}
        data={users}
        isLoading={isLoading}
      />

      {/* Add / Edit Modal */}
      <UserFormModal
        isOpen={modal.isOpen}
        onClose={closeModal}
        editUser={modal.editUser}
        roles={roles}
        onCreate={createUser}
        onUpdate={updateUser}
        isSaving={isCreating || isUpdating}
      />

      {/* Deactivate Confirm */}
      <ConfirmDialog
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        title="Deactivate User"
        message="Are you sure you want to deactivate this user? They will no longer be able to log in."
        isDestructive={true}
        isLoading={isDeleting}
        confirmText="Deactivate"
      />
    </div>
  );
};

export default UserManagementPage;
