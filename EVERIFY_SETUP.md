# إعداد Everify لتأكيد رقم الهاتف

## ما هو Everify؟

Everify هي خدمة لإرسال رسائل SMS للتحقق من أرقام الهواتف. تدعم أكثر من 200 دولة وتوفر أسعار تنافسية.

## خطوات الإعداد

### 1. إنشاء حساب على Everify

1. اذهب إلى: [https://everify.dev](https://everify.dev)
2. انقر على "Sign Up" أو "Get Started"
3. أكمل عملية التسجيل

### 2. الحصول على API Key

1. بعد تسجيل الدخول، اذهب إلى لوحة التحكم (Dashboard)
2. ابحث عن قسم "API Keys" أو "Settings"
3. انسخ الـ API Key الخاص بك

### 3. إضافة API Key إلى المشروع

1. افتح ملف `.env` في جذر المشروع
2. أضف السطر التالي:
   ```
   EVERIFY_API_KEY=your-api-key-here
   ```
3. استبدل `your-api-key-here` بالـ API Key الذي حصلت عليه

### 4. إعادة تشغيل الخادم

بعد إضافة API Key، أعد تشغيل خادم التطوير:

```bash
npm run dev
```

## كيف يعمل النظام؟

### مع API Key (الإنتاج)
- يتم إرسال رسائل SMS حقيقية عبر Everify
- المستخدم يستلم رمز التحقق على هاتفه
- يدخل الرمز في الموقع للتأكيد

### بدون API Key (التطوير)
- يتم طباعة رمز التحقق في console
- يظهر الرمز أيضاً في واجهة المستخدم (للتسهيل)
- لا يتم إرسال رسائل SMS حقيقية

## الأسعار

- Everify توفر خطة مجانية للتجربة
- الأسعار تبدأ من $0.01 لكل رسالة (حسب الدولة)
- راجع صفحة الأسعار: [https://everify.dev/pricing](https://everify.dev/pricing)

## استكشاف الأخطاء

### الرمز لا يصل إلى الهاتف

1. تأكد من أن API Key صحيح
2. تأكد من أن رقم الهاتف بالصيغة الدولية (مثال: +201234567890)
3. تحقق من رصيد حسابك على Everify
4. راجع logs في console للتفاصيل

### رسالة خطأ "EVERIFY_API_KEY is not set"

- تأكد من إضافة API Key في ملف `.env`
- أعد تشغيل الخادم بعد إضافة المتغير

## بدائل Everify

إذا كنت تفضل استخدام خدمة أخرى، يمكنك تعديل ملف:
`app/api/verification/send-phone/route.ts`

بدائل شائعة:
- Twilio
- Nexmo (Vonage)
- AWS SNS
- MessageBird

## الدعم

- وثائق Everify: [https://docs.everify.dev](https://docs.everify.dev)
- الدعم الفني: support@everify.dev
