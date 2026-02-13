import { connectDB } from '@/lib/db';
import { Service, Site, ContactInfo } from '@/models';
import SubscribersServicesView from '@/components/public/SubscribersServicesView';

export const runtime = 'nodejs';

async function getAllSubscribersServices() {
  try {
    await connectDB();
    
    // Get all active services with site and contact info
    const services = await Service.find({ isActive: true })
      .populate('siteId')
      .sort({ createdAt: -1 })
      .lean();
    
    // Get contact info for each site
    const servicesWithContact = await Promise.all(
      services.map(async (service: any) => {
        if (service.siteId) {
          const contactInfo = await ContactInfo.findOne({ 
            siteId: service.siteId._id 
          }).lean();
          
          return {
            ...service,
            site: service.siteId,
            contactInfo: contactInfo ? JSON.parse(JSON.stringify(contactInfo)) : null,
          };
        }
        return service;
      })
    );
    
    return JSON.parse(JSON.stringify(servicesWithContact));
  } catch (error) {
    console.error('Error fetching subscribers services:', error);
    return [];
  }
}

export default async function SubscribersServicesPage() {
  const services = await getAllSubscribersServices();

  return <SubscribersServicesView services={services} />;
}

export const metadata = {
  title: 'خدمات المشتركين - 4IT',
  description: 'تصفح خدمات جميع المشتركين في منصة 4IT',
};
