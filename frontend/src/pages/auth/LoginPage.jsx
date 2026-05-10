import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { GraduationCap, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';
import FormField from '../../components/common/FormField';
import { useAuth } from '../../hooks/useAuth';

const loginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const user = await login(data);
      toast.success(`Welcome back, ${user.full_name}!`);
      
      const from = location.state?.from?.pathname || (user.role === 'student' ? '/my-fees' : '/dashboard');
      navigate(from, { replace: true });
    } catch (error) {
      // Error is handled by axios interceptor toast
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="flex flex-col items-center">
          <div className="h-16 w-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-500 rounded-2xl flex items-center justify-center mb-4">
            <GraduationCap className="h-10 w-10" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-text text-center">
            Student Fee Management
          </h2>
          <p className="mt-2 text-sm text-text-muted text-center max-w-sm">
            Sign in to your account to manage fees, payments, and academic records.
          </p>
        </div>

        <div className="card shadow-xl p-8">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <FormField
              label="Username"
              type="text"
              placeholder="Enter your username"
              {...register('username')}
              error={errors.username}
              disabled={isLoading}
            />

            <FormField
              label="Password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              error={errors.password}
              disabled={isLoading}
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-border text-primary-600 focus:ring-primary-500 bg-surface"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-text-muted">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full h-11 text-base flex justify-center items-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign in
                </>
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center text-xs text-text-muted">
            <p>Demo Credentials:</p>
            <p>Admin: admin / password123</p>
            <p>Accountant: accountant1 / password123</p>
            <p>Student: student1 / password123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
