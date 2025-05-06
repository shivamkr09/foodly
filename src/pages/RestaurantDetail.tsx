
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Restaurant, MenuItem } from '@/data/models';
import Layout from '@/components/Layout';
import MenuItemCard from '@/components/MenuItemCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { mapSupabaseMenuItem, mapSupabaseRestaurant } from '@/utils/dataMappers';
import MenuItemModal from '@/components/MenuItemModal';

const RestaurantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Fetch restaurant details
  const { data: restaurant, isLoading: loadingRestaurant } = useQuery({
    queryKey: ['restaurant', id],
    queryFn: async () => {
      if (!id) throw new Error("Restaurant ID is required");
      
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      return mapSupabaseRestaurant(data);
    }
  });
  
  // Fetch menu items for this restaurant
  const { data: menuItems, isLoading: loadingMenu } = useQuery({
    queryKey: ['menu-items', id],
    queryFn: async () => {
      if (!id) throw new Error("Restaurant ID is required");
      
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('restaurant_id', id);
        
      if (error) throw error;
      
      return data.map(mapSupabaseMenuItem) as MenuItem[];
    },
    enabled: !!id
  });
  
  const handleSelectMenuItem = (menuItem: MenuItem) => {
    setSelectedMenuItem(menuItem);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMenuItem(null);
  };
  
  // Get unique categories from menu items
  const categories = menuItems 
    ? Array.from(new Set(menuItems.map(item => item.category)))
    : [];
  
  // Filter menu items by selected category
  const filteredItems = selectedCategory 
    ? menuItems?.filter(item => item.category === selectedCategory)
    : menuItems;
  
  if (loadingRestaurant || loadingMenu) {
    return (
      <Layout>
        <div className="container py-12 flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-10 w-10 animate-spin text-foodly-red" />
        </div>
      </Layout>
    );
  }

  if (!restaurant) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <h2 className="text-2xl font-bold">Restaurant not found</h2>
          <p className="mt-2 text-gray-600">The restaurant you're looking for doesn't exist or has been removed.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        {/* Restaurant Header */}
        <div className="relative h-64 w-full mb-8 overflow-hidden rounded-xl">
          <img 
            src={restaurant.image} 
            alt={restaurant.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
            <div className="text-white">
              <h1 className="text-3xl font-bold">{restaurant.name}</h1>
              <p className="mt-1">{restaurant.cuisine} • ${restaurant.deliveryFee.toFixed(2)} delivery fee • {restaurant.deliveryTime}</p>
            </div>
          </div>
        </div>
        
        {/* Restaurant Description */}
        <p className="text-gray-600 mb-8">{restaurant.description}</p>
        
        {/* Menu Categories */}
        {categories.length > 0 ? (
          <Tabs defaultValue={categories[0]} className="mb-8" onValueChange={setSelectedCategory}>
            <TabsList className="mb-6 flex flex-wrap space-x-2">
              {categories.map(category => (
                <TabsTrigger key={category} value={category} className="px-4 py-2">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {categories.map(category => (
              <TabsContent key={category} value={category} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {menuItems?.filter(item => item.category === category).map(item => (
                    <MenuItemCard 
                      key={item.id} 
                      menuItem={item}
                      onSelect={handleSelectMenuItem}
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">This restaurant hasn't added any menu items yet.</p>
          </div>
        )}
        
        {/* Menu Item Modal */}
        <MenuItemModal
          menuItem={selectedMenuItem}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </Layout>
  );
};

export default RestaurantDetail;
