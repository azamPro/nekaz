# نكاز CRM - دليل النشر على Vercel

## خطوات النشر على Vercel

### 1. إعداد Backend API (مطلوب)

قبل النشر على Vercel، تحتاج إلى إعداد backend API حقيقي لأن JSON Server لا يعمل في production:

#### خيارات Backend:
- **Node.js + Express**: استخدم Express مع MongoDB أو PostgreSQL
- **.NET Core**: استخدم ASP.NET Core مع SQL Server أو PostgreSQL  
- **Python + FastAPI**: استخدم FastAPI مع PostgreSQL
- **Supabase**: منصة Backend-as-a-Service مع PostgreSQL

#### مثال على Backend بـ Node.js + Express:
```javascript
// server.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.get('/users', (req, res) => {
  // إرجاع المستخدمين من قاعدة البيانات
});

app.get('/clients', (req, res) => {
  // إرجاع العملاء من قاعدة البيانات
});

// باقي الـ routes...

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 2. نشر Backend

اختر إحدى هذه المنصات لنشر Backend:
- **Railway**: سهل الاستخدام ومجاني للمشاريع الصغيرة
- **Render**: مجاني مع قيود
- **Heroku**: مدفوع
- **DigitalOcean App Platform**: مدفوع
- **AWS/Google Cloud**: مدفوع

### 3. إعداد متغيرات البيئة في Vercel

1. اذهب إلى مشروعك في Vercel Dashboard
2. اذهب إلى Settings > Environment Variables
3. أضف المتغيرات التالية:

```
VITE_API_BASE_URL=https://your-backend-api.railway.app
VITE_APP_ENV=production
```

### 4. نشر Frontend على Vercel

#### الطريقة الأولى: ربط GitHub Repository
1. ادفع الكود إلى GitHub repository
2. اذهب إلى [vercel.com](https://vercel.com)
3. اضغط "New Project"
4. اختر GitHub repository
5. Vercel سيكتشف أنه مشروع Vite تلقائياً
6. اضغط "Deploy"

#### الطريقة الثانية: Vercel CLI
```bash
# تثبيت Vercel CLI
npm i -g vercel

# تسجيل الدخول
vercel login

# نشر المشروع
vercel

# للنشر في production
vercel --prod
```

### 5. إعداد قاعدة البيانات

#### استخدام Supabase (موصى به):
1. اذهب إلى [supabase.com](https://supabase.com)
2. أنشئ مشروع جديد
3. أنشئ الجداول المطلوبة:
   - users
   - clients  
   - projects
   - contracts
   - payments
   - invoices
   - maintenances

#### مثال على إنشاء جدول Users في Supabase:
```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'supervisor', 'viewer')),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 6. تحديث API Endpoints

بعد نشر Backend، حدث الرابط في ملف `src/config/api.ts`:

```typescript
// استبدل هذا الرابط برابط Backend الخاص بك
const PRODUCTION_API_URL = 'https://your-backend-api.railway.app';
```

### 7. اختبار التطبيق

1. تأكد من أن Backend يعمل بشكل صحيح
2. اختبر تسجيل الدخول
3. اختبر جميع العمليات (إضافة، تعديل، حذف)
4. تأكد من أن جميع الصفحات تعمل

### 8. إعداد Domain مخصص (اختياري)

1. في Vercel Dashboard، اذهب إلى Settings > Domains
2. أضف domain الخاص بك
3. اتبع التعليمات لإعداد DNS

## ملاحظات مهمة

### الأمان:
- لا تضع كلمات المرور في الكود
- استخدم environment variables لجميع المعلومات الحساسة
- فعل HTTPS في production
- استخدم JWT tokens للمصادقة بدلاً من كلمات المرور المباشرة

### الأداء:
- فعل compression في Backend
- استخدم CDN للملفات الثابتة
- فعل caching للبيانات التي لا تتغير كثيراً

### المراقبة:
- استخدم Vercel Analytics لمراقبة الأداء
- أضف error tracking مثل Sentry
- راقب استخدام API

## استكشاف الأخطاء

### خطأ "Failed to fetch":
- تأكد من أن Backend يعمل
- تأكد من إعداد CORS بشكل صحيح
- تأكد من صحة VITE_API_BASE_URL

### خطأ في تسجيل الدخول:
- تأكد من وجود بيانات المستخدمين في قاعدة البيانات
- تأكد من صحة API endpoint للمستخدمين

### مشاكل في التوجيه:
- تأكد من وجود ملف `vercel.json` مع إعدادات rewrites

## الدعم

إذا واجهت مشاكل في النشر:
1. تحقق من logs في Vercel Dashboard
2. تحقق من logs في Backend platform
3. استخدم browser developer tools للتحقق من network requests