
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Utensils, ShoppingCart, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useIsMobile } from '@/hooks/use-mobile';

const MobileNavbar = () => {
  const { user } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  if (!isMobile) {
    return null;
  }
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t shadow-sm md:hidden">
      <div className="flex items-center justify-around">
        <NavItem 
          to="/" 
          icon={<Home size={20} />} 
          label="Home" 
          active={isActive('/')} 
        />
        <NavItem 
          to="/restaurants" 
          icon={<Utensils size={20} />} 
          label="Restaurants" 
          active={isActive('/restaurants')} 
        />
        <NavItem 
          to="/cart" 
          icon={
            <div className="relative">
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-foodly-red text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </div>
          } 
          label="Cart" 
          active={isActive('/cart')} 
        />
        <NavItem 
          to={user ? "/profile" : "/login"} 
          icon={<User size={20} />} 
          label={user ? "Profile" : "Login"} 
          active={isActive('/profile') || isActive('/login')} 
        />
      </div>
    </div>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

const NavItem = ({ to, icon, label, active }: NavItemProps) => (
  <Link
    to={to}
    className={cn(
      "flex flex-col items-center py-2 px-4",
      active ? "text-foodly-red" : "text-gray-500"
    )}
  >
    <div>{icon}</div>
    <span className="text-xs mt-1">{label}</span>
  </Link>
);

export default MobileNavbar;
