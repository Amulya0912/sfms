import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, Sun, Moon, Bell } from 'lucide-react';
import { toggleSidebar } from '../../store/slices/uiSlice';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
  const dispatch = useDispatch();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-surface/80 px-4 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="rounded-lg p-2 text-text-muted hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>
        <h2 className="text-lg font-semibold text-text hidden sm:block">
          Welcome back, {user?.full_name?.split(' ')[0]} 👋
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative rounded-full p-2 text-text-muted hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 flex h-2.5 w-2.5 rounded-full bg-red-500"></span>
        </button>
        
        <button 
          onClick={toggleTheme}
          className="rounded-full p-2 text-text-muted hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-400 font-bold ml-2">
          {user?.full_name?.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
};

export default Header;
