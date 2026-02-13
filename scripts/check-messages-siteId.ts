import 'dotenv/config';
import { connectDB } from '../lib/db';
import { Message, Site } from '../models';

async function checkMessages() {
  try {
    await connectDB();
    
    console.log('🔍 التحقق من الرسائل...\n');
    
    const messages = await Message.find().lean();
    const sites = await Site.find().lean();
    
    console.log(`📊 إحصائيات:`);
    console.log(`   - عدد المواقع: ${sites.length}`);
    console.log(`   - عدد الرسائل: ${messages.length}`);
    console.log(`   - رسائل بدون siteId: ${messages.filter(m => !m.siteId).length}`);
    console.log(`   - رسائل مع siteId: ${messages.filter(m => m.siteId).length}\n`);
    
    if (messages.filter(m => !m.siteId).length > 0) {
      console.log('⚠️  يوجد رسائل بدون siteId!');
      console.log('   يجب ربط هذه الرسائل بموقع معين\n');
      
      if (sites.length > 0) {
        console.log('💡 اقتراح: يمكنك ربط جميع الرسائل القديمة بأول موقع:');
        console.log(`   الموقع: ${sites[0].nameAr} (${sites[0].slug})`);
        console.log(`   ID: ${sites[0]._id}\n`);
      }
    } else {
      console.log('✅ جميع الرسائل مرتبطة بمواقع!\n');
    }
    
    // عرض تفاصيل الرسائل
    console.log('📋 تفاصيل الرسائل:\n');
    for (const message of messages) {
      const site = sites.find(s => s._id.toString() === message.siteId?.toString());
      console.log(`   - ${message.name} (${message.email})`);
      console.log(`     الموقع: ${site ? site.nameAr : '❌ غير مرتبط'}`);
      console.log(`     التاريخ: ${new Date(message.createdAt).toLocaleDateString('ar-SA')}\n`);
    }
    
  } catch (error) {
    console.error('❌ خطأ:', error);
  } finally {
    process.exit();
  }
}

checkMessages();
