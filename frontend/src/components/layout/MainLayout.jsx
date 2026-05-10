import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorBoundary from '../common/ErrorBoundary';

const MainLayout = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex flex-1 flex-col overflow-hidden w-full">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <ErrorBoundary>
            <Suspense fallback={
              <div className="flex h-full items-center justify-center">
                <LoadingSpinner size="lg" />
              </div>
            }>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
