import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, isAuthenticated } = useAuthStore();
  const { showToast } = useToast();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await login(username, password);
      if (success) {
        showToast('success', 'تم تسجيل الدخول بنجاح');
      } else {
        showToast('error', 'اسم المستخدم أو كلمة المرور غير صحيحة');
      }
    } catch (error) {
      showToast('error', 'فشل في تسجيل الدخول. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm sm:max-w-md p-6 sm:p-8">
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">نكاز CRM</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">نظام إدارة خدمات المصاعد</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <Input
            label="اسم المستخدم"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="أدخل اسم المستخدم"
          />

          <Input
            label="كلمة المرور"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="أدخل كلمة المرور"
          />

          <Button
            type="submit"
            className="w-full"
            loading={loading}
            disabled={!username || !password}
          >
            تسجيل الدخول
          </Button>
        </form>

        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
          <div className="text-center">
            <button className="text-xs sm:text-sm text-blue-600 hover:text-blue-800">
              نسيت كلمة المرور؟
            </button>
          </div>
          
          <div className="mt-3 sm:mt-4 text-xs text-gray-500 text-center">
            <p className="font-medium mb-2">بيانات تجريبية:</p>
            <div className="space-y-1 text-xs">
              <p><strong>مدير:</strong> admin / admin123</p>
              <p><strong>مشرف:</strong> supervisor / super123</p>
              <p><strong>مستخدم:</strong> viewer / view123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}