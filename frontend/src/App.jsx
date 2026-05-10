import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import LoadingSpinner from './components/common/LoadingSpinner';
import AppRoutes from './routes/AppRoutes';

function App() {
  const { isInitialized } = useAuth();

  if (!isInitialized) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <AppRoutes />
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'dark:bg-slate-800 dark:text-white dark:border dark:border-slate-700',
          duration: 4000,
        }}
      />
    </>
  );
}

export default App;
