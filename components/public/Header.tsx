'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface HeaderProps {
  contactInfo: any;
}

export default function Header({ contactInfo }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      
      // تحديد القسم النشط
      const sections = ['hero', 'services', 'about', 'contact'];
      const scrollPosition = window.scrollY + 100;
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '#hero', label: 'الرئيسية', id: 'hero' },
    { href: '#services', label: 'خدماتنا', id: 'services' },
    { href: '/subscribers-services', label: 'خدمات المشتركين', external: true },
    { href: '#about', label: 'من نحن', id: 'about' },
    { href: '#contact', label: 'اتصل بنا', id: 'contact' },
  ];

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string, external?: boolean) => {
    if (external) return;
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 mb-4 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] py-2 border-b border-white/20' 
          : 'bg-gradient-to-b from-black/20 to-transparent backdrop-blur-sm py-5'
      }`}
    >
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo - اليمين */}
          <Link href="/" className="group relative z-10">
            <div className="relative">
              <div className={`
                absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full 
                transition-all duration-500 opacity-0 group-hover:opacity-100 blur-md
                ${scrolled ? 'scale-110' : 'scale-125'}
              `} />
              
              <div className={`
                relative bg-white rounded-full flex items-center justify-center 
                transition-all duration-500 ease-out shadow-2xl
                border-2 border-white/50
                ${scrolled 
                  ? 'w-14 h-14 p-2.5 shadow-blue-500/10' 
                  : 'w-24 h-24 p-4 shadow-blue-500/20'
                }
                group-hover:border-blue-400 group-hover:shadow-blue-500/30
                group-hover:scale-110
              `}>
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 w-full h-full">
                  <Image 
                    src="/logo.png" 
                    alt="4IT Logo" 
                    width={scrolled ? 56 : 96}
                    height={scrolled ? 56 : 96}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                    priority
                  />
                </div>
              </div>

              {!scrolled && (
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <span className="text-xs font-bold text-white/90 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20 shadow-lg">
                    4IT Solutions
                  </span>
                </div>
              )}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-white/90 backdrop-blur-xl px-4 py-1.5 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-white/50 hover:border-white/80 transition-all">
            {navItems.map((item) => {
              const isActive = !item.external && item.id === activeSection;
              
              return item.external ? (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative px-5 py-2.5 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-xl group transition-all duration-300"
                >
                  <span className="relative z-10">{item.label}</span>
                  <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ) : (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => scrollToSection(e, item.href)}
                  className={`relative px-5 py-2.5 text-sm font-medium rounded-xl group transition-all duration-300 ${
                    isActive 
                      ? 'text-blue-600 bg-gradient-to-r from-blue-50 to-indigo-50' 
                      : 'text-slate-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50'
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
                  )}
                  <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              );
            })}
          </nav>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`
              md:hidden p-2.5 rounded-xl transition-all duration-300
              ${scrolled 
                ? 'bg-white/90 text-slate-800 shadow-lg backdrop-blur-sm border border-white/50' 
                : 'bg-white/20 text-slate-800 backdrop-blur-sm border border-white/30 hover:bg-white/30'
              }
            `}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>

        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-4 right-4 mt-2 bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-3 flex flex-col gap-1 animate-fadeIn">
            {navItems.map((item) => {
              const isActive = !item.external && item.id === activeSection;
              
              return item.external ? (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-3.5 text-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 rounded-xl font-medium transition-all group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="flex items-center gap-3">
                    <span className="w-1 h-1 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item.label}
                  </span>
                </Link>
              ) : (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    scrollToSection(e, item.href);
                    setIsMenuOpen(false);
                  }}
                  className={`block px-4 py-3.5 rounded-xl font-medium transition-all group ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600'
                      : 'text-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className={`w-1 h-1 bg-blue-600 rounded-full transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                    {item.label}
                  </span>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}