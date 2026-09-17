import React from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { AuthModal } from '../auth/AuthModal';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  // Isolated dedicated portals: Admin, Dealer/Agency panel, and Customer Portal
  const isDedicatedPortal =
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/dealer') ||
    location.pathname.startsWith('/account');

  if (isDedicatedPortal) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-[#0A172F]">
        {children}
        <AuthModal />
      </div>
    );
  }

  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0A172F]">
      <Header />
      <main className={`flex-1 w-full ${isHomePage ? '' : 'max-w-7xl mx-auto px-4 py-6'}`}>
        {children}
      </main>
      <Footer />
      {/* Global OTP Auth Modal */}
      <AuthModal />
    </div>
  );
};
