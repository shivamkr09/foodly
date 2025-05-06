
import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="py-6 bg-gray-100">
        <div className="container mx-auto px-4 text-center text-foodly-lightText">
          <p>&copy; {new Date().getFullYear()} Foodly. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
