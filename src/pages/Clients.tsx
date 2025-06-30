import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, ArrowRight, Building, User, Phone, Mail, MapPin, FileText, CreditCard, Receipt, Wrench } from 'lucide-react';
import { DataTable } from '../components/ui/DataTable';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { RoleGuard } from '../components/auth/RoleGuard';
import { useAppStore } from '../store/appStore';
import { useToast } from '../components/ui/Toast';
import { Client } from '../types';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export function Clients() {
  const { clients, projects, contracts, payments, invoices, maintenances, addClient, updateClient, deleteClient, addProject, addContract, addPayment, addInvoice, addMaintenance, loading } = useAppStore();
  const { showToast } = useToast();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalType, setAddModalType] = useState<'project' | 'contract' | 'payment' | 'invoice' | 'maintenance'>('project');
  
  const [formData, setFormData] = useState({
    clientNumber: '',
    name: '',
    type: 'شركة' as const,
    phone: '',
    email: '',
    location: '',
    contractStatus: 'نشط' as const,
    warrantyStatus: 'ساري' as const,
  });

  // Add form states for different types
  const [projectFormData, setProjectFormData] = useState({
    name: '',
    type: 'تركيب' as const,
    status: 'نشط' as const,
    startDate: '',
    endDate: '',
    description: '',
  });

  const [contractFormData, setContractFormData] = useState({
    contractNumber: '',
    type: 'تركيب' as const,
    projectId: '',
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
    status: 'نشط' as const,
  });

  const [paymentFormData, setPaymentFormData] = useState({
    contractId: '',
    method: 'تحويل' as const,
    amount: 0,
    date: '',
    notes: '',
    status: 'مكتمل' as const,
  });

  const [invoiceFormData, setInvoiceFormData] = useState({
    invoiceNumber: '',
    serviceDescription: '',
    amount: 0,
    paymentMethod: 'تحويل' as const,
    date: '',
    status: 'معلق' as const,
  });

  const [maintenanceFormData, setMaintenanceFormData] = useState({
    elevatorId: '',
    type: 'دورية' as const,
    description: '',
    date: '',
    technician: '',
    status: 'مجدولة' as const,
    notes: '',
  });

  const columns = [
    {
      key: 'clientNumber' as keyof Client,
      header: 'رقم العميل',
      sortable: true,
    },
    {
      key: 'name' as keyof Client,
      header: 'اسم العميل',
      sortable: true,
    },
    {
      key: 'type' as keyof Client,
      header: 'نوع العميل',
      sortable: true,
      render: (value: string) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          value === 'شركة' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: 'phone' as keyof Client,
      header: 'رقم الجوال',
    },
    {
      key: 'email' as keyof Client,
      header: 'البريد الإلكتروني',
    },
    {
      key: 'contractStatus' as keyof Client,
      header: 'حالة العقد',
      sortable: true,
      render: (value: string) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          value === 'نشط' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: 'warrantyStatus' as keyof Client,
      header: 'حالة الضمان',
      sortable: true,
      render: (value: string) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          value === 'ساري' ? 'bg-green-100 text-green-800' :
          value === 'منتهي' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: 'id' as keyof Client,
      header: 'الإجراءات',
      render: (_: string, client: Client) => (
        <div className="flex space-x-2 space-x-reverse">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedClient(client);
              setActiveTab('profile');
            }}
            className="text-green-600 hover:text-green-800"
            title="عرض التفاصيل"
          >
            <Eye className="w-4 h-4" />
          </button>
          <RoleGuard allowedRoles={['admin', 'supervisor']}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(client);
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
                handleDelete(client.id);
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

  const tabs = [
    { id: 'profile', name: 'بيانات العميل', icon: User, addButton: false },
    { id: 'projects', name: 'المشاريع المرتبطة', icon: Building, addButton: true, addType: 'project' as const },
    { id: 'contracts', name: 'العقود', icon: FileText, addButton: true, addType: 'contract' as const },
    { id: 'invoices', name: 'الفواتير', icon: Receipt, addButton: true, addType: 'invoice' as const },
    { id: 'payments', name: 'الدفعات', icon: CreditCard, addButton: true, addType: 'payment' as const },
    { id: 'maintenance', name: 'الصيانات الدورية', icon: Wrench, addButton: true, addType: 'maintenance' as const },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingClient) {
        await updateClient(editingClient.id, formData);
        showToast('success', 'تم تحديث العميل بنجاح');
      } else {
        await addClient(formData);
        showToast('success', 'تم إضافة العميل بنجاح');
      }
      closeModal();
    } catch (error) {
      showToast('error', 'فشل في حفظ بيانات العميل');
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedClient) return;

    try {
      switch (addModalType) {
        case 'project':
          await addProject({
            ...projectFormData,
            clientId: selectedClient.id,
          });
          showToast('success', 'تم إضافة المشروع بنجاح');
          break;
        case 'contract':
          await addContract({
            ...contractFormData,
            clientId: selectedClient.id,
          });
          showToast('success', 'تم إضافة العقد بنجاح');
          break;
        case 'payment':
          await addPayment(paymentFormData);
          showToast('success', 'تم إضافة الدفعة بنجاح');
          break;
        case 'invoice':
          await addInvoice({
            ...invoiceFormData,
            clientId: selectedClient.id,
          });
          showToast('success', 'تم إضافة الفاتورة بنجاح');
          break;
        case 'maintenance':
          await addMaintenance({
            ...maintenanceFormData,
            clientId: selectedClient.id,
          });
          showToast('success', 'تم إضافة الصيانة بنجاح');
          break;
      }
      closeAddModal();
    } catch (error) {
      showToast('error', 'فشل في حفظ البيانات');
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      clientNumber: client.clientNumber,
      name: client.name,
      type: client.type,
      phone: client.phone,
      email: client.email,
      location: client.location,
      contractStatus: client.contractStatus,
      warrantyStatus: client.warrantyStatus,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا العميل؟')) {
      try {
        await deleteClient(id);
        showToast('success', 'تم حذف العميل بنجاح');
      } catch (error) {
        showToast('error', 'فشل في حذف العميل');
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
    setFormData({
      clientNumber: '',
      name: '',
      type: 'شركة',
      phone: '',
      email: '',
      location: '',
      contractStatus: 'نشط',
      warrantyStatus: 'ساري',
    });
  };

  const openAddModal = (type: typeof addModalType) => {
    setAddModalType(type);
    
    // Auto-fill client data for contract
    if (type === 'contract' && selectedClient) {
      setContractFormData(prev => ({
        ...prev,
        clientName: selectedClient.name,
        clientPhone: selectedClient.phone,
      }));
    }
    
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setProjectFormData({
      name: '',
      type: 'تركيب',
      status: 'نشط',
      startDate: '',
      endDate: '',
      description: '',
    });
    setContractFormData({
      contractNumber: '',
      type: 'تركيب',
      projectId: '',
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
    setPaymentFormData({
      contractId: '',
      method: 'تحويل',
      amount: 0,
      date: '',
      notes: '',
      status: 'مكتمل',
    });
    setInvoiceFormData({
      invoiceNumber: '',
      serviceDescription: '',
      amount: 0,
      paymentMethod: 'تحويل',
      date: '',
      status: 'معلق',
    });
    setMaintenanceFormData({
      elevatorId: '',
      type: 'دورية',
      description: '',
      date: '',
      technician: '',
      status: 'مجدولة',
      notes: '',
    });
  };

  const getClientData = (clientId: string) => {
    const clientProjects = projects.filter(p => p.clientId === clientId);
    const clientContracts = contracts.filter(c => c.clientId === clientId);
    const clientInvoices = invoices.filter(i => i.clientId === clientId);
    const clientPayments = payments.filter(p => 
      clientContracts.some(c => c.id === p.contractId)
    );
    const clientMaintenances = maintenances.filter(m => m.clientId === clientId);

    return {
      projects: clientProjects,
      contracts: clientContracts,
      invoices: clientInvoices,
      payments: clientPayments,
      maintenances: clientMaintenances,
    };
  };

  // Calculate VAT automatically for contracts
  React.useEffect(() => {
    if (contractFormData.type === 'تركيب') {
      const subtotal = contractFormData.elevatorDetails.pricePerElevator * contractFormData.elevatorDetails.elevatorCount;
      const vat = subtotal * 0.15; // 15% VAT
      const totalPrice = subtotal + vat;
      
      setContractFormData(prev => ({
        ...prev,
        elevatorDetails: {
          ...prev.elevatorDetails,
          vat,
          totalPrice,
        }
      }));
    }
  }, [contractFormData.type, contractFormData.elevatorDetails.pricePerElevator, contractFormData.elevatorDetails.elevatorCount]);

  const renderTabContent = () => {
    if (!selectedClient) return null;
    
    const clientData = getClientData(selectedClient.id);

    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <User className="w-5 h-5 text-gray-400 ml-3" />
                  <div>
                    <p className="text-sm text-gray-500">رقم العميل</p>
                    <p className="font-medium">{selectedClient.clientNumber}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Building className="w-5 h-5 text-gray-400 ml-3" />
                  <div>
                    <p className="text-sm text-gray-500">اسم العميل</p>
                    <p className="font-medium">{selectedClient.name}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <User className="w-5 h-5 text-gray-400 ml-3" />
                  <div>
                    <p className="text-sm text-gray-500">نوع العميل</p>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      selectedClient.type === 'شركة' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {selectedClient.type}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-gray-400 ml-3" />
                  <div>
                    <p className="text-sm text-gray-500">رقم الجوال</p>
                    <p className="font-medium">{selectedClient.phone}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-gray-400 ml-3" />
                  <div>
                    <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                    <p className="font-medium">{selectedClient.email}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-gray-400 ml-3" />
                  <div>
                    <p className="text-sm text-gray-500">الموقع الجغرافي</p>
                    <p className="font-medium">{selectedClient.location}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-2">حالة العقد</p>
                <span className={`px-3 py-1 text-sm rounded-full ${
                  selectedClient.contractStatus === 'نشط' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {selectedClient.contractStatus}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">حالة الضمان</p>
                <span className={`px-3 py-1 text-sm rounded-full ${
                  selectedClient.warrantyStatus === 'ساري' ? 'bg-green-100 text-green-800' :
                  selectedClient.warrantyStatus === 'منتهي' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {selectedClient.warrantyStatus}
                </span>
              </div>
            </div>

            {selectedClient.buildingImages && selectedClient.buildingImages.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-3">صور المبنى</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedClient.buildingImages.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`صورة المبنى ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'projects':
        return (
          <div className="space-y-4">
            {clientData.projects.length > 0 ? (
              clientData.projects.map((project) => (
                <div key={project.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{project.name}</h4>
                      <p className="text-sm text-gray-500">{project.description}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {format(new Date(project.startDate), 'dd MMM yyyy', { locale: ar })} - 
                        {format(new Date(project.endDate), 'dd MMM yyyy', { locale: ar })}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      project.status === 'مكتمل' ? 'bg-green-100 text-green-800' :
                      project.status === 'قيد التنفيذ' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">لا توجد مشاريع مرتبطة بهذا العميل</p>
            )}
          </div>
        );

      case 'contracts':
        return (
          <div className="space-y-4">
            {clientData.contracts.length > 0 ? (
              clientData.contracts.map((contract) => (
                <div key={contract.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{contract.contractNumber}</h4>
                      <p className="text-sm text-gray-500">{contract.type}</p>
                      {contract.type === 'تركيب' && contract.elevatorDetails && contract.elevatorDetails.totalPrice !== undefined && (
                        <p className="text-sm font-medium text-green-600">
                          {contract.elevatorDetails.totalPrice.toLocaleString()} ريال
                        </p>
                      )}
                      {contract.type === 'صيانة' && contract.maintenanceDetails && contract.maintenanceDetails.contractValue !== undefined && (
                        <p className="text-sm font-medium text-green-600">
                          {contract.maintenanceDetails.contractValue.toLocaleString()} ريال
                        </p>
                      )}
                      {contract.contractDate && (
                        <p className="text-xs text-gray-400">
                          تاريخ العقد: {format(new Date(contract.contractDate), 'dd MMM yyyy', { locale: ar })}
                        </p>
                      )}
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      contract.status === 'نشط' ? 'bg-green-100 text-green-800' :
                      contract.status === 'منتهي' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {contract.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">لا توجد عقود مرتبطة بهذا العميل</p>
            )}
          </div>
        );

      case 'invoices':
        return (
          <div className="space-y-4">
            {clientData.invoices.length > 0 ? (
              clientData.invoices.map((invoice) => (
                <div key={invoice.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{invoice.invoiceNumber}</h4>
                      <p className="text-sm text-gray-500">{invoice.serviceDescription}</p>
                      <p className="text-sm font-medium text-blue-600">
                        {invoice.amount !== undefined ? invoice.amount.toLocaleString() : '0'} ريال
                      </p>
                      <p className="text-xs text-gray-400">{format(new Date(invoice.date), 'dd MMM yyyy', { locale: ar })}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      invoice.status === 'مدفوع' ? 'bg-green-100 text-green-800' :
                      invoice.status === 'معلق' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {invoice.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">لا توجد فواتير مرتبطة بهذا العميل</p>
            )}
          </div>
        );

      case 'payments':
        return (
          <div className="space-y-4">
            {clientData.payments.length > 0 ? (
              clientData.payments.map((payment) => (
                <div key={payment.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">
                        {payment.amount !== undefined ? payment.amount.toLocaleString() : '0'} ريال
                      </h4>
                      <p className="text-sm text-gray-500">{payment.method}</p>
                      <p className="text-sm text-gray-500">{payment.notes}</p>
                      <p className="text-xs text-gray-400">{format(new Date(payment.date), 'dd MMM yyyy', { locale: ar })}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      payment.status === 'مكتمل' ? 'bg-green-100 text-green-800' :
                      payment.status === 'معلق' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {payment.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">لا توجد دفعات مرتبطة بهذا العميل</p>
            )}
          </div>
        );

      case 'maintenance':
        return (
          <div className="space-y-4">
            {clientData.maintenances.length > 0 ? (
              clientData.maintenances.map((maintenance) => (
                <div key={maintenance.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{maintenance.description}</h4>
                      <p className="text-sm text-gray-500">النوع: {maintenance.type}</p>
                      <p className="text-sm text-gray-500">الفني: {maintenance.technician}</p>
                      <p className="text-xs text-gray-400">{format(new Date(maintenance.date), 'dd MMM yyyy', { locale: ar })}</p>
                      {maintenance.notes && (
                        <p className="text-xs text-gray-500 mt-1">{maintenance.notes}</p>
                      )}
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      maintenance.status === 'مكتملة' ? 'bg-green-100 text-green-800' :
                      maintenance.status === 'قيد التنفيذ' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {maintenance.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">لا توجد صيانات مرتبطة بهذا العميل</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const renderAddForm = () => {
    switch (addModalType) {
      case 'project':
        return (
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <Input
              label="اسم المشروع"
              value={projectFormData.name}
              onChange={(e) => setProjectFormData({ ...projectFormData, name: e.target.value })}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="النوع"
                value={projectFormData.type}
                onChange={(e) => setProjectFormData({ ...projectFormData, type: e.target.value as any })}
                options={[
                  { value: 'تركيب', label: 'تركيب' },
                  { value: 'صيانة', label: 'صيانة' },
                  { value: 'إصلاح', label: 'إصلاح' },
                ]}
              />
              <Select
                label="الحالة"
                value={projectFormData.status}
                onChange={(e) => setProjectFormData({ ...projectFormData, status: e.target.value as any })}
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
                value={projectFormData.startDate}
                onChange={(e) => setProjectFormData({ ...projectFormData, startDate: e.target.value })}
                required
              />
              <Input
                label="تاريخ النهاية"
                type="date"
                value={projectFormData.endDate}
                onChange={(e) => setProjectFormData({ ...projectFormData, endDate: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
              <textarea
                value={projectFormData.description}
                onChange={(e) => setProjectFormData({ ...projectFormData, description: e.target.value })}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
            <div className="flex justify-end space-x-3 space-x-reverse pt-4">
              <Button variant="secondary" onClick={closeAddModal}>إلغاء</Button>
              <Button type="submit">إضافة المشروع</Button>
            </div>
          </form>
        );

      case 'contract':
        return (
          <form onSubmit={handleAddSubmit} className="space-y-4 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="رقم العقد"
                value={contractFormData.contractNumber}
                onChange={(e) => setContractFormData({ ...contractFormData, contractNumber: e.target.value })}
                required
              />
              <Select
                label="النوع"
                value={contractFormData.type}
                onChange={(e) => setContractFormData({ ...contractFormData, type: e.target.value as any })}
                options={[
                  { value: 'تركيب', label: 'تركيب' },
                  { value: 'صيانة', label: 'صيانة' },
                  { value: 'إصلاح', label: 'إصلاح' },
                ]}
              />
            </div>
            
            {contractFormData.type === 'تركيب' && (
              <div className="space-y-4 border-t pt-4">
                <h4 className="font-medium text-gray-900">تفاصيل المصعد</h4>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="عدد المصاعد"
                    type="number"
                    min="1"
                    value={contractFormData.elevatorDetails.elevatorCount.toString()}
                    onChange={(e) => setContractFormData({ 
                      ...contractFormData, 
                      elevatorDetails: { 
                        ...contractFormData.elevatorDetails, 
                        elevatorCount: parseInt(e.target.value) || 1 
                      }
                    })}
                    required
                  />
                  <Input
                    label="الحمولة"
                    value={contractFormData.elevatorDetails.capacity}
                    onChange={(e) => setContractFormData({ 
                      ...contractFormData, 
                      elevatorDetails: { 
                        ...contractFormData.elevatorDetails, 
                        capacity: e.target.value 
                      }
                    })}
                    placeholder="450 كجم"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="عدد الوقفات"
                    type="number"
                    value={contractFormData.elevatorDetails.stops.toString()}
                    onChange={(e) => setContractFormData({ 
                      ...contractFormData, 
                      elevatorDetails: { 
                        ...contractFormData.elevatorDetails, 
                        stops: parseInt(e.target.value) || 0 
                      }
                    })}
                    required
                  />
                  <Input
                    label="السرعة"
                    value={contractFormData.elevatorDetails.speed}
                    onChange={(e) => setContractFormData({ 
                      ...contractFormData, 
                      elevatorDetails: { 
                        ...contractFormData.elevatorDetails, 
                        speed: e.target.value 
                      }
                    })}
                    placeholder="1m/s"
                    required
                  />
                </div>
                <Input
                  label="السعر لكل مصعد"
                  type="number"
                  value={contractFormData.elevatorDetails.pricePerElevator.toString()}
                  onChange={(e) => setContractFormData({ 
                    ...contractFormData, 
                    elevatorDetails: { 
                      ...contractFormData.elevatorDetails, 
                      pricePerElevator: parseFloat(e.target.value) || 0 
                    }
                  })}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="ضريبة القيمة المضافة"
                    value={contractFormData.elevatorDetails.vat.toFixed(2)}
                    readOnly
                    className="bg-gray-50"
                  />
                  <Input
                    label="السعر الإجمالي"
                    value={contractFormData.elevatorDetails.totalPrice.toFixed(2)}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
              </div>
            )}

            {contractFormData.type === 'صيانة' && (
              <div className="space-y-4 border-t pt-4">
                <h4 className="font-medium text-gray-900">تفاصيل الصيانة</h4>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="عدد المصاعد"
                    type="number"
                    value={contractFormData.maintenanceDetails.elevatorCount.toString()}
                    onChange={(e) => setContractFormData({ 
                      ...contractFormData, 
                      maintenanceDetails: { 
                        ...contractFormData.maintenanceDetails, 
                        elevatorCount: parseInt(e.target.value) || 1 
                      }
                    })}
                    required
                  />
                  <Input
                    label="عدد الزيارات"
                    type="number"
                    value={contractFormData.maintenanceDetails.visitCount.toString()}
                    onChange={(e) => setContractFormData({ 
                      ...contractFormData, 
                      maintenanceDetails: { 
                        ...contractFormData.maintenanceDetails, 
                        visitCount: parseInt(e.target.value) || 0 
                      }
                    })}
                    required
                  />
                </div>
                <Input
                  label="قيمة عقد الصيانة"
                  type="number"
                  value={contractFormData.maintenanceDetails.contractValue.toString()}
                  onChange={(e) => setContractFormData({ 
                    ...contractFormData, 
                    maintenanceDetails: { 
                      ...contractFormData.maintenanceDetails, 
                      contractValue: parseFloat(e.target.value) || 0 
                    }
                  })}
                  required
                />
              </div>
            )}

            <div className="flex justify-end space-x-3 space-x-reverse pt-4">
              <Button variant="secondary" onClick={closeAddModal}>إلغاء</Button>
              <Button type="submit">إضافة العقد</Button>
            </div>
          </form>
        );

      case 'payment':
        return (
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <Select
              label="العقد"
              value={paymentFormData.contractId}
              onChange={(e) => setPaymentFormData({ ...paymentFormData, contractId: e.target.value })}
              options={[
                { value: '', label: 'اختر عقد' },
                ...contracts.filter(c => c.clientId === selectedClient?.id).map(contract => ({ 
                  value: contract.id, 
                  label: `${contract.contractNumber}` 
                }))
              ]}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="طريقة الدفع"
                value={paymentFormData.method}
                onChange={(e) => setPaymentFormData({ ...paymentFormData, method: e.target.value as any })}
                options={[
                  { value: 'تحويل', label: 'تحويل بنكي' },
                  { value: 'شيك', label: 'شيك' },
                  { value: 'نقد', label: 'نقد' },
                ]}
              />
              <Input
                label="المبلغ (ريال)"
                type="number"
                step="0.01"
                value={paymentFormData.amount.toString()}
                onChange={(e) => setPaymentFormData({ ...paymentFormData, amount: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="تاريخ الدفع"
                type="date"
                value={paymentFormData.date}
                onChange={(e) => setPaymentFormData({ ...paymentFormData, date: e.target.value })}
                required
              />
              <Select
                label="الحالة"
                value={paymentFormData.status}
                onChange={(e) => setPaymentFormData({ ...paymentFormData, status: e.target.value as any })}
                options={[
                  { value: 'مكتمل', label: 'مكتمل' },
                  { value: 'معلق', label: 'معلق' },
                  { value: 'فاشل', label: 'فاشل' },
                ]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الملاحظات</label>
              <textarea
                value={paymentFormData.notes}
                onChange={(e) => setPaymentFormData({ ...paymentFormData, notes: e.target.value })}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="flex justify-end space-x-3 space-x-reverse pt-4">
              <Button variant="secondary" onClick={closeAddModal}>إلغاء</Button>
              <Button type="submit">إضافة الدفعة</Button>
            </div>
          </form>
        );

      case 'invoice':
        return (
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <Input
              label="رقم الفاتورة"
              value={invoiceFormData.invoiceNumber}
              onChange={(e) => setInvoiceFormData({ ...invoiceFormData, invoiceNumber: e.target.value })}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">وصف الخدمة</label>
              <textarea
                value={invoiceFormData.serviceDescription}
                onChange={(e) => setInvoiceFormData({ ...invoiceFormData, serviceDescription: e.target.value })}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="المبلغ (ريال)"
                type="number"
                step="0.01"
                value={invoiceFormData.amount.toString()}
                onChange={(e) => setInvoiceFormData({ ...invoiceFormData, amount: parseFloat(e.target.value) || 0 })}
                required
              />
              <Select
                label="طريقة الدفع"
                value={invoiceFormData.paymentMethod}
                onChange={(e) => setInvoiceFormData({ ...invoiceFormData, paymentMethod: e.target.value as any })}
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
                value={invoiceFormData.date}
                onChange={(e) => setInvoiceFormData({ ...invoiceFormData, date: e.target.value })}
                required
              />
              <Select
                label="الحالة"
                value={invoiceFormData.status}
                onChange={(e) => setInvoiceFormData({ ...invoiceFormData, status: e.target.value as any })}
                options={[
                  { value: 'معلق', label: 'معلق' },
                  { value: 'مدفوع', label: 'مدفوع' },
                  { value: 'متأخر', label: 'متأخر' },
                ]}
              />
            </div>
            <div className="flex justify-end space-x-3 space-x-reverse pt-4">
              <Button variant="secondary" onClick={closeAddModal}>إلغاء</Button>
              <Button type="submit">إضافة الفاتورة</Button>
            </div>
          </form>
        );

      case 'maintenance':
        return (
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="رقم المصعد"
                value={maintenanceFormData.elevatorId}
                onChange={(e) => setMaintenanceFormData({ ...maintenanceFormData, elevatorId: e.target.value })}
                required
              />
              <Select
                label="النوع"
                value={maintenanceFormData.type}
                onChange={(e) => setMaintenanceFormData({ ...maintenanceFormData, type: e.target.value as any })}
                options={[
                  { value: 'دورية', label: 'دورية' },
                  { value: 'طارئة', label: 'طارئة' },
                  { value: 'وقائية', label: 'وقائية' },
                ]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
              <textarea
                value={maintenanceFormData.description}
                onChange={(e) => setMaintenanceFormData({ ...maintenanceFormData, description: e.target.value })}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="تاريخ الصيانة"
                type="date"
                value={maintenanceFormData.date}
                onChange={(e) => setMaintenanceFormData({ ...maintenanceFormData, date: e.target.value })}
                required
              />
              <Input
                label="اسم الفني"
                value={maintenanceFormData.technician}
                onChange={(e) => setMaintenanceFormData({ ...maintenanceFormData, technician: e.target.value })}
                required
              />
            </div>
            <Select
              label="الحالة"
              value={maintenanceFormData.status}
              onChange={(e) => setMaintenanceFormData({ ...maintenanceFormData, status: e.target.value as any })}
              options={[
                { value: 'مجدولة', label: 'مجدولة' },
                { value: 'قيد التنفيذ', label: 'قيد التنفيذ' },
                { value: 'مكتملة', label: 'مكتملة' },
              ]}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظات</label>
              <textarea
                value={maintenanceFormData.notes}
                onChange={(e) => setMaintenanceFormData({ ...maintenanceFormData, notes: e.target.value })}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="flex justify-end space-x-3 space-x-reverse pt-4">
              <Button variant="secondary" onClick={closeAddModal}>إلغاء</Button>
              <Button type="submit">إضافة الصيانة</Button>
            </div>
          </form>
        );

      default:
        return null;
    }
  };

  if (selectedClient) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center">
            <button
              onClick={() => setSelectedClient(null)}
              className="flex items-center text-gray-600 hover:text-gray-800 ml-4"
            >
              <ArrowRight className="w-4 h-4 ml-1" />
              العودة للقائمة
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{selectedClient.name}</h1>
              <p className="text-gray-600 text-sm">رقم العميل: {selectedClient.clientNumber}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 space-x-reverse px-4 sm:px-6 overflow-x-auto">
              {tabs.map((tab) => (
                <div key={tab.id} className="flex items-center">
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                    {tab.name}
                  </button>
                  {tab.addButton && activeTab === tab.id && (
                    <RoleGuard allowedRoles={['admin', 'supervisor']}>
                      <Button
                        size="sm"
                        icon={Plus}
                        onClick={() => openAddModal(tab.addType!)}
                        className="mr-2 text-xs"
                      >
                        إضافة
                      </Button>
                    </RoleGuard>
                  )}
                </div>
              ))}
            </nav>
          </div>
          <div className="p-4 sm:p-6">
            {renderTabContent()}
          </div>
        </div>

        {/* Add Modal */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={closeAddModal}
          title={`إضافة ${
            addModalType === 'project' ? 'مشروع' :
            addModalType === 'contract' ? 'عقد' :
            addModalType === 'payment' ? 'دفعة' :
            addModalType === 'invoice' ? 'فاتورة' :
            'صيانة'
          } جديد`}
          size="lg"
        >
          {renderAddForm()}
        </Modal>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">العملاء</h1>
          <p className="text-gray-600 mt-1 text-sm">إدارة قاعدة بيانات العملاء</p>
        </div>
        <RoleGuard allowedRoles={['admin', 'supervisor']}>
          <Button
            icon={Plus}
            onClick={() => setIsModalOpen(true)}
            size="sm"
            className="w-full sm:w-auto"
          >
            إضافة عميل
          </Button>
        </RoleGuard>
      </div>

      <DataTable
        data={clients}
        columns={columns}
        loading={loading}
        onRowClick={(client) => {
          setSelectedClient(client);
          setActiveTab('profile');
        }}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingClient ? 'تعديل العميل' : 'إضافة عميل جديد'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="رقم العميل"
              value={formData.clientNumber}
              onChange={(e) => setFormData({ ...formData, clientNumber: e.target.value })}
              placeholder="مثال: 1100"
              required
            />
            <Input
              label="اسم العميل"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="نوع العميل"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              options={[
                { value: 'فرد', label: 'فرد' },
                { value: 'شركة', label: 'شركة' },
              ]}
            />
            <Input
              label="رقم الجوال"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          <Input
            label="البريد الإلكتروني"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          <Input
            label="الموقع الجغرافي (للمشروع)"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="حالة العقد"
              value={formData.contractStatus}
              onChange={(e) => setFormData({ ...formData, contractStatus: e.target.value as any })}
              options={[
                { value: 'نشط', label: 'نشط' },
                { value: 'منتهي', label: 'منتهي' },
              ]}
            />
            <Select
              label="حالة الضمان"
              value={formData.warrantyStatus}
              onChange={(e) => setFormData({ ...formData, warrantyStatus: e.target.value as any })}
              options={[
                { value: 'ساري', label: 'ساري' },
                { value: 'منتهي', label: 'منتهي' },
                { value: 'لا يوجد', label: 'لا يوجد' },
              ]}
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 sm:space-x-reverse pt-4">
            <Button variant="secondary" onClick={closeModal} className="w-full sm:w-auto">
              إلغاء
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              {editingClient ? 'تحديث' : 'إضافة'} العميل
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}