export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'supervisor' | 'viewer';
  name: string;
  email: string;
}

export interface Client {
  id: string;
  clientNumber: string;
  name: string;
  type: 'فرد' | 'شركة';
  phone: string;
  email: string;
  location: string;
  buildingImages?: string[];
  contractStatus: 'منتهي' | 'نشط';
  warrantyStatus: 'منتهي' | 'ساري' | 'لا يوجد';
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  type: 'تركيب' | 'صيانة' | 'إصلاح';
  clientId: string;
  status: 'نشط' | 'قيد التنفيذ' | 'مكتمل' | 'معلق';
  startDate: string;
  endDate: string;
  description: string;
  createdAt: string;
}

export interface Contract {
  id: string;
  contractNumber: string;
  type: 'تركيب' | 'صيانة' | 'إصلاح';
  projectId: string;
  clientId: string;
  contractDate: string;
  
  // Client details
  clientName: string;
  clientIdNumber: string;
  clientPhone: string;
  projectName: string;
  projectDuration: string;
  
  // Installation specific fields
  elevatorDetails?: {
    elevatorCount: number;
    capacity: string; // e.g., "450 كجم"
    stops: number;
    speed: string; // e.g., "1m/s"
    pricePerElevator: number;
    vat: number;
    totalPrice: number;
    warrantyPeriod: string;
  };
  
  // Maintenance specific fields
  maintenanceDetails?: {
    elevatorCount: number;
    serviceLocation: string;
    visitCount: number;
    contractValue: number;
    startDateHijri: string;
    endDateHijri: string;
    firstPartyRepresentative: string;
    secondPartyRepresentative: string;
  };
  
  // Repair specific fields (can use general fields)
  
  // Signatures and dates
  buyerName: string;
  buyerSignature?: string;
  signatureDate: string;
  buyerStamp?: string;
  
  status: 'نشط' | 'منتهي' | 'معلق';
  createdAt: string;
}

export interface Payment {
  id: string;
  contractId: string;
  method: 'تحويل' | 'شيك' | 'نقد';
  amount: number;
  date: string;
  notes: string;
  status: 'مكتمل' | 'معلق' | 'فاشل';
  createdAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  serviceDescription: string;
  amount: number;
  paymentMethod: 'تحويل' | 'شيك' | 'نقد';
  date: string;
  status: 'مدفوع' | 'معلق' | 'متأخر';
  createdAt: string;
}

export interface Maintenance {
  id: string;
  clientId: string;
  elevatorId: string;
  type: 'دورية' | 'طارئة' | 'وقائية';
  description: string;
  date: string;
  technician: string;
  status: 'مكتملة' | 'قيد التنفيذ' | 'مجدولة';
  notes?: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export type UserRole = 'admin' | 'supervisor' | 'viewer';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export interface AppState {
  clients: Client[];
  projects: Project[];
  contracts: Contract[];
  payments: Payment[];
  invoices: Invoice[];
  maintenances: Maintenance[];
  users: User[];
  loading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => Promise<void>;
  updateClient: (id: string, client: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => Promise<void>;
  updateProject: (id: string, project: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addContract: (contract: Omit<Contract, 'id' | 'createdAt'>) => Promise<void>;
  updateContract: (id: string, contract: Partial<Contract>) => Promise<void>;
  deleteContract: (id: string) => Promise<void>;
  addPayment: (payment: Omit<Payment, 'id' | 'createdAt'>) => Promise<void>;
  updatePayment: (id: string, payment: Partial<Payment>) => Promise<void>;
  deletePayment: (id: string) => Promise<void>;
  addInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt'>) => Promise<void>;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;
  addMaintenance: (maintenance: Omit<Maintenance, 'id' | 'createdAt'>) => Promise<void>;
  updateMaintenance: (id: string, maintenance: Partial<Maintenance>) => Promise<void>;
  deleteMaintenance: (id: string) => Promise<void>;
  addUser: (user: Omit<User, 'id'>) => Promise<void>;
  updateUser: (id: string, user: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}