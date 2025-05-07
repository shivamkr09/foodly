
import React from 'react';
import Navbar from './Navbar';
import MobileNavbar from './MobileNavbar';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className={`flex-grow ${isMobile ? 'pb-16' : ''}`}>
        {children}
      </main>
      <MobileNavbar />
      <footer className={`py-6 bg-gray-100 ${isMobile ? 'hidden' : 'block'}`}>
        <div className="container mx-auto px-4 text-center text-foodly-lightText">
          <p>&copy; {new Date().getFullYear()} Foodly. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
