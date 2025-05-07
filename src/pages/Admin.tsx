
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

// Import refactored components
import RestaurantDashboard from '@/components/admin/RestaurantDashboard';
import MenuManagement from '@/components/admin/MenuManagement';
import OrderManagement from '@/components/admin/OrderManagement';

// Main Admin Component
const Admin = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  if (isLoading || !user) {
    return (
      <Layout>
        <div className="container py-10 flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-foodly-red" />
        </div>
      </Layout>
    );
  }

  // Redirect if not a restaurant owner
  if (!user.isAdmin) {
    navigate('/');
    return null;
  }

  return (
    <Layout>
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">Restaurant Dashboard</h1>
        
        <Tabs defaultValue="restaurant" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-lg mb-4">
            <TabsTrigger value="restaurant">Restaurant</TabsTrigger>
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>
          
          <TabsContent value="restaurant" className="space-y-4">
            <RestaurantDashboard />
          </TabsContent>
          
          <TabsContent value="menu" className="space-y-4">
            <MenuManagement />
          </TabsContent>
          
          <TabsContent value="orders" className="space-y-4">
            <OrderManagement />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Admin;
