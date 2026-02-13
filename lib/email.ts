import nodemailer from 'nodemailer';

// إعداد transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// التحقق من وجود بيانات البريد
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  console.error('⚠️ Email credentials not configured. Please set EMAIL_USER and EMAIL_PASSWORD in .env file');
}

// إرسال بريد التحقق
export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify-email?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'تأكيد البريد الإلكتروني - 4IT',
    html: `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { font-size: 32px; font-weight: bold; color: #2563eb; }
          .content { text-align: center; }
          .button { display: inline-block; padding: 15px 40px; background: #2563eb; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🚀 4IT</div>
          </div>
          <div class="content">
            <h2>مرحباً بك!</h2>
            <p>شكراً لتسجيلك في منصتنا. يرجى تأكيد بريدك الإلكتروني بالضغط على الزر أدناه:</p>
            <a href="${verificationUrl}" class="button">تأكيد البريد الإلكتروني</a>
            <p style="color: #666; font-size: 14px; margin-top: 20px;">
              أو انسخ الرابط التالي في المتصفح:<br>
              <span style="color: #2563eb;">${verificationUrl}</span>
            </p>
            <p style="color: #999; font-size: 12px; margin-top: 30px;">
              إذا لم تقم بإنشاء حساب، يرجى تجاهل هذه الرسالة.
            </p>
          </div>
          <div class="footer">
            <p>© 2024 4IT. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false, error: 'فشل في إرسال البريد' };
  }
}

// إرسال بريد استرداد كلمة المرور
export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'استرداد كلمة المرور - 4IT',
    html: `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { font-size: 32px; font-weight: bold; color: #2563eb; }
          .content { text-align: center; }
          .button { display: inline-block; padding: 15px 40px; background: #dc2626; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .warning { background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 8px; margin: 20px 0; color: #991b1b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🔐 4IT</div>
          </div>
          <div class="content">
            <h2>استرداد كلمة المرور</h2>
            <p>تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بك.</p>
            <a href="${resetUrl}" class="button">إعادة تعيين كلمة المرور</a>
            <p style="color: #666; font-size: 14px; margin-top: 20px;">
              أو انسخ الرابط التالي في المتصفح:<br>
              <span style="color: #2563eb;">${resetUrl}</span>
            </p>
            <div class="warning">
              ⚠️ هذا الرابط صالح لمدة ساعة واحدة فقط
            </div>
            <p style="color: #999; font-size: 12px; margin-top: 30px;">
              إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذه الرسالة.
            </p>
          </div>
          <div class="footer">
            <p>© 2024 4IT. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, error: 'فشل في إرسال البريد' };
  }
}

// إرسال إشعار انتهاء الاشتراك
export async function sendSubscriptionExpiryEmail(email: string, siteName: string, daysLeft: number) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `تنبيه: اشتراكك في ${siteName} على وشك الانتهاء`,
    html: `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { font-size: 32px; font-weight: bold; color: #ea580c; }
          .content { text-align: center; }
          .button { display: inline-block; padding: 15px 40px; background: #ea580c; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .alert { background: #fff7ed; border: 2px solid #fb923c; padding: 20px; border-radius: 8px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">⏰ 4IT</div>
          </div>
          <div class="content">
            <h2>تنبيه اشتراك</h2>
            <div class="alert">
              <h3 style="color: #ea580c; margin: 0 0 10px 0;">اشتراكك على وشك الانتهاء!</h3>
              <p style="font-size: 18px; margin: 0;">
                متبقي <strong>${daysLeft}</strong> ${daysLeft === 1 ? 'يوم' : 'أيام'} على انتهاء اشتراكك
              </p>
            </div>
            <p>لضمان استمرار خدماتك دون انقطاع، يرجى تجديد اشتراكك الآن.</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/subscription" class="button">تجديد الاشتراك</a>
          </div>
          <div class="footer">
            <p>© 2024 4IT. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending subscription expiry email:', error);
    return { success: false, error: 'فشل في إرسال البريد' };
  }
}
