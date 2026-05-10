import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';

import { useGetStudentByIdQuery, useCreateStudentMutation, useUpdateStudentMutation } from '../../store/api/studentApi';
import { useGetDepartmentsQuery, useGetAcademicYearsQuery } from '../../store/api/academicApi';
import FormField from '../../components/common/FormField';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { GENDERS } from '../../utils/constants';

const studentSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(100),
  last_name: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  gender: z.enum(['Male', 'Female', 'Other']),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  address: z.string().optional(),
  department_id: z.string().min(1, 'Department is required'),
  academic_year_id: z.string().min(1, 'Academic year is required'),
  batch: z.string().min(1, 'Batch is required'),
  admission_date: z.string().min(1, 'Admission date is required'),
});

const StudentFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const { data: studentData, isLoading: isLoadingStudent } = useGetStudentByIdQuery(id, { skip: !isEditMode });
  const { data: deptsData } = useGetDepartmentsQuery();
  const { data: yearsData } = useGetAcademicYearsQuery();

  const [createStudent, { isLoading: isCreating }] = useCreateStudentMutation();
  const [updateStudent, { isLoading: isUpdating }] = useUpdateStudentMutation();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      gender: 'Male',
      admission_date: new Date().toISOString().split('T')[0],
    }
  });

  useEffect(() => {
    if (isEditMode && studentData?.data) {
      const s = studentData.data;
      reset({
        first_name: s.first_name,
        last_name: s.last_name,
        email: s.email,
        phone: s.phone || '',
        gender: s.gender,
        date_of_birth: s.date_of_birth ? s.date_of_birth.split('T')[0] : '',
        address: s.address || '',
        department_id: s.department_id.toString(),
        academic_year_id: s.academic_year_id.toString(),
        batch: s.batch,
        admission_date: s.admission_date ? s.admission_date.split('T')[0] : '',
      });
    }
  }, [isEditMode, studentData, reset]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        department_id: parseInt(data.department_id, 10),
        academic_year_id: parseInt(data.academic_year_id, 10),
      };

      if (isEditMode) {
        await updateStudent({ id, ...payload }).unwrap();
        toast.success('Student updated successfully');
      } else {
        await createStudent(payload).unwrap();
        toast.success('Student created successfully');
      }
      navigate('/students');
    } catch (error) {
      // Handled globally
    }
  };

  if (isEditMode && isLoadingStudent) {
    return <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>;
  }

  const deptOptions = (deptsData?.data || []).map(d => ({ value: d.id, label: `${d.code} - ${d.name}` }));
  const yearOptions = (yearsData?.data || []).map(y => ({ value: y.id, label: y.year_label }));
  const genderOptions = GENDERS.map(g => ({ value: g, label: g }));

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/students')}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-text">
            {isEditMode ? 'Edit Student' : 'Add New Student'}
          </h1>
          <p className="text-sm text-text-muted">
            {isEditMode ? 'Update student information and academic details.' : 'Register a new student into the system.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card space-y-6">
          <h3 className="text-lg font-semibold border-b border-border pb-2">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="First Name" {...register('first_name')} error={errors.first_name} required />
            <FormField label="Last Name" {...register('last_name')} error={errors.last_name} required />
            <FormField label="Email" type="email" {...register('email')} error={errors.email} required />
            <FormField label="Phone Number" {...register('phone')} error={errors.phone} />
            <FormField label="Gender" type="select" options={genderOptions} {...register('gender')} error={errors.gender} required />
            <FormField label="Date of Birth" type="date" {...register('date_of_birth')} error={errors.date_of_birth} required />
            <div className="md:col-span-2">
              <FormField label="Address" type="textarea" {...register('address')} error={errors.address} />
            </div>
          </div>
        </div>

        <div className="card space-y-6">
          <h3 className="text-lg font-semibold border-b border-border pb-2">Academic Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Department" type="select" options={deptOptions} {...register('department_id')} error={errors.department_id} required />
            <FormField label="Academic Year" type="select" options={yearOptions} {...register('academic_year_id')} error={errors.academic_year_id} required />
            <FormField label="Batch (Year)" placeholder="e.g., 2024" {...register('batch')} error={errors.batch} required />
            <FormField label="Admission Date" type="date" {...register('admission_date')} error={errors.admission_date} required />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => navigate('/students')} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={isCreating || isUpdating} className="btn btn-primary flex items-center gap-2">
            {(isCreating || isUpdating) ? <LoadingSpinner size="sm" /> : <Save className="w-4 h-4" />}
            {isEditMode ? 'Save Changes' : 'Create Student'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentFormPage;
