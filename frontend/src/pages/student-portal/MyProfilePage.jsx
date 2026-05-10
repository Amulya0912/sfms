import React from 'react';
import { User, GraduationCap, Phone, Mail, MapPin, Calendar, CreditCard, BookOpen } from 'lucide-react';
import { useGetMyProfileQuery } from '../../store/api/studentApi';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatCurrency, formatDate } from '../../utils/formatters';

const InfoRow = ({ label, value, className = '' }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-xs font-medium text-text-muted uppercase tracking-wide">{label}</span>
    <span className={`text-sm font-medium text-text ${className}`}>{value || '—'}</span>
  </div>
);

const SectionCard = ({ icon: Icon, title, children }) => (
  <div className="card">
    <div className="flex items-center gap-2 pb-4 mb-4 border-b border-border">
      <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
        <Icon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
      </div>
      <h2 className="font-semibold text-text">{title}</h2>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
      {children}
    </div>
  </div>
);

const MyProfilePage = () => {
  const { user } = useAuth();
  const { data: profileResponse, isLoading, isError } = useGetMyProfileQuery();
  const student = profileResponse?.data || profileResponse;

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text">My Profile</h1>
        <p className="text-sm text-text-muted mt-1">View your personal and academic information. Contact administration to make changes.</p>
      </div>

      {/* Profile Hero */}
      <div className="card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 flex items-center justify-center text-3xl font-bold flex-shrink-0">
            {user?.full_name?.charAt(0)?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-text">
              {student ? `${student.first_name} ${student.last_name}` : user?.full_name}
            </h2>
            <p className="text-text-muted text-sm mt-0.5">{user?.email}</p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {student?.student_id && (
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-mono">
                  {student.student_id}
                </span>
              )}
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 uppercase">
                Student
              </span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                student?.is_active !== false
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {student?.is_active !== false ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          {/* Financial Quick Summary */}
          {student && (
            <div className="flex flex-row sm:flex-col gap-4 sm:gap-2 sm:text-right flex-shrink-0 mt-3 sm:mt-0">
              <div>
                <p className="text-xs text-text-muted">Total Fee</p>
                <p className="font-bold text-text text-base">{formatCurrency(student.total_fee)}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted">Pending</p>
                <p className={`font-bold text-base ${parseFloat(student.pending_balance) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {formatCurrency(student.pending_balance)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {isError || !student ? (
        <div className="card text-center py-8 text-text-muted text-sm">
          <p>Extended student details could not be loaded.</p>
          <p>Showing account-level information only.</p>
        </div>
      ) : (
        <>
          {/* Personal Details */}
          <SectionCard icon={User} title="Personal Details">
            <InfoRow label="First Name" value={student.first_name} />
            <InfoRow label="Last Name" value={student.last_name} />
            <InfoRow label="Email Address" value={student.email} />
            <InfoRow label="Phone Number" value={student.phone} />
            <InfoRow label="Gender" value={student.gender} />
            <InfoRow label="Date of Birth" value={student.date_of_birth ? formatDate(student.date_of_birth) : null} />
            <div className="sm:col-span-2">
              <InfoRow label="Address" value={student.address} />
            </div>
          </SectionCard>

          {/* Academic Details */}
          <SectionCard icon={GraduationCap} title="Academic Details">
            <InfoRow label="Student ID / Roll Number" value={student.student_id} className="font-mono" />
            <InfoRow label="Department" value={student.department_name} />
            <InfoRow label="Academic Year" value={student.academic_year} />
            <InfoRow label="Batch" value={student.batch} />
            <InfoRow label="Admission Date" value={student.admission_date ? formatDate(student.admission_date) : null} />
          </SectionCard>

          {/* Financial Summary */}
          <div className="card">
            <div className="flex items-center gap-2 pb-4 mb-4 border-b border-border">
              <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              </div>
              <h2 className="font-semibold text-text">Financial Summary</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl border border-border p-4 text-center">
                <p className="text-xs text-text-muted uppercase tracking-wide mb-1">Total Fee</p>
                <p className="text-xl font-bold text-text">{formatCurrency(student.total_fee)}</p>
              </div>
              <div className="rounded-xl border border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-900/10 p-4 text-center">
                <p className="text-xs text-green-600 dark:text-green-400 uppercase tracking-wide mb-1">Total Paid</p>
                <p className="text-xl font-bold text-green-700 dark:text-green-400">{formatCurrency(student.total_paid)}</p>
              </div>
              <div className={`rounded-xl border p-4 text-center ${
                parseFloat(student.pending_balance) > 0
                  ? 'border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10'
                  : 'border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-900/10'
              }`}>
                <p className={`text-xs uppercase tracking-wide mb-1 ${
                  parseFloat(student.pending_balance) > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                }`}>Pending Balance</p>
                <p className={`text-xl font-bold ${
                  parseFloat(student.pending_balance) > 0 ? 'text-red-700 dark:text-red-400' : 'text-green-700 dark:text-green-400'
                }`}>{formatCurrency(student.pending_balance)}</p>
              </div>
            </div>
          </div>

          {/* Account Info */}
          <div className="card">
            <div className="flex items-center gap-2 pb-4 mb-4 border-b border-border">
              <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              </div>
              <h2 className="font-semibold text-text">Account Information</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
              <InfoRow label="Username" value={user?.username} />
              <InfoRow label="Account Created" value={user?.created_at ? formatDate(user.created_at) : null} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MyProfilePage;
