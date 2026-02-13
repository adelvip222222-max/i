import { connectDB } from '../lib/db';
import { ContactInfo, SocialLink } from '../models';

async function addContactInfo() {
  try {
    console.log('🔌 Connecting to database...');
    await connectDB();

    console.log('📞 Adding contact information...');

    // Contact Info
    const contactData = {
      phone: '+20 102 251 4158',
      email: 'info@4it.com',
      address: 'القاهرة، مصر',
    };

    // Check if contact info exists
    const existingContact = await ContactInfo.findOne();
    
    if (existingContact) {
      console.log('⚠️  Contact info already exists, updating...');
      await ContactInfo.findByIdAndUpdate(existingContact._id, contactData);
      console.log('✅ Contact info updated successfully!');
    } else {
      await ContactInfo.create(contactData);
      console.log('✅ Contact info added successfully!');
    }

    console.log('\n📋 Contact Info:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📞 الهاتف: ${contactData.phone}`);
    console.log(`📧 البريد: ${contactData.email}`);
    console.log(`📍 العنوان: ${contactData.address}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Social Links
    console.log('🔗 Adding social links...');

    const socialLinks = [
      {
        platform: 'Facebook',
        url: 'https://facebook.com/4it',
        icon: 'facebook',
        order: 1,
      },
      {
        platform: 'Twitter',
        url: 'https://twitter.com/4it',
        icon: 'twitter',
        order: 2,
      },
      {
        platform: 'Instagram',
        url: 'https://instagram.com/4it',
        icon: 'instagram',
        order: 3,
      },
      {
        platform: 'LinkedIn',
        url: 'https://linkedin.com/company/4it',
        icon: 'linkedin',
        order: 4,
      },
    ];

    // Clear existing social links and add new ones
    await SocialLink.deleteMany({});
    await SocialLink.insertMany(socialLinks);
    console.log('✅ Social links added successfully!');

    console.log('\n📋 Social Links:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    socialLinks.forEach((link) => {
      console.log(`🔗 ${link.platform}: ${link.url}`);
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('✨ Done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding contact info:', error);
    process.exit(1);
  }
}

addContactInfo();
