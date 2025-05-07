
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Utensils } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const Orders = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
  
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
    
    if (user) {
      fetchOrders();
    }
  }, [user, authLoading, navigate]);
  
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching orders for user:', user?.id);
      
      const { data: ordersData, error } = await supabase
        .from('orders')
        .select('*, restaurants(name, image)')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      console.log('Orders fetched:', ordersData?.length || 0);
      setOrders(ordersData || []);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast({
        title: 'Error',
        description: 'Failed to load orders',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleViewOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setIsOrderDetailsOpen(true);
  };
  
  const getStatusClassName = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (authLoading || isLoading) {
    return (
      <Layout>
        <div className="container py-10 flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-foodly-red" />
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>
        
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="active">Active Orders</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {renderOrdersTable(orders)}
          </TabsContent>
          
          <TabsContent value="active" className="space-y-4">
            {renderOrdersTable(orders.filter(order => ['pending', 'preparing', 'ready'].includes(order.status)))}
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-4">
            {renderOrdersTable(orders.filter(order => ['delivered', 'cancelled'].includes(order.status)))}
          </TabsContent>
        </Tabs>
        
        {/* Order Details Dialog */}
        <Dialog open={isOrderDetailsOpen} onOpenChange={setIsOrderDetailsOpen}>
          <DialogContent className="max-w-md sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
            </DialogHeader>
            
            {selectedOrder && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {selectedOrder.restaurants?.image && (
                      <img 
                        src={selectedOrder.restaurants.image} 
                        alt={selectedOrder.restaurants?.name} 
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <p className="font-medium">{selectedOrder.restaurants?.name || 'Unknown Restaurant'}</p>
                      <p className="text-xs text-gray-500">
                        Order #{selectedOrder.id.slice(0, 8)} • {new Date(selectedOrder.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClassName(selectedOrder.status)}`}>
                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                  </div>
                </div>
                
                <div className="border-t pt-2">
                  <p className="text-sm text-gray-500 mb-2">Delivery Address</p>
                  {selectedOrder.address && (
                    <>
                      <p>{selectedOrder.address.street}</p>
                      <p>{selectedOrder.address.city}, {selectedOrder.address.state} {selectedOrder.address.zipCode}</p>
                    </>
                  )}
                </div>
                
                <div className="border-t pt-2">
                  <p className="text-sm text-gray-500 mb-2">Items</p>
                  {Array.isArray(selectedOrder.items) && selectedOrder.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between py-1 border-b last:border-0">
                      <p>{item.quantity}x {item.name}</p>
                      <p>${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                  
                  <div className="mt-2 pt-2">
                    <div className="flex justify-between text-sm">
                      <p>Subtotal</p>
                      <p>${(selectedOrder.total - selectedOrder.delivery_fee + selectedOrder.discount).toFixed(2)}</p>
                    </div>
                    {selectedOrder.discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <p>Discount</p>
                        <p>-${selectedOrder.discount.toFixed(2)}</p>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <p>Delivery Fee</p>
                      <p>${selectedOrder.delivery_fee.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between font-bold mt-1 pt-1 border-t">
                      <p>Total</p>
                      <p>${selectedOrder.total.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
  
  function renderOrdersTable(ordersToDisplay: any[]) {
    if (ordersToDisplay.length === 0) {
      return (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-gray-500">No orders found.</p>
          </CardContent>
        </Card>
      );
    }
    
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Restaurant</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ordersToDisplay.map((order) => (
                <TableRow key={order.id} className="cursor-pointer hover:bg-gray-50">
                  <TableCell className="font-medium">{order.id.slice(0, 8)}</TableCell>
                  <TableCell>{order.restaurants?.name || 'Unknown Restaurant'}</TableCell>
                  <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClassName(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewOrderDetails(order)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }
};

export default Orders;
