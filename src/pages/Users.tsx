import React, { useState } from 'react';
import { Plus, Edit, Trash2, UserCog } from 'lucide-react';
import { DataTable } from '../components/ui/DataTable';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { useAppStore } from '../store/appStore';
import { useToast } from '../components/ui/Toast';
import { User } from '../types';

export function Users() {
  const { users, addUser, updateUser, deleteUser, loading } = useAppStore();
  const { showToast } = useToast();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'viewer' as const,
    name: '',
    email: '',
  });

  const columns = [
    {
      key: 'username' as keyof User,
      header: 'اسم المستخدم',
      sortable: true,
    },
    {
      key: 'name' as keyof User,
      header: 'الاسم الكامل',
      sortable: true,
    },
    {
      key: 'email' as keyof User,
      header: 'البريد الإلكتروني',
      sortable: true,
    },
    {
      key: 'role' as keyof User,
      header: 'الدور',
      sortable: true,
      render: (value: string) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          value === 'admin' ? 'bg-red-100 text-red-800' :
          value === 'supervisor' ? 'bg-blue-100 text-blue-800' :
          'bg-green-100 text-green-800'
        }`}>
          {value === 'admin' ? 'مدير' : value === 'supervisor' ? 'مشرف' : 'مستخدم'}
        </span>
      ),
    },
    {
      key: 'id' as keyof User,
      header: 'الإجراءات',
      render: (_: string, user: User) => (
        <div className="flex space-x-2 space-x-reverse">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(user);
            }}
            className="text-blue-600 hover:text-blue-800"
            title="تعديل"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(user.id);
            }}
            className="text-red-600 hover:text-red-800"
            title="حذف"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingUser) {
        await updateUser(editingUser.id, formData);
        showToast('success', 'تم تحديث المستخدم بنجاح');
      } else {
        await addUser(formData);
        showToast('success', 'تم إضافة المستخدم بنجاح');
      }
      closeModal();
    } catch (error) {
      showToast('error', 'فشل في حفظ بيانات المستخدم');
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      password: '', // Don't show existing password
      role: user.role,
      name: user.name,
      email: user.email,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      try {
        await deleteUser(id);
        showToast('success', 'تم حذف المستخدم بنجاح');
      } catch (error) {
        showToast('error', 'فشل في حذف المستخدم');
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({
      username: '',
      password: '',
      role: 'viewer',
      name: '',
      email: '',
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
            <UserCog className="w-6 h-6 sm:w-8 sm:h-8 ml-2" />
            إدارة المستخدمين
          </h1>
          <p className="text-gray-600 mt-1 text-sm">إدارة مستخدمي النظام وصلاحياتهم</p>
        </div>
        <Button
          icon={Plus}
          onClick={() => setIsModalOpen(true)}
          size="sm"
          className="w-full sm:w-auto"
        >
          إضافة مستخدم
        </Button>
      </div>

      <DataTable
        data={users}
        columns={columns}
        loading={loading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingUser ? 'تعديل المستخدم' : 'إضافة مستخدم جديد'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="اسم المستخدم"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              disabled={!!editingUser}
            />
            <Input
              label={editingUser ? 'كلمة المرور الجديدة (اتركها فارغة للاحتفاظ بالحالية)' : 'كلمة المرور'}
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required={!editingUser}
            />
          </div>

          <Input
            label="الاسم الكامل"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Input
            label="البريد الإلكتروني"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          <Select
            label="الدور"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
            options={[
              { value: 'viewer', label: 'مستخدم (قراءة فقط)' },
              { value: 'supervisor', label: 'مشرف (قراءة وكتابة)' },
              { value: 'admin', label: 'مدير (صلاحيات كاملة)' },
            ]}
          />

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">صلاحيات الأدوار:</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li><strong>مستخدم:</strong> عرض البيانات فقط</li>
              <li><strong>مشرف:</strong> عرض وإضافة وتعديل البيانات</li>
              <li><strong>مدير:</strong> جميع الصلاحيات + حذف البيانات وإدارة المستخدمين</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 sm:space-x-reverse pt-4">
            <Button variant="secondary" onClick={closeModal} className="w-full sm:w-auto">
              إلغاء
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              {editingUser ? 'تحديث' : 'إضافة'} المستخدم
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}