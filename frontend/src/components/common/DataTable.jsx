import React from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { cn } from './LoadingSpinner';
import { useDebounce } from '../../hooks/useDebounce';

const DataTable = ({
  columns,
  data,
  total,
  page,
  limit,
  onPageChange,
  onSearch,
  isLoading,
  actions,
  className
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  React.useEffect(() => {
    if (onSearch) {
      onSearch(debouncedSearch);
    }
  }, [debouncedSearch, onSearch]);

  const totalPages = Math.ceil((total || 0) / limit);

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Table Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        {onSearch && (
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-9"
            />
          </div>
        )}
        {actions && <div className="flex items-center gap-2 w-full sm:w-auto">{actions}</div>}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border bg-surface shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-border text-text-muted uppercase tracking-wider text-xs font-semibold">
            <tr>
              {columns.map((col, i) => (
                <th key={i} className={cn("px-6 py-4", col.className)}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <div className="flex justify-center"><div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>
                </td>
              </tr>
            ) : data?.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-text-muted">
                  No records found.
                </td>
              </tr>
            ) : (
              data?.map((row, rowIndex) => (
                <tr key={row.id || rowIndex} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className={cn("px-6 py-4", col.cellClassName)}>
                      {col.cell ? col.cell(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {total > 0 && onPageChange && (
        <div className="flex items-center justify-between px-2">
          <p className="text-sm text-text-muted">
            Showing <span className="font-medium">{Math.min((page - 1) * limit + 1, total)}</span> to <span className="font-medium">{Math.min(page * limit, total)}</span> of <span className="font-medium">{total}</span> results
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-sm font-medium">Page {page} of {totalPages}</span>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
