import { getSuperAdminServices } from '@/lib/actions/services';
import { getContent } from '@/lib/actions/content';
import { getContactInfo, getSocialLinks } from '@/lib/actions/settings';
import HeroSection from '@/components/public/HeroSection';
import ServicesSection from '@/components/public/ServicesSection';
import AboutSection from '@/components/public/AboutSection';
import TeamContractSection from '@/components/public/TeamContractSection';
import ContactSection from '@/components/public/ContactSection';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';

export const runtime = 'nodejs';

export default async function HomePage() {
  const [servicesRes, heroRes, aboutRes, contactRes, socialRes] = await Promise.all([
    getSuperAdminServices(),
    getContent('hero'),
    getContent('about'),
    getContactInfo(),
    getSocialLinks(),
  ]);

  return (
    <div className="min-h-screen">
      <Header contactInfo={contactRes.data} />
      <main>
        <HeroSection content={heroRes.data} />
        <ServicesSection services={servicesRes.data || []} />
        <TeamContractSection />
        <AboutSection content={aboutRes.data} />
        <ContactSection
          contactInfo={contactRes.data}
          socialLinks={socialRes.data || []}
        />
      </main>
      <Footer />
    </div>
  );
}