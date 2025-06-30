import React from 'react';
import { Users, FolderOpen, FileText, CreditCard, AlertTriangle, TrendingUp, Calendar, Clock, CheckCircle } from 'lucide-react';
import { StatsCard } from '../components/ui/StatsCard';
import { useAppStore } from '../store/appStore';
import { format, isAfter, addDays, subDays } from 'date-fns';
import { ar } from 'date-fns/locale';

export function Dashboard() {
  const { clients, projects, contracts, payments, invoices, loading } = useAppStore();

  const stats = React.useMemo(() => {
    const activeProjects = projects.filter(p => p.status === 'نشط' || p.status === 'قيد التنفيذ').length;
    const totalPayments = payments.reduce((sum, p) => sum + p.amount, 0);
    const pendingInvoices = invoices.filter(i => i.status === 'معلق').length;
    const completedProjects = projects.filter(p => p.status === 'مكتمل').length;
    
    // Contracts expiring within 30 days
    const expiringContracts = contracts.filter(contract => {
      const endDate = new Date(contract.createdAt);
      const expiryDate = addDays(endDate, 365); // Assuming 1 year contracts
      const thirtyDaysFromNow = addDays(new Date(), 30);
      return isAfter(expiryDate, new Date()) && !isAfter(expiryDate, thirtyDaysFromNow);
    }).length;

    // Recent activity (last 7 days)
    const recentActivity = projects.filter(project => {
      const projectDate = new Date(project.createdAt);
      const sevenDaysAgo = subDays(new Date(), 7);
      return isAfter(projectDate, sevenDaysAgo);
    }).length;

    return {
      totalClients: clients.length,
      activeProjects,
      completedProjects,
      totalContracts: contracts.length,
      totalPayments: `${totalPayments.toLocaleString()} ريال`,
      pendingInvoices,
      expiringContracts,
      recentActivity,
    };
  }, [clients, projects, contracts, payments, invoices]);

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="animate-pulse">
          <div className="h-6 sm:h-8 bg-gray-200 rounded w-32 sm:w-48 mb-4 sm:mb-6" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-4 sm:p-6 rounded-lg shadow">
                <div className="h-8 sm:h-12 bg-gray-200 rounded mb-3 sm:mb-4" />
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 sm:h-6 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-4 sm:p-6 text-white">
        <h1 className="text-xl sm:text-3xl font-bold mb-2">لوحة التحكم</h1>
        <p className="text-blue-100 text-sm sm:text-base">مرحباً بك في نظام إدارة علاقات العملاء - نكاز</p>
        <div className="mt-3 sm:mt-4 flex items-center text-blue-100">
          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
          <span className="text-xs sm:text-sm">{format(new Date(), 'EEEE، dd MMMM yyyy', { locale: ar })}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <StatsCard
          title="إجمالي العملاء"
          value={stats.totalClients}
          icon={Users}
          color="blue"
          change={{ value: 12, type: 'increase' }}
        />
        <StatsCard
          title="المشاريع النشطة"
          value={stats.activeProjects}
          icon={FolderOpen}
          color="green"
          change={{ value: 8, type: 'increase' }}
        />
        <StatsCard
          title="المشاريع المكتملة"
          value={stats.completedProjects}
          icon={CheckCircle}
          color="purple"
          change={{ value: 15, type: 'increase' }}
        />
        <StatsCard
          title="إجمالي المدفوعات"
          value={stats.totalPayments}
          icon={CreditCard}
          color="yellow"
          change={{ value: 22, type: 'increase' }}
        />
      </div>

      {/* Alerts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {stats.expiringContracts > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
            <div className="flex items-center">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 ml-2" />
              <h3 className="text-xs sm:text-sm font-medium text-yellow-800">
                عقود تنتهي قريباً
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-yellow-700 mt-1">
              لديك {stats.expiringContracts} عقد ينتهي خلال الـ 30 يوماً القادمة.
            </p>
          </div>
        )}

        {stats.pendingInvoices > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4">
            <div className="flex items-center">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 ml-2" />
              <h3 className="text-xs sm:text-sm font-medium text-orange-800">
                فواتير معلقة
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-orange-700 mt-1">
              لديك {stats.pendingInvoices} فاتورة في انتظار الدفع.
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">النشاط الأخير</h3>
            <span className="text-xs sm:text-sm text-gray-500">{stats.recentActivity} نشاط جديد</span>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {projects.slice(0, 6).map((project) => (
              <div key={project.id} className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center min-w-0 flex-1">
                  <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ml-2 sm:ml-3 flex-shrink-0 ${
                    project.status === 'مكتمل' ? 'bg-green-500' :
                    project.status === 'قيد التنفيذ' ? 'bg-blue-500' :
                    'bg-yellow-500'
                  }`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{project.name}</p>
                    <p className="text-xs text-gray-500">
                      {project.type} • {format(new Date(project.createdAt), 'dd MMM', { locale: ar })}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full flex-shrink-0 ml-2 ${
                  project.status === 'مكتمل' ? 'bg-green-100 text-green-800' :
                  project.status === 'قيد التنفيذ' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {project.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">إحصائيات سريعة</h3>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between p-2 sm:p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center min-w-0 flex-1">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-lg flex items-center justify-center ml-2 sm:ml-3 flex-shrink-0">
                  <FolderOpen className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <span className="text-xs sm:text-sm text-gray-600 truncate">مشاريع التركيب</span>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-gray-900 flex-shrink-0">
                {projects.filter(p => p.type === 'تركيب').length}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-2 sm:p-3 bg-green-50 rounded-lg">
              <div className="flex items-center min-w-0 flex-1">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-lg flex items-center justify-center ml-2 sm:ml-3 flex-shrink-0">
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <span className="text-xs sm:text-sm text-gray-600 truncate">مشاريع الصيانة</span>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-gray-900 flex-shrink-0">
                {projects.filter(p => p.type === 'صيانة').length}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-2 sm:p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center min-w-0 flex-1">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-500 rounded-lg flex items-center justify-center ml-2 sm:ml-3 flex-shrink-0">
                  <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <span className="text-xs sm:text-sm text-gray-600 truncate">مشاريع الإصلاح</span>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-gray-900 flex-shrink-0">
                {projects.filter(p => p.type === 'إصلاح').length}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 sm:p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center min-w-0 flex-1">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-500 rounded-lg flex items-center justify-center ml-2 sm:ml-3 flex-shrink-0">
                  <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <span className="text-xs sm:text-sm text-gray-600 truncate">العقود النشطة</span>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-gray-900 flex-shrink-0">
                {contracts.filter(c => c.status === 'نشط').length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}