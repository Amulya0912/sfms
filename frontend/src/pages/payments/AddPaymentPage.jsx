import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCreatePaymentMutation } from '../../store/api/paymentApi';
import { useGetStudentsQuery } from '../../store/api/studentApi';
import { useGetFeeStructuresQuery } from '../../store/api/feeApi'; // actually we need student specific fees
import { axiosInstance } from '../../api/axios';
import FormField from '../../components/common/FormField';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { PAYMENT_METHODS } from '../../utils/constants';

const AddPaymentPage = () => {
  const navigate = useNavigate();
  const [createPayment, { isLoading: isCreating }] = useCreatePaymentMutation();
  
  const [studentId, setStudentId] = useState('');
  const [selectedFeeId, setSelectedFeeId] = useState('');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('Cash');
  const [ref, setRef] = useState('');

  // Fetch students for dropdown
  const { data: studentsData } = useGetStudentsQuery({ limit: 1000 });
  
  // Fetch specific student's fee structures
  const [studentFees, setStudentFees] = useState([]);
  const [isLoadingFees, setIsLoadingFees] = useState(false);

  React.useEffect(() => {
    if (studentId) {
      setIsLoadingFees(true);
      axiosInstance.get(`/fee-structures/student/${studentId}`)
        .then(res => setStudentFees(res.data || []))
        .finally(() => setIsLoadingFees(false));
    } else {
      setStudentFees([]);
    }
  }, [studentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPayment({
        student_id: parseInt(studentId, 10),
        fee_structure_id: parseInt(selectedFeeId, 10),
        amount_paid: parseFloat(amount),
        payment_method: method,
        transaction_ref: ref,
      }).unwrap();
      toast.success('Payment processed successfully');
      navigate('/payments');
    } catch (error) {
      // Handled by global interceptor
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/payments')} className="p-2 hover:bg-slate-100 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-text">Process New Payment</h1>
          <p className="text-sm text-text-muted">Record a student fee payment and auto-generate a receipt.</p>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField
            label="Select Student"
            type="select"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            options={(studentsData?.data || []).map(s => ({ value: s.id, label: `${s.student_id} - ${s.first_name} ${s.last_name}` }))}
            required
          />

          {isLoadingFees ? (
            <div className="py-4 flex justify-center"><LoadingSpinner /></div>
          ) : studentFees.length > 0 ? (
            <div className="space-y-4">
              <FormField
                label="Select Fee Category"
                type="select"
                value={selectedFeeId}
                onChange={(e) => setSelectedFeeId(e.target.value)}
                options={studentFees.map(f => ({ value: f.id, label: `${f.fee_category_name} (Remaining: ₹${f.remaining})` }))}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Amount to Pay (₹)"
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
                <FormField
                  label="Payment Method"
                  type="select"
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  options={PAYMENT_METHODS.map(m => ({ value: m, label: m }))}
                  required
                />
              </div>

              {method !== 'Cash' && (
                <FormField
                  label="Transaction Reference ID"
                  placeholder="e.g., UTR number"
                  value={ref}
                  onChange={(e) => setRef(e.target.value)}
                  required
                />
              )}

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => navigate('/payments')} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={isCreating} className="btn btn-primary flex items-center gap-2">
                  {isCreating ? <LoadingSpinner size="sm" /> : <CreditCard className="w-4 h-4" />}
                  Process Payment
                </button>
              </div>
            </div>
          ) : studentId ? (
            <p className="text-text-muted text-sm p-4 bg-slate-50 rounded-lg text-center">
              No fee structures assigned to this student.
            </p>
          ) : null}
        </form>
      </div>
    </div>
  );
};

export default AddPaymentPage;
