
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/components/ui/table';

const OrderManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    if (user) {
      fetchRestaurantId();
    }
  }, [user]);

  useEffect(() => {
    if (restaurantId) {
      fetchOrders();
    }
  }, [restaurantId]);

  const fetchRestaurantId = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('restaurants')
        .select('id')
        .eq('owner_id', user?.id)
        .single();

      if (error) {
        console.error('Error fetching restaurant ID:', error);
        toast({
          title: 'Error',
          description: 'Could not find your restaurant. Please make sure you have created one.',
          variant: 'destructive',
        });
      }

      if (data) {
        setRestaurantId(data.id);
        console.log('Restaurant ID found:', data.id);
      } else {
        console.log('No restaurant found for current user');
      }
    } catch (error) {
      console.error('Exception in fetchRestaurantId:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching orders for restaurant:', restaurantId);
      
      // First fetch all orders for this restaurant
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('created_at', { ascending: false });
      
      if (ordersError) {
        console.error('Error fetching orders:', ordersError);
        throw ordersError;
      }
      
      console.log('Orders found:', ordersData?.length || 0);
      
      // If we have orders, fetch the user profiles separately
      if (ordersData && ordersData.length > 0) {
        // Get unique user IDs from orders
        const userIds = [...new Set(ordersData.map(order => order.user_id))];
        console.log('Unique user IDs:', userIds);
        
        // Fetch profiles for these users
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, name, email, phone')
          .in('id', userIds);
        
        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          throw profilesError;
        }
        
        console.log('Profiles found:', profilesData?.length || 0);
        
        // Create a map of profiles by user ID for quick lookup
        const profilesMap = {};
        if (profilesData) {
          profilesData.forEach(profile => {
            profilesMap[profile.id] = profile;
          });
        }
        
        // Combine order data with profile data
        const ordersWithProfiles = ordersData.map(order => ({
          ...order,
          profiles: profilesMap[order.user_id] || null
        }));
        
        setOrders(ordersWithProfiles);
        console.log('Orders with profiles:', ordersWithProfiles);
      } else {
        console.log('No orders found');
        setOrders([]);
      }
    } catch (error) {
      console.error('Error in fetchOrders:', error);
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

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setIsUpdatingStatus(true);
      
      const { error } = await supabase
        .from('orders')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);
      
      if (error) throw error;
      
      toast({
        title: 'Order Updated',
        description: `Order status has been updated to ${newStatus}.`
      });
      
      fetchOrders();
      setIsOrderDetailsOpen(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update order status',
        variant: 'destructive',
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!restaurantId && !isLoading) {
    return (
      <div className="p-6 text-center">
        <p>You need to create a restaurant before accessing orders.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-foodly-red" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Orders</h2>
      
      {orders.length > 0 ? (
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                You have {orders.length} order{orders.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id.slice(0, 8)}</TableCell>
                      <TableCell>{order.profiles?.name || 'Anonymous'}</TableCell>
                      <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>${order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewOrderDetails(order)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          {/* Order Details Dialog */}
          <Dialog open={isOrderDetailsOpen} onOpenChange={setIsOrderDetailsOpen}>
            <DialogContent className="max-w-md sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Order Details</DialogTitle>
              </DialogHeader>
              
              {selectedOrder && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Order ID</p>
                      <p className="font-medium">{selectedOrder.id.slice(0, 8)}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                    </div>
                  </div>
                  
                  <div className="border-t pt-2">
                    <p className="text-sm text-gray-500 mb-2">Customer Information</p>
                    <p className="font-medium">{selectedOrder.profiles?.name || 'Anonymous'}</p>
                    <p className="text-sm">{selectedOrder.profiles?.email || 'No email provided'}</p>
                    <p className="text-sm">{selectedOrder.profiles?.phone || 'No phone provided'}</p>
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
                      <div key={idx} className="flex justify-between py-1">
                        <p>{item.quantity}x {item.name}</p>
                        <p>${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                    
                    <div className="border-t mt-2 pt-2">
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
                  
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-500 mb-2">Update Order Status</p>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedOrder.status !== 'preparing' && (
                        <Button 
                          variant="outline"
                          disabled={isUpdatingStatus}
                          onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'preparing')}
                        >
                          {isUpdatingStatus && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Preparing
                        </Button>
                      )}
                      {selectedOrder.status !== 'ready' && (
                        <Button 
                          variant="outline"
                          disabled={isUpdatingStatus}
                          onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'ready')}
                        >
                          {isUpdatingStatus && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Ready
                        </Button>
                      )}
                      {selectedOrder.status !== 'delivered' && (
                        <Button 
                          className="bg-foodly-red hover:bg-red-700"
                          disabled={isUpdatingStatus}
                          onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'delivered')}
                        >
                          {isUpdatingStatus && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Delivered
                        </Button>
                      )}
                      {selectedOrder.status !== 'cancelled' && (
                        <Button 
                          variant="destructive"
                          disabled={isUpdatingStatus}
                          onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'cancelled')}
                        >
                          {isUpdatingStatus && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div className="text-center py-10 border rounded-lg">
          <p className="text-gray-500">No orders yet.</p>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
