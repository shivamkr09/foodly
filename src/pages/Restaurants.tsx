
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import CategoryFilter from '@/components/CategoryFilter';
import RestaurantCard from '@/components/RestaurantCard';
import { restaurants, categories } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const Restaurants = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesCategory = !selectedCategory || 
      restaurant.cuisine.toLowerCase().includes(selectedCategory.toLowerCase());
    
    const matchesSearch = !searchQuery || 
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Restaurants</h1>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search restaurants or cuisines..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredRestaurants.map(restaurant => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
          
          {filteredRestaurants.length === 0 && (
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl font-medium text-foodly-darkText">No restaurants found</h3>
              <p className="text-foodly-lightText mt-2">Try adjusting your search or filter</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Restaurants;
