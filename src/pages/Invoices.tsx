import React, { useState } from 'react';
import { Plus, Edit, Trash2, Download } from 'lucide-react';
import { DataTable } from '../components/ui/DataTable';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { RoleGuard } from '../components/auth/RoleGuard';
import { useAppStore } from '../store/appStore';
import { useToast } from '../components/ui/Toast';
import { Invoice } from '../types';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export function Invoices() {
  const { invoices, clients, addInvoice, updateInvoice, deleteInvoice, loading } = useAppStore();
  const { showToast } = useToast();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    clientId: '',
    serviceDescription: '',
    amount: 0,
    paymentMethod: 'تحويل' as const,
    date: '',
    status: 'معلق' as const,
  });

  const columns = [
    {
      key: 'invoiceNumber' as keyof Invoice,
      header: 'رقم الفاتورة',
      sortable: true,
    },
    {
      key: 'clientId' as keyof Invoice,
      header: 'العميل',
      render: (clientId: string) => {
        const client = clients.find(c => c.id === clientId);
        return client?.name || 'غير معروف';
      },
    },
    {
      key: 'serviceDescription' as keyof Invoice,
      header: 'وصف الخدمة',
    },
    {
      key: 'amount' as keyof Invoice,
      header: 'المبلغ',
      sortable: true,
      render: (value: number) => `${value.toLocaleString()} درهم`,
    },
    {
      key: 'paymentMethod' as keyof Invoice,
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
      key: 'date' as keyof Invoice,
      header: 'تاريخ الفاتورة',
      sortable: true,
      render: (value: string) => format(new Date(value), 'dd MMM yyyy', { locale: ar }),
    },
    {
      key: 'status' as keyof Invoice,
      header: 'الحالة',
      sortable: true,
      render: (value: string) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          value === 'مدفوع' ? 'bg-green-100 text-green-800' :
          value === 'معلق' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: 'id' as keyof Invoice,
      header: 'الإجراءات',
      render: (_: string, invoice: Invoice) => (
        <div className="flex space-x-2 space-x-reverse">
          <RoleGuard allowedRoles={['admin', 'supervisor']}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(invoice);
              }}
              className="text-blue-600 hover:text-blue-800"
              title="تعديل"
            >
              <Edit className="w-4 h-4" />
            </button>
          </RoleGuard>
          <RoleGuard allowedRoles={['admin']}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                showToast('success', 'تم تحميل ملف PDF للفاتورة');
              }}
              className="text-green-600 hover:text-green-800"
              title="تحميل PDF"
            >
              <Download className="w-4 h-4" />
            </button>
          </RoleGuard>
          <RoleGuard allowedRoles={['admin']}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(invoice.id);
              }}
              className="text-red-600 hover:text-red-800"
              title="حذف"
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
      if (editingInvoice) {
        await updateInvoice(editingInvoice.id, formData);
        showToast('success', 'تم تحديث الفاتورة بنجاح');
      } else {
        await addInvoice(formData);
        showToast('success', 'تم إنشاء الفاتورة بنجاح');
      }
      closeModal();
    } catch (error) {
      showToast('error', 'فشل في حفظ بيانات الفاتورة');
    }
  };

  const handleEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setFormData({
      invoiceNumber: invoice.invoiceNumber,
      clientId: invoice.clientId,
      serviceDescription: invoice.serviceDescription,
      amount: invoice.amount,
      paymentMethod: invoice.paymentMethod,
      date: invoice.date,
      status: invoice.status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الفاتورة؟')) {
      try {
        await deleteInvoice(id);
        showToast('success', 'تم حذف الفاتورة بنجاح');
      } catch (error) {
        showToast('error', 'فشل في حذف الفاتورة');
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingInvoice(null);
    setFormData({
      invoiceNumber: '',
      clientId: '',
      serviceDescription: '',
      amount: 0,
      paymentMethod: 'تحويل',
      date: '',
      status: 'معلق',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الفواتير</h1>
          <p className="text-gray-600 mt-1">إدارة وتتبع جميع الفواتير</p>
        </div>
        <RoleGuard allowedRoles={['admin', 'supervisor']}>
          <Button
            icon={Plus}
            onClick={() => setIsModalOpen(true)}
          >
            إنشاء فاتورة
          </Button>
        </RoleGuard>
      </div>

      <DataTable
        data={invoices}
        columns={columns}
        loading={loading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingInvoice ? 'تعديل الفاتورة' : 'إنشاء فاتورة جديدة'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="رقم الفاتورة"
              value={formData.invoiceNumber}
              onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
              required
            />
            <Select
              label="العميل"
              value={formData.clientId}
              onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
              options={[
                { value: '', label: 'اختر عميل' },
                ...clients.map(client => ({ value: client.id, label: client.name }))
              ]}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              وصف الخدمة
            </label>
            <textarea
              value={formData.serviceDescription}
              onChange={(e) => setFormData({ ...formData, serviceDescription: e.target.value })}
              rows={3}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="المبلغ (درهم)"
              type="number"
              step="0.01"
              value={formData.amount.toString()}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
              required
            />
            <Select
              label="طريقة الدفع"
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
              options={[
                { value: 'تحويل', label: 'تحويل بنكي' },
                { value: 'شيك', label: 'شيك' },
                { value: 'نقد', label: 'نقد' },
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="تاريخ الفاتورة"
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
                { value: 'معلق', label: 'معلق' },
                { value: 'مدفوع', label: 'مدفوع' },
                { value: 'متأخر', label: 'متأخر' },
              ]}
            />
          </div>

          <div className="flex justify-end space-x-3 space-x-reverse pt-4">
            <Button variant="secondary" onClick={closeModal}>
              إلغاء
            </Button>
            <Button type="submit">
              {editingInvoice ? 'تحديث' : 'إنشاء'} الفاتورة
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}