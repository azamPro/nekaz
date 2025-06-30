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
import { Project } from '../types';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export function Projects() {
  const { projects, clients, addProject, updateProject, deleteProject, loading } = useAppStore();
  const { showToast } = useToast();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'تركيب' as const,
    clientId: '',
    status: 'نشط' as const,
    startDate: '',
    endDate: '',
    description: '',
  });

  const columns = [
    {
      key: 'name' as keyof Project,
      header: 'اسم المشروع',
      sortable: true,
    },
    {
      key: 'type' as keyof Project,
      header: 'النوع',
      sortable: true,
      render: (value: string) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          value === 'تركيب' ? 'bg-blue-100 text-blue-800' :
          value === 'صيانة' ? 'bg-green-100 text-green-800' :
          'bg-orange-100 text-orange-800'
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: 'clientId' as keyof Project,
      header: 'العميل',
      render: (clientId: string) => {
        const client = clients.find(c => c.id === clientId);
        return client?.name || 'غير معروف';
      },
    },
    {
      key: 'status' as keyof Project,
      header: 'الحالة',
      sortable: true,
      render: (value: string) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          value === 'مكتمل' ? 'bg-green-100 text-green-800' :
          value === 'قيد التنفيذ' ? 'bg-blue-100 text-blue-800' :
          value === 'نشط' ? 'bg-green-100 text-green-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: 'startDate' as keyof Project,
      header: 'تاريخ البداية',
      sortable: true,
      render: (value: string) => format(new Date(value), 'dd MMM yyyy', { locale: ar }),
    },
    {
      key: 'endDate' as keyof Project,
      header: 'تاريخ النهاية',
      sortable: true,
      render: (value: string) => format(new Date(value), 'dd MMM yyyy', { locale: ar }),
    },
    {
      key: 'id' as keyof Project,
      header: 'الإجراءات',
      render: (_: string, project: Project) => (
        <div className="flex space-x-2 space-x-reverse">
          <RoleGuard allowedRoles={['admin', 'supervisor']}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(project);
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
                handleDelete(project.id);
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
      if (editingProject) {
        await updateProject(editingProject.id, formData);
        showToast('success', 'تم تحديث المشروع بنجاح');
      } else {
        await addProject(formData);
        showToast('success', 'تم إضافة المشروع بنجاح');
      }
      closeModal();
    } catch (error) {
      showToast('error', 'فشل في حفظ بيانات المشروع');
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      type: project.type,
      clientId: project.clientId,
      status: project.status,
      startDate: project.startDate,
      endDate: project.endDate,
      description: project.description,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المشروع؟')) {
      try {
        await deleteProject(id);
        showToast('success', 'تم حذف المشروع بنجاح');
      } catch (error) {
        showToast('error', 'فشل في حذف المشروع');
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setFormData({
      name: '',
      type: 'تركيب',
      clientId: '',
      status: 'نشط',
      startDate: '',
      endDate: '',
      description: '',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">المشاريع</h1>
          <p className="text-gray-600 mt-1">إدارة جميع مشاريع المصاعد</p>
        </div>
        <RoleGuard allowedRoles={['admin', 'supervisor']}>
          <Button
            icon={Plus}
            onClick={() => setIsModalOpen(true)}
          >
            إضافة مشروع
          </Button>
        </RoleGuard>
      </div>

      <DataTable
        data={projects}
        columns={columns}
        loading={loading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingProject ? 'تعديل المشروع' : 'إضافة مشروع جديد'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="اسم المشروع"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="النوع"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              options={[
                { value: 'تركيب', label: 'تركيب' },
                { value: 'صيانة', label: 'صيانة' },
                { value: 'إصلاح', label: 'إصلاح' },
              ]}
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

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="الحالة"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              options={[
                { value: 'نشط', label: 'نشط' },
                { value: 'قيد التنفيذ', label: 'قيد التنفيذ' },
                { value: 'مكتمل', label: 'مكتمل' },
                { value: 'معلق', label: 'معلق' },
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="تاريخ البداية"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
            <Input
              label="تاريخ النهاية"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الوصف
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 space-x-reverse pt-4">
            <Button variant="secondary" onClick={closeModal}>
              إلغاء
            </Button>
            <Button type="submit">
              {editingProject ? 'تحديث' : 'إضافة'} المشروع
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}