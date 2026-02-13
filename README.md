# 🚀 4IT Platform - Multi-Tenant Website Builder

<div align="center">

![4IT Platform](public/logo.png)

**منصة متكاملة لإنشاء وإدارة المواقع الإلكترونية مع نظام اشتراكات متقدم**

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)](https://tailwindcss.com/)

[العربية](#العربية) | [English](#english)

</div>

---

## العربية

### 📋 نظرة عامة

4IT Platform هي منصة SaaS متكاملة تتيح للمستخدمين إنشاء وإدارة مواقعهم الإلكترونية بسهولة. تتميز المنصة بنظام اشتراكات متقدم، تأكيد هوية المستخدمين، وأدوات إدارة شاملة.

### ✨ المميزات الرئيسية

#### 🏢 نظام Multi-Tenant
- إنشاء مواقع متعددة لمستخدمين مختلفين
- عزل كامل للبيانات بين المواقع
- نطاقات فرعية مخصصة لكل موقع

#### 💳 إدارة الاشتراكات
- خطط اشتراك متعددة (شهري، نصف سنوي، سنوي)
- نظام طلبات التجديد
- إشعارات انتهاء الاشتراك
- حجب تلقائي للمواقع منتهية الاشتراك

#### 🔐 تأكيد الهوية
- تأكيد البريد الإلكتروني عبر رابط
- تأكيد رقم الهاتف عبر SMS (Everify)
- فترة سماح 7 أيام للتأكيد
- حجب الموقع بعد انتهاء المهلة

#### 📊 لوحات التحكم

**لوحة المستخدم:**
- إدارة معلومات الموقع
- إضافة/تعديل الخدمات والمشاريع
- إدارة الرسائل الواردة
- تحليلات الزيارات
- إدارة الاشتراك

**لوحة المشرف الرئيسي:**
- إدارة جميع المستخدمين
- الموافقة على طلبات الاشتراك
- إدارة الاشتراكات
- مراقبة النظام

#### 🎨 تخصيص الموقع
- تحميل شعار مخصص
- صور Hero متعددة مع Slider
- اختيار أيقونات للخدمات
- ألوان وتصميم عصري
- متوافق مع جميع الأجهزة

#### 📧 نظام الرسائل
- استقبال رسائل من الزوار
- إشعارات بالرسائل الجديدة
- إدارة وأرشفة الرسائل

#### 📈 التحليلات
- تتبع الزيارات
- الصفحات الأكثر زيارة
- إحصائيات يومية وشهرية
- رسوم بيانية تفاعلية

### 🛠️ التقنيات المستخدمة

#### Frontend
- **Next.js 16.1.6** - React Framework
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Hook Form** - Form Management

#### Backend
- **Next.js API Routes** - Backend API
- **MongoDB** - Database
- **Mongoose** - ODM
- **NextAuth.js** - Authentication
- **bcryptjs** - Password Hashing

#### خدمات خارجية
- **Everify** - SMS Verification
- **Nodemailer** - Email Service
- **Vercel** - Hosting (optional)

### 📦 التثبيت

#### المتطلبات
- Node.js 18+ 
- MongoDB
- npm أو yarn

#### الخطوات

1. **استنساخ المشروع**
```bash
git clone https://github.com/adelvip222222-max/4IT.git
cd 4IT
```

2. **تثبيت المكتبات**
```bash
npm install
```

3. **إعداد ملف البيئة**
```bash
cp .env.example .env
```

4. **تعديل ملف .env**
```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000

# Email
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# SMS (Optional)
EVERIFY_API_KEY=your_everify_api_key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

5. **تشغيل المشروع**
```bash
npm run dev
```

6. **فتح المتصفح**
```
http://localhost:3000
```

### 🗂️ هيكل المشروع

```
4IT/
├── app/                      # Next.js App Router
│   ├── (auth)/              # صفحات المصادقة
│   ├── admin/               # لوحة تحكم المستخدم
│   ├── super-admin/         # لوحة المشرف الرئيسي
│   ├── api/                 # API Routes
│   └── s/[slug]/            # المواقع العامة
├── components/              # React Components
│   ├── admin/              # مكونات لوحة التحكم
│   ├── public/             # مكونات الصفحة الرئيسية
│   ├── site/               # مكونات المواقع
│   └── super-admin/        # مكونات المشرف
├── lib/                     # Utilities & Helpers
│   ├── actions/            # Server Actions
│   ├── db.ts               # Database Connection
│   ├── email.ts            # Email Service
│   └── validations.ts      # Validation Schemas
├── models/                  # Mongoose Models
├── public/                  # Static Files
├── scripts/                 # Utility Scripts
└── docs/                    # Documentation
    ├── SEO_GUIDE.md        # دليل SEO شامل
    ├── SEO_QUICK_TIPS.md   # نصائح سريعة
    ├── SEO_CHECKLIST.md    # قائمة تحقق
    └── EVERIFY_SETUP.md    # إعداد SMS
```

### 🚀 النشر

#### Vercel (موصى به)

1. **ربط المشروع بـ Vercel**
```bash
npm i -g vercel
vercel
```

2. **إضافة متغيرات البيئة**
- اذهب إلى Vercel Dashboard
- Settings → Environment Variables
- أضف جميع المتغيرات من .env

3. **النشر**
```bash
vercel --prod
```

#### خيارات أخرى
- AWS
- DigitalOcean
- Railway
- Render

### 📚 الوثائق

- [دليل SEO الشامل](SEO_GUIDE.md)
- [نصائح SEO السريعة](SEO_QUICK_TIPS.md)
- [قائمة تحقق SEO](SEO_CHECKLIST.md)
- [إعداد Everify](EVERIFY_SETUP.md)
- [دليل الاختبار](TESTING_GUIDE.md)

### 🔒 الأمان

- ✅ تشفير كلمات المرور (bcrypt)
- ✅ JWT Tokens للمصادقة
- ✅ HTTPS إلزامي في الإنتاج
- ✅ Rate Limiting
- ✅ CSRF Protection
- ✅ XSS Protection
- ✅ SQL Injection Prevention

### 🤝 المساهمة

نرحب بالمساهمات! يرجى:

1. Fork المشروع
2. إنشاء فرع للميزة (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add some AmazingFeature'`)
4. Push للفرع (`git push origin feature/AmazingFeature`)
5. فتح Pull Request

### 📝 الترخيص

هذا المشروع مرخص تحت [MIT License](LICENSE)

### 👥 الفريق

- **المطور الرئيسي:** [adelvip222222-max](https://github.com/adelvip222222-max)

### 📞 التواصل

- **GitHub:** [@adelvip222222-max](https://github.com/adelvip222222-max)
- **Email:** adelvip222222@gmail.com

### 🙏 شكر خاص

- Next.js Team
- Vercel
- MongoDB
- جميع المساهمين في المكتبات مفتوحة المصدر

---

## English

### 📋 Overview

4IT Platform is a comprehensive SaaS platform that enables users to create and manage their websites easily. The platform features an advanced subscription system, user identity verification, and comprehensive management tools.

### ✨ Key Features

- 🏢 Multi-tenant architecture
- 💳 Subscription management system
- 🔐 Email & Phone verification
- 📊 Admin & User dashboards
- 🎨 Customizable website builder
- 📧 Contact form & messaging
- 📈 Analytics & statistics
- 🌐 SEO optimized

### 🛠️ Tech Stack

- **Frontend:** Next.js 16, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, MongoDB
- **Auth:** NextAuth.js
- **SMS:** Everify
- **Email:** Nodemailer

### 📦 Installation

```bash
# Clone the repository
git clone https://github.com/adelvip222222-max/4IT.git

# Install dependencies
cd 4IT
npm install

# Setup environment
cp .env.example .env

# Run development server
npm run dev
```

### 📚 Documentation

- [SEO Guide](SEO_GUIDE.md)
- [Quick Tips](SEO_QUICK_TIPS.md)
- [Checklist](SEO_CHECKLIST.md)
- [Everify Setup](EVERIFY_SETUP.md)

### 📝 License

MIT License - see [LICENSE](LICENSE) file

---

<div align="center">

**Made with ❤️ by 4IT Team**

⭐ Star us on GitHub — it helps!

[Report Bug](https://github.com/adelvip222222-max/4IT/issues) · [Request Feature](https://github.com/adelvip222222-max/4IT/issues)

</div>
