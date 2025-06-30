import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { DataTable } from '../components/ui/DataTable';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { RoleGuard } from '../components/auth/RoleGuard';
import { useAppStore } from '../store/appStore';
import { useToast } from '../components/ui/Toast';
import { Payment } from '../types';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export function Payments() {
  const { payments, contracts, addPayment, updatePayment, deletePayment, loading } = useAppStore();
  const { showToast } = useToast();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [formData, setFormData] = useState({
    contractId: '',
    method: 'تحويل' as const,
    amount: 0,
    date: '',
    notes: '',
    status: 'مكتمل' as const,
  });

  const columns = [
    {
      key: 'contractId' as keyof Payment,
      header: 'العقد',
      render: (contractId: string) => {
        const contract = contracts.find(c => c.id === contractId);
        return contract?.contractNumber || 'غير معروف';
      },
    },
    {
      key: 'method' as keyof Payment,
      header: 'طريقة الدفع',
      sortable: true,
      render: (value: string) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          value === 'تحويل' ? 'bg-blue-100 text-blue-800' :
          value === 'شيك' ? 'bg-green-100 text-green-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: 'amount' as keyof Payment,
      header: 'المبلغ',
      sortable: true,
      render: (value: number) => `${value.toLocaleString()} درهم`,
    },
    {
      key: 'date' as keyof Payment,
      header: 'تاريخ الدفع',
      sortable: true,
      render: (value: string) => format(new Date(value), 'dd MMM yyyy', { locale: ar }),
    },
    {
      key: 'status' as keyof Payment,
      header: 'الحالة',
      sortable: true,
      render: (value: string) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          value === 'مكتمل' ? 'bg-green-100 text-green-800' :
          value === 'معلق' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: 'notes' as keyof Payment,
      header: 'الملاحظات',
      render: (value: string) => value || '-',
    },
    {
      key: 'id' as keyof Payment,
      header: 'الإجراءات',
      render: (_: string, payment: Payment) => (
        <div className="flex space-x-2 space-x-reverse">
          <RoleGuard allowedRoles={['admin', 'supervisor']}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(payment);
              }}
              className="text-blue-600 hover:text-blue-800"
            >
              <Edit className="w-4 h-4" />
            </button>
          </RoleGuard>
          <RoleGuard allowedRoles={['admin']}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(payment.id);
              }}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </RoleGuard>
        </div>
      ),
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingPayment) {
        await updatePayment(editingPayment.id, formData);
        showToast('success', 'تم تحديث الدفعة بنجاح');
      } else {
        await addPayment(formData);
        showToast('success', 'تم إضافة الدفعة بنجاح');
      }
      closeModal();
    } catch (error) {
      showToast('error', 'فشل في حفظ بيانات الدفعة');
    }
  };

  const handleEdit = (payment: Payment) => {
    setEditingPayment(payment);
    setFormData({
      contractId: payment.contractId,
      method: payment.method,
      amount: payment.amount,
      date: payment.date,
      notes: payment.notes,
      status: payment.status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الدفعة؟')) {
      try {
        await deletePayment(id);
        showToast('success', 'تم حذف الدفعة بنجاح');
      } catch (error) {
        showToast('error', 'فشل في حذف الدفعة');
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPayment(null);
    setFormData({
      contractId: '',
      method: 'تحويل',
      amount: 0,
      date: '',
      notes: '',
      status: 'مكتمل',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">المدفوعات</h1>
          <p className="text-gray-600 mt-1">تتبع جميع المعاملات المالية</p>
        </div>
        <RoleGuard allowedRoles={['admin', 'supervisor']}>
          <Button
            icon={Plus}
            onClick={() => setIsModalOpen(true)}
          >
            إضافة دفعة
          </Button>
        </RoleGuard>
      </div>

      <DataTable
        data={payments}
        columns={columns}
        loading={loading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingPayment ? 'تعديل الدفعة' : 'إضافة دفعة جديدة'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="العقد"
            value={formData.contractId}
            onChange={(e) => setFormData({ ...formData, contractId: e.target.value })}
            options={[
              { value: '', label: 'اختر عقد' },
              ...contracts.map(contract => ({ 
                value: contract.id, 
                label: `${contract.contractNumber} - ${contract.total.toLocaleString()} درهم` 
              }))
            ]}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="طريقة الدفع"
              value={formData.method}
              onChange={(e) => setFormData({ ...formData, method: e.target.value as any })}
              options={[
                { value: 'تحويل', label: 'تحويل بنكي' },
                { value: 'شيك', label: 'شيك' },
                { value: 'نقد', label: 'نقد' },
              ]}
            />
            <Input
              label="المبلغ (درهم)"
              type="number"
              step="0.01"
              value={formData.amount.toString()}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="تاريخ الدفع"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
            <Select
              label="الحالة"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              options={[
                { value: 'مكتمل', label: 'مكتمل' },
                { value: 'معلق', label: 'معلق' },
                { value: 'فاشل', label: 'فاشل' },
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الملاحظات
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div className="flex justify-end space-x-3 space-x-reverse pt-4">
            <Button variant="secondary" onClick={closeModal}>
              إلغاء
            </Button>
            <Button type="submit">
              {editingPayment ? 'تحديث' : 'إضافة'} الدفعة
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}