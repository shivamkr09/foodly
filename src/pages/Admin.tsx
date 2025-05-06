
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
    } catch (error: any) {
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
  
  useEffect(() => {
    if (user) {
      fetchRestaurantId();
    }
  }, [user]);

  useEffect(() => {
    if (restaurantId) {
      fetchMenuItems();
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
        <Button className="bg-foodly-red hover:bg-red-700">
          <Plus className="h-4 w-4 mr-2" /> Add New Item
        </Button>
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
                  <Button size="sm" variant="outline" className="flex-1">
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button size="sm" variant="destructive" className="flex-1">
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-10 border rounded-lg">
            <p className="text-gray-500">No menu items yet. Click "Add New Item" to create your first menu item.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Order Management Component
const OrderManagement = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);

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

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!restaurantId) {
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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Orders</h2>
      
      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </div>
                </div>
                <CardDescription>
                  {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Items:</h4>
                  {Array.isArray(order.items) && order.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>
                        {item.quantity}x {item.name}
                      </span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t mt-2">
                    <div className="flex justify-between font-medium">
                      <span>Total:</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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
