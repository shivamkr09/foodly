
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Search, ShoppingCart, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  
  return (
    <nav className="sticky top-0 z-20 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-foodly-red">
          FOODLY
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-foodly-darkText hover:text-foodly-red transition-colors">
            Home
          </Link>
          <Link to="/restaurants" className="text-foodly-darkText hover:text-foodly-red transition-colors">
            Restaurants
          </Link>
          <Link to="/about" className="text-foodly-darkText hover:text-foodly-red transition-colors">
            About
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Search className="h-5 w-5" />
          </Button>
          
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-foodly-red text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Button>
          </Link>

          {user ? (
            <div className="relative group">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
              
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 hidden group-hover:block">
                <div className="px-4 py-2 text-sm text-foodly-darkText border-b">
                  {user.name}
                </div>
                
                <Link to="/profile" className="block px-4 py-2 text-sm text-foodly-darkText hover:bg-foodly-gray">
                  Profile
                </Link>
                
                <Link to="/orders" className="block px-4 py-2 text-sm text-foodly-darkText hover:bg-foodly-gray">
                  Orders
                </Link>
                
                {user.isAdmin && (
                  <Link to="/admin" className="block px-4 py-2 text-sm text-foodly-darkText hover:bg-foodly-gray">
                    Admin Dashboard
                  </Link>
                )}
                
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-sm text-foodly-darkText hover:bg-foodly-gray"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="outline" className="hidden md:flex">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
