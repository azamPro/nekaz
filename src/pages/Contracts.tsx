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
import { Contract } from '../types';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export function Contracts() {
  const { contracts, clients, projects, addContract, updateContract, deleteContract, loading } = useAppStore();
  const { showToast } = useToast();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [formData, setFormData] = useState({
    contractNumber: '',
    type: 'تركيب' as const,
    projectId: '',
    clientId: '',
    contractDate: '',
    
    // Client details
    clientName: '',
    clientIdNumber: '',
    clientPhone: '',
    projectName: '',
    projectDuration: '',
    
    // Installation specific fields
    elevatorDetails: {
      elevatorCount: 1,
      capacity: '',
      stops: 0,
      speed: '',
      pricePerElevator: 0,
      vat: 0,
      totalPrice: 0,
      warrantyPeriod: '',
    },
    
    // Maintenance specific fields
    maintenanceDetails: {
      elevatorCount: 1,
      serviceLocation: '',
      visitCount: 0,
      contractValue: 0,
      startDateHijri: '',
      endDateHijri: '',
      firstPartyRepresentative: 'عبد الله بن محمد الروق',
      secondPartyRepresentative: '',
    },
    
    // Signatures and dates
    buyerName: '',
    buyerSignature: '',
    signatureDate: '',
    buyerStamp: '',
    
    status: 'نشط' as const,
  });

  const columns = [
    {
      key: 'contractNumber' as keyof Contract,
      header: 'رقم العقد',
      sortable: true,
    },
    {
      key: 'type' as keyof Contract,
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
      key: 'clientId' as keyof Contract,
      header: 'العميل',
      render: (clientId: string) => {
        const client = clients.find(c => c.id === clientId);
        return client?.name || 'غير معروف';
      },
    },
    {
      key: 'contractDate' as keyof Contract,
      header: 'تاريخ العقد',
      sortable: true,
      render: (value: string) => value ? format(new Date(value), 'dd MMM yyyy', { locale: ar }) : '-',
    },
    {
      key: 'status' as keyof Contract,
      header: 'الحالة',
      sortable: true,
      render: (value: string) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          value === 'نشط' ? 'bg-green-100 text-green-800' :
          value === 'منتهي' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: 'createdAt' as keyof Contract,
      header: 'تاريخ الإنشاء',
      sortable: true,
      render: (value: string) => format(new Date(value), 'dd MMM yyyy', { locale: ar }),
    },
    {
      key: 'id' as keyof Contract,
      header: 'الإجراءات',
      render: (_: string, contract: Contract) => (
        <div className="flex space-x-2 space-x-reverse">
          <RoleGuard allowedRoles={['admin', 'supervisor']}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(contract);
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
                showToast('success', 'تم إنشاء ملف PDF بنجاح');
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
                handleDelete(contract.id);
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
      if (editingContract) {
        await updateContract(editingContract.id, formData);
        showToast('success', 'تم تحديث العقد بنجاح');
      } else {
        await addContract(formData);
        showToast('success', 'تم إضافة العقد بنجاح');
      }
      closeModal();
    } catch (error) {
      showToast('error', 'فشل في حفظ بيانات العقد');
    }
  };

  const handleEdit = (contract: Contract) => {
    setEditingContract(contract);
    setFormData({
      contractNumber: contract.contractNumber,
      type: contract.type,
      projectId: contract.projectId,
      clientId: contract.clientId,
      contractDate: contract.contractDate,
      clientName: contract.clientName,
      clientIdNumber: contract.clientIdNumber,
      clientPhone: contract.clientPhone,
      projectName: contract.projectName,
      projectDuration: contract.projectDuration,
      elevatorDetails: contract.elevatorDetails || {
        elevatorCount: 1,
        capacity: '',
        stops: 0,
        speed: '',
        pricePerElevator: 0,
        vat: 0,
        totalPrice: 0,
        warrantyPeriod: '',
      },
      maintenanceDetails: contract.maintenanceDetails || {
        elevatorCount: 1,
        serviceLocation: '',
        visitCount: 0,
        contractValue: 0,
        startDateHijri: '',
        endDateHijri: '',
        firstPartyRepresentative: 'عبد الله بن محمد الروق',
        secondPartyRepresentative: '',
      },
      buyerName: contract.buyerName,
      buyerSignature: contract.buyerSignature || '',
      signatureDate: contract.signatureDate,
      buyerStamp: contract.buyerStamp || '',
      status: contract.status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا العقد؟')) {
      try {
        await deleteContract(id);
        showToast('success', 'تم حذف العقد بنجاح');
      } catch (error) {
        showToast('error', 'فشل في حذف العقد');
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingContract(null);
    setFormData({
      contractNumber: '',
      type: 'تركيب',
      projectId: '',
      clientId: '',
      contractDate: '',
      clientName: '',
      clientIdNumber: '',
      clientPhone: '',
      projectName: '',
      projectDuration: '',
      elevatorDetails: {
        elevatorCount: 1,
        capacity: '',
        stops: 0,
        speed: '',
        pricePerElevator: 0,
        vat: 0,
        totalPrice: 0,
        warrantyPeriod: '',
      },
      maintenanceDetails: {
        elevatorCount: 1,
        serviceLocation: '',
        visitCount: 0,
        contractValue: 0,
        startDateHijri: '',
        endDateHijri: '',
        firstPartyRepresentative: 'عبد الله بن محمد الروق',
        secondPartyRepresentative: '',
      },
      buyerName: '',
      buyerSignature: '',
      signatureDate: '',
      buyerStamp: '',
      status: 'نشط',
    });
  };

  // Auto-fill client details when client is selected
  React.useEffect(() => {
    if (formData.clientId) {
      const client = clients.find(c => c.id === formData.clientId);
      if (client) {
        setFormData(prev => ({
          ...prev,
          clientName: client.name,
          clientPhone: client.phone,
        }));
      }
    }
  }, [formData.clientId, clients]);

  // Calculate VAT and total for installation contracts
  React.useEffect(() => {
    if (formData.type === 'تركيب') {
      const subtotal = formData.elevatorDetails.pricePerElevator * formData.elevatorDetails.elevatorCount;
      const vat = subtotal * 0.15; // 15% VAT
      const totalPrice = subtotal + vat;
      
      setFormData(prev => ({
        ...prev,
        elevatorDetails: {
          ...prev.elevatorDetails,
          vat,
          totalPrice,
        }
      }));
    }
  }, [formData.type, formData.elevatorDetails.pricePerElevator, formData.elevatorDetails.elevatorCount]);

  const renderTypeSpecificFields = () => {
    switch (formData.type) {
      case 'تركيب':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">تفاصيل المصعد</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="عدد المصاعد"
                type="number"
                min="1"
                value={formData.elevatorDetails.elevatorCount.toString()}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  elevatorDetails: { 
                    ...formData.elevatorDetails, 
                    elevatorCount: parseInt(e.target.value) || 1 
                  }
                })}
                required
              />
              <Input
                label="الحمولة (مثال: 450 كجم)"
                value={formData.elevatorDetails.capacity}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  elevatorDetails: { 
                    ...formData.elevatorDetails, 
                    capacity: e.target.value 
                  }
                })}
                placeholder="450 كجم"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="عدد الوقفات"
                type="number"
                min="1"
                value={formData.elevatorDetails.stops.toString()}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  elevatorDetails: { 
                    ...formData.elevatorDetails, 
                    stops: parseInt(e.target.value) || 0 
                  }
                })}
                required
              />
              <Input
                label="السرعة (مثال: 1m/s)"
                value={formData.elevatorDetails.speed}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  elevatorDetails: { 
                    ...formData.elevatorDetails, 
                    speed: e.target.value 
                  }
                })}
                placeholder="1m/s"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="السعر لكل مصعد (بدون ضريبة)"
                type="number"
                step="0.01"
                value={formData.elevatorDetails.pricePerElevator.toString()}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  elevatorDetails: { 
                    ...formData.elevatorDetails, 
                    pricePerElevator: parseFloat(e.target.value) || 0 
                  }
                })}
                required
              />
              <Input
                label="ضريبة القيمة المضافة (15%)"
                type="number"
                value={formData.elevatorDetails.vat.toFixed(2)}
                readOnly
                className="bg-gray-50"
              />
              <Input
                label="السعر الإجمالي (مع الضريبة)"
                type="number"
                value={formData.elevatorDetails.totalPrice.toFixed(2)}
                readOnly
                className="bg-gray-50"
              />
            </div>

            <Input
              label="مدة الضمان"
              value={formData.elevatorDetails.warrantyPeriod}
              onChange={(e) => setFormData({ 
                ...formData, 
                elevatorDetails: { 
                  ...formData.elevatorDetails, 
                  warrantyPeriod: e.target.value 
                }
              })}
              placeholder="مثال: 24 شهر"
              required
            />
          </div>
        );

      case 'صيانة':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">تفاصيل الصيانة</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="عدد المصاعد المطلوب صيانتها"
                type="number"
                min="1"
                value={formData.maintenanceDetails.elevatorCount.toString()}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  maintenanceDetails: { 
                    ...formData.maintenanceDetails, 
                    elevatorCount: parseInt(e.target.value) || 1 
                  }
                })}
                required
              />
              <Input
                label="عدد الزيارات"
                type="number"
                min="1"
                value={formData.maintenanceDetails.visitCount.toString()}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  maintenanceDetails: { 
                    ...formData.maintenanceDetails, 
                    visitCount: parseInt(e.target.value) || 0 
                  }
                })}
                required
              />
            </div>

            <Input
              label="موقع الخدمة"
              value={formData.maintenanceDetails.serviceLocation}
              onChange={(e) => setFormData({ 
                ...formData, 
                maintenanceDetails: { 
                  ...formData.maintenanceDetails, 
                  serviceLocation: e.target.value 
                }
              })}
              placeholder="مثال: مدينة، مبنى معين، شقق محددة"
              required
            />

            <Input
              label="قيمة عقد الصيانة"
              type="number"
              step="0.01"
              value={formData.maintenanceDetails.contractValue.toString()}
              onChange={(e) => setFormData({ 
                ...formData, 
                maintenanceDetails: { 
                  ...formData.maintenanceDetails, 
                  contractValue: parseFloat(e.target.value) || 0 
                }
              })}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="تاريخ بداية العقد (هجري)"
                value={formData.maintenanceDetails.startDateHijri}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  maintenanceDetails: { 
                    ...formData.maintenanceDetails, 
                    startDateHijri: e.target.value 
                  }
                })}
                placeholder="مثال: 1/1/1446"
                required
              />
              <Input
                label="تاريخ نهاية العقد (هجري)"
                value={formData.maintenanceDetails.endDateHijri}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  maintenanceDetails: { 
                    ...formData.maintenanceDetails, 
                    endDateHijri: e.target.value 
                  }
                })}
                placeholder="مثال: 30/12/1446"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="ممثل الطرف الأول"
                value={formData.maintenanceDetails.firstPartyRepresentative}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  maintenanceDetails: { 
                    ...formData.maintenanceDetails, 
                    firstPartyRepresentative: e.target.value 
                  }
                })}
                required
              />
              <Input
                label="ممثل الطرف الثاني"
                value={formData.maintenanceDetails.secondPartyRepresentative}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  maintenanceDetails: { 
                    ...formData.maintenanceDetails, 
                    secondPartyRepresentative: e.target.value 
                  }
                })}
                required
              />
            </div>
          </div>
        );

      case 'إصلاح':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">تفاصيل الإصلاح</h3>
            <p className="text-sm text-gray-600">
              عقود الإصلاح تستخدم البيانات العامة للعقد. يمكن إضافة تفاصيل إضافية في وصف المشروع.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">العقود</h1>
          <p className="text-gray-600 mt-1 text-sm">إدارة عقود المشاريع والاتفاقيات</p>
        </div>
        <RoleGuard allowedRoles={['admin', 'supervisor']}>
          <Button
            icon={Plus}
            onClick={() => setIsModalOpen(true)}
            size="sm"
            className="w-full sm:w-auto"
          >
            إضافة عقد
          </Button>
        </RoleGuard>
      </div>

      <DataTable
        data={contracts}
        columns={columns}
        loading={loading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingContract ? 'تعديل العقد' : 'إضافة عقد جديد'}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Contract Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">بيانات العقد العامة</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="رقم العقد"
                value={formData.contractNumber}
                onChange={(e) => setFormData({ ...formData, contractNumber: e.target.value })}
                required
              />
              <Input
                label="تاريخ العقد"
                type="date"
                value={formData.contractDate}
                onChange={(e) => setFormData({ ...formData, contractDate: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                label="المشروع"
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                options={[
                  { value: '', label: 'اختر مشروع' },
                  ...projects.map(project => ({ value: project.id, label: project.name }))
                ]}
                required
              />
            </div>

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

          {/* Client Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">بيانات العميل (الطرف الثاني)</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="الاسم"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                required
              />
              <Input
                label="رقم الهوية"
                value={formData.clientIdNumber}
                onChange={(e) => setFormData({ ...formData, clientIdNumber: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="رقم الجوال"
                value={formData.clientPhone}
                onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                required
              />
              <Input
                label="اسم المشروع"
                value={formData.projectName}
                onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                placeholder="مثال: فيلا سكنية"
                required
              />
            </div>

            <Input
              label="مدة المشروع"
              value={formData.projectDuration}
              onChange={(e) => setFormData({ ...formData, projectDuration: e.target.value })}
              placeholder="مثال: 3 أشهر"
              required
            />
          </div>

          {/* Type-specific fields */}
          {renderTypeSpecificFields()}

          {/* Signature Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">التاريخ والتوقيع</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="اسم المشتري"
                value={formData.buyerName}
                onChange={(e) => setFormData({ ...formData, buyerName: e.target.value })}
                required
              />
              <Input
                label="تاريخ التوقيع"
                type="date"
                value={formData.signatureDate}
                onChange={(e) => setFormData({ ...formData, signatureDate: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="توقيع المشتري (اختياري)"
                value={formData.buyerSignature}
                onChange={(e) => setFormData({ ...formData, buyerSignature: e.target.value })}
                placeholder="سيتم إضافة التوقيع في النسخة المطبوعة"
              />
              <Input
                label="ختم المشتري (اختياري)"
                value={formData.buyerStamp}
                onChange={(e) => setFormData({ ...formData, buyerStamp: e.target.value })}
                placeholder="سيتم إضافة الختم في النسخة المطبوعة"
              />
            </div>

            <Select
              label="حالة العقد"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              options={[
                { value: 'نشط', label: 'نشط' },
                { value: 'منتهي', label: 'منتهي' },
                { value: 'معلق', label: 'معلق' },
              ]}
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 sm:space-x-reverse pt-4 border-t">
            <Button variant="secondary" onClick={closeModal} className="w-full sm:w-auto">
              إلغاء
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              {editingContract ? 'تحديث' : 'إضافة'} العقد
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}