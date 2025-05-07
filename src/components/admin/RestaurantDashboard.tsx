
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
      <div className="container py-10 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-foodly-red" />
      </div>
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

export default RestaurantDashboard;
