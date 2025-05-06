
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import RestaurantCard from '@/components/RestaurantCard';
import CategoryFilter from '@/components/CategoryFilter';
import { supabase } from '@/integrations/supabase/client';
import { Restaurant } from '@/data/models';
import { Loader2 } from 'lucide-react';

const Restaurants = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Fetch restaurants from Supabase
  const { data: restaurants, isLoading, error } = useQuery({
    queryKey: ['restaurants'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*');
        
      if (error) throw error;
      
      return data as Restaurant[];
    }
  });
  
  // Fetch categories from Supabase
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*');
        
      if (error) throw error;
      
      return data;
    }
  });

  // Filter restaurants by selected category
  const filteredRestaurants = selectedCategory
    ? restaurants?.filter(restaurant => 
        restaurant.cuisine.toLowerCase().includes(selectedCategory.toLowerCase()))
    : restaurants;

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">All Restaurants</h1>
        
        {categories && (
          <div className="mb-8">
            <CategoryFilter 
              categories={categories.map(cat => ({ 
                id: cat.id, 
                name: cat.name,
                icon: cat.icon 
              }))}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>
        )}
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-foodly-red" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500">Error loading restaurants. Please try again later.</p>
          </div>
        ) : filteredRestaurants && filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map(restaurant => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-lg text-gray-600">
              {selectedCategory 
                ? `No restaurants found in the "${selectedCategory}" category.`
                : "No restaurants found."}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Restaurants;
