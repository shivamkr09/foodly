
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import MenuItemForm from '@/components/MenuItemForm';
import CategoryForm from '@/components/CategoryForm';
import { mapSupabaseMenuItem } from '@/utils/dataMappers';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell,
  TableCaption, 
  TableFooter 
} from '@/components/ui/table';

// Restaurant Dashboard Component
const RestaurantDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [restaurant, setRestaurant] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [deliveryFee, setDeliveryFee] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');

  useEffect(() => {
    if (user) {
      fetchRestaurantData();
    }
  }, [user]);

  const fetchRestaurantData = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('owner_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setRestaurant(data);
        // Populate form with existing data
        setName(data.name);
        setDescription(data.description);
        setImage(data.image);
        setCuisine(data.cuisine);
        setDeliveryFee(data.delivery_fee.toString());
        setDeliveryTime(data.delivery_time);
      }
    } catch (error) {
      console.error('Error fetching restaurant data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load restaurant data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      const restaurantData = {
        name,
        description,
        image,
        cuisine,
        delivery_fee: parseFloat(deliveryFee),
        delivery_time: deliveryTime,
        owner_id: user?.id,
      };
      
      let result;
      
      if (restaurant) {
        // Update existing restaurant
        result = await supabase
          .from('restaurants')
          .update(restaurantData)
          .eq('id', restaurant.id);
      } else {
        // Create new restaurant
        result = await supabase
          .from('restaurants')
          .insert([restaurantData]);
      }
      
      if (result.error) {
        throw result.error;
      }
      
      toast({
        title: restaurant ? 'Restaurant Updated' : 'Restaurant Created',
        description: restaurant ? 'Your restaurant details have been updated.' : 'Your restaurant has been created successfully.',
      });
      
      fetchRestaurantData();
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving restaurant:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save restaurant data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-10 flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-foodly-red" />
        </div>
      </Layout>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Restaurant Details</h2>
        {restaurant && !isEditing && (
          <Button onClick={() => setIsEditing(true)} variant="outline">
            <Edit className="h-4 w-4 mr-2" /> Edit Details
          </Button>
        )}
      </div>
      
      {(isEditing || !restaurant) ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Restaurant Name</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input 
              id="image" 
              value={image} 
              onChange={(e) => setImage(e.target.value)} 
              required 
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cuisine">Cuisine Type</Label>
            <Input 
              id="cuisine" 
              value={cuisine} 
              onChange={(e) => setCuisine(e.target.value)} 
              required 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="deliveryFee">Delivery Fee ($)</Label>
              <Input 
                id="deliveryFee" 
                type="number"
                step="0.01"
                min="0"
                value={deliveryFee} 
                onChange={(e) => setDeliveryFee(e.target.value)} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deliveryTime">Delivery Time</Label>
              <Input 
                id="deliveryTime" 
                value={deliveryTime} 
                onChange={(e) => setDeliveryTime(e.target.value)} 
                required 
                placeholder="15-25 min" 
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading} className="bg-foodly-red hover:bg-red-700">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {restaurant ? 'Update Restaurant' : 'Create Restaurant'}
            </Button>
            {isEditing && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="col-span-1">
              <img 
                src={restaurant.image} 
                alt={restaurant.name} 
                className="w-full h-48 object-cover rounded-md"
              />
            </div>
            <div className="col-span-2 space-y-4">
              <h3 className="text-xl font-bold">{restaurant.name}</h3>
              <p className="text-gray-600">{restaurant.description}</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Cuisine:</p>
                  <p>{restaurant.cuisine}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Delivery Fee:</p>
                  <p>${restaurant.delivery_fee.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Delivery Time:</p>
                  <p>{restaurant.delivery_time}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Rating:</p>
                  <p>{restaurant.rating || 'No ratings yet'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Menu Management Component
const MenuManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isAddMenuItemOpen, setIsAddMenuItemOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<any | null>(null);
  
  useEffect(() => {
    if (user) {
      fetchRestaurantId();
    }
  }, [user]);

  useEffect(() => {
    if (restaurantId) {
      fetchMenuItems();
      fetchCategories();
    }
  }, [restaurantId]);

  const fetchRestaurantId = async () => {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('id')
        .eq('owner_id', user?.id)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setRestaurantId(data.id);
      }
    } catch (error) {
      console.error('Error fetching restaurant ID:', error);
    }
  };

  const fetchMenuItems = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('name');

      if (error) {
        throw error;
      }

      setMenuItems(data || []);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      toast({
        title: 'Error',
        description: 'Failed to load menu items',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: 'Error',
        description: 'Failed to load categories',
        variant: 'destructive',
      });
    }
  };

  const handleAddMenuItem = async (formData: any) => {
    try {
      setIsSubmitting(true);
      
      const menuItemData = {
        restaurant_id: restaurantId,
        name: formData.name,
        description: formData.description,
        price: formData.price,
        category: formData.category,
        image: formData.image,
        is_available: formData.isAvailable
      };
      
      let result;
      
      if (editingMenuItem) {
        // Update existing menu item
        result = await supabase
          .from('menu_items')
          .update(menuItemData)
          .eq('id', editingMenuItem.id);
      } else {
        // Create new menu item
        result = await supabase
          .from('menu_items')
          .insert([menuItemData]);
      }
      
      if (result.error) {
        throw result.error;
      }
      
      toast({
        title: editingMenuItem ? 'Menu Item Updated' : 'Menu Item Created',
        description: editingMenuItem ? 'Your menu item has been updated.' : 'Your menu item has been added to your menu.',
      });
      
      setIsAddMenuItemOpen(false);
      setEditingMenuItem(null);
      fetchMenuItems();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save menu item',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddCategory = async (formData: any) => {
    try {
      setIsSubmitting(true);
      
      const { data, error } = await supabase
        .from('categories')
        .insert([{
          name: formData.name,
          icon: formData.icon || null
        }])
        .select();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Category Created',
        description: 'Your category has been created successfully.',
      });
      
      setIsAddCategoryOpen(false);
      fetchCategories();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create category',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditMenuItem = (item: any) => {
    const formattedItem = mapSupabaseMenuItem(item);
    setEditingMenuItem({
      ...formattedItem,
      id: item.id
    });
    setIsAddMenuItemOpen(true);
  };

  const handleDeleteMenuItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Menu Item Deleted',
        description: 'The menu item has been removed from your menu.',
      });
      
      fetchMenuItems();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete menu item',
        variant: 'destructive',
      });
    }
  };

  if (!restaurantId) {
    return (
      <div className="p-6 text-center">
        <p>You need to create a restaurant before managing menu items.</p>
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Menu Items</h2>
        <div className="flex gap-2">
          <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" /> New Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Category</DialogTitle>
              </DialogHeader>
              <CategoryForm 
                onSubmit={handleAddCategory} 
                isSubmitting={isSubmitting} 
              />
            </DialogContent>
          </Dialog>
          
          <Dialog open={isAddMenuItemOpen} onOpenChange={setIsAddMenuItemOpen}>
            <DialogTrigger asChild>
              <Button className="bg-foodly-red hover:bg-red-700">
                <Plus className="h-4 w-4 mr-2" /> Add Menu Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingMenuItem ? 'Edit Menu Item' : 'Add New Menu Item'}
                </DialogTitle>
              </DialogHeader>
              <MenuItemForm
                initialData={editingMenuItem}
                categories={categories}
                onSubmit={handleAddMenuItem}
                isSubmitting={isSubmitting}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuItems.length > 0 ? (
          menuItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-40 object-cover"
              />
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.category}</p>
                  </div>
                  <div className="text-base font-semibold">${item.price.toFixed(2)}</div>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                <div className="mt-3 flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleEditMenuItem(item)}
                  >
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    className="flex-1"
                    onClick={() => handleDeleteMenuItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-10 border rounded-lg">
            <p className="text-gray-500">No menu items yet. Click "Add Menu Item" to create your first menu item.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Order Management Component 
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
        throw error;
      }

      if (data) {
        setRestaurantId(data.id);
      }
    } catch (error) {
      console.error('Error fetching restaurant ID:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      
      // First fetch all orders for this restaurant
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('created_at', { ascending: false });
      
      if (ordersError) throw ordersError;
      
      // If we have orders, fetch the user profiles separately
      if (ordersData && ordersData.length > 0) {
        // Get unique user IDs from orders
        const userIds = [...new Set(ordersData.map(order => order.user_id))];
        
        // Fetch profiles for these users
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, name, email, phone')
          .in('id', userIds);
        
        if (profilesError) throw profilesError;
        
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
      } else {
        setOrders([]);
      }
    } catch (error) {
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
