import React, { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import RoleBasedRoute from './RoleBasedRoute';
import { ROLES } from '../utils/constants';
import { useAuth } from '../hooks/useAuth';

// Smart index redirect based on role
const IndexRedirect = () => {
  const { user } = useAuth();
  return <Navigate to={user?.role === 'student' ? '/my-fees' : '/dashboard'} replace />;
};

// Lazy loading pages
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const DashboardPage = lazy(() => import('../pages/dashboard/DashboardPage'));

const StudentListPage = lazy(() => import('../pages/students/StudentListPage'));
const StudentFormPage = lazy(() => import('../pages/students/StudentFormPage'));

const FeeCategoryPage = lazy(() => import('../pages/fees/FeeCategoryPage'));
const FeeStructurePage = lazy(() => import('../pages/fees/FeeStructurePage'));
const PendingDuesPage = lazy(() => import('../pages/fees/PendingDuesPage'));

const PaymentListPage = lazy(() => import('../pages/payments/PaymentListPage'));
const AddPaymentPage = lazy(() => import('../pages/payments/AddPaymentPage'));

const ReceiptListPage = lazy(() => import('../pages/receipts/ReceiptListPage'));
const ReportPage = lazy(() => import('../pages/reports/ReportPage'));

const UserManagementPage = lazy(() => import('../pages/users/UserManagementPage'));
const MyFeesPage = lazy(() => import('../pages/student-portal/MyFeesPage'));
const MyProfilePage = lazy(() => import('../pages/student-portal/MyProfilePage'));

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route path="/" element={<MainLayout />}>
        <Route index element={<IndexRedirect />} />

        {/* Dashboard — NOT accessible by students */}
        <Route element={<RoleBasedRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ACCOUNTANT, ROLES.STAFF]} />}>
          <Route path="dashboard" element={<DashboardPage />} />
        </Route>

        {/* System Admin */}
        <Route element={<RoleBasedRoute allowedRoles={[ROLES.SUPER_ADMIN]} />}>
          <Route path="users" element={<UserManagementPage />} />
        </Route>

        {/* Admin / Staff Routes */}
        <Route element={<RoleBasedRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.STAFF]} />}>
          <Route path="students" element={<StudentListPage />} />
          <Route path="students/new" element={<StudentFormPage />} />
          <Route path="students/:id/edit" element={<StudentFormPage />} />
        </Route>

        {/* Finance Routes */}
        <Route element={<RoleBasedRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.STAFF, ROLES.ACCOUNTANT]} />}>
          <Route path="fee-categories" element={<FeeCategoryPage />} />
          <Route path="fee-structures" element={<FeeStructurePage />} />
          <Route path="pending-dues" element={<PendingDuesPage />} />
        </Route>

        <Route element={<RoleBasedRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ACCOUNTANT]} />}>
          <Route path="payments" element={<PaymentListPage />} />
          <Route path="payments/new" element={<AddPaymentPage />} />
          <Route path="reports" element={<ReportPage />} />
        </Route>

        {/* Receipts accessible by Admin, Accountant, Student */}
        <Route element={<RoleBasedRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ACCOUNTANT, ROLES.STUDENT]} />}>
          <Route path="receipts" element={<ReceiptListPage />} />
        </Route>

        {/* Student Portal */}
        <Route element={<RoleBasedRoute allowedRoles={[ROLES.STUDENT]} />}>
          <Route path="my-fees" element={<MyFeesPage />} />
          <Route path="profile" element={<MyProfilePage />} />
        </Route>

        <Route path="*" element={<IndexRedirect />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;

