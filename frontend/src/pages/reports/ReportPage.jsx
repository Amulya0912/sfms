import React, { useState } from 'react';
import { FileSpreadsheet, File as FilePdf } from 'lucide-react';
import { axiosInstance } from '../../api/axios';
import toast from 'react-hot-toast';
import FormField from '../../components/common/FormField';

const ReportPage = () => {
  const [reportType, setReportType] = useState('collections');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString());
  const [isExporting, setIsExporting] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());
  const months = [
    { value: '1', label: 'January' }, { value: '2', label: 'February' },
    { value: '3', label: 'March' }, { value: '4', label: 'April' },
    { value: '5', label: 'May' }, { value: '6', label: 'June' },
    { value: '7', label: 'July' }, { value: '8', label: 'August' },
    { value: '9', label: 'September' }, { value: '10', label: 'October' },
    { value: '11', label: 'November' }, { value: '12', label: 'December' },
  ];

  const handleExport = async (format) => {
    try {
      setIsExporting(true);
      const params = new URLSearchParams({ type: reportType, year, month });
      const url = `/reports/export/${format}?${params.toString()}`;
      
      const response = await axiosInstance.get(url, { responseType: 'blob' });
      const blobUrl = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = blobUrl;
      const extension = format === 'excel' ? 'xlsx' : 'pdf';
      link.setAttribute('download', `${reportType}_report_${year}_${month}.${extension}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(`${format.toUpperCase()} Exported successfully`);
    } catch (error) {
      toast.error('Failed to export report');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text">Reports & Analytics</h1>
        <p className="text-sm text-text-muted">Generate and export financial reports.</p>
      </div>

      <div className="card space-y-6">
        <h3 className="text-lg font-semibold border-b border-border pb-2">Export Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            label="Report Type"
            type="select"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            options={[
              { value: 'collections', label: 'Monthly Collections' },
              { value: 'pending', label: 'Pending Dues' },
            ]}
          />
          <FormField
            label="Year"
            type="select"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            options={years.map(y => ({ value: y, label: y }))}
          />
          {reportType === 'collections' && (
            <FormField
              label="Month"
              type="select"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              options={months}
            />
          )}
        </div>

        <div className="flex gap-4 pt-4 border-t border-border">
          <button 
            onClick={() => handleExport('excel')}
            disabled={isExporting}
            className="btn btn-primary flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white"
          >
            <FileSpreadsheet className="w-5 h-5" />
            Export to Excel
          </button>
          
          <button 
            onClick={() => handleExport('pdf')}
            disabled={isExporting}
            className="btn btn-primary flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white"
          >
            <FilePdf className="w-5 h-5" />
            Export to PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
