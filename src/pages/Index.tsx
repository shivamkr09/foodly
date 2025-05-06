
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import CategoryFilter from '@/components/CategoryFilter';
import RestaurantCard from '@/components/RestaurantCard';
import { restaurants, categories } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { user } = useAuth();

  const filteredRestaurants = selectedCategory
    ? restaurants.filter(restaurant => restaurant.cuisine.toLowerCase().includes(selectedCategory.toLowerCase()))
    : restaurants;

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-foodly-red text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Delicious Food Delivered To Your Door
            </h1>
            <p className="text-lg mb-8">
              Browse restaurants, build your order and get it delivered right to your doorstep.
            </p>
            <Link to="/restaurants">
              <Button className="bg-white text-foodly-red hover:bg-gray-100">
                Browse Restaurants
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Popular Restaurants</h2>
            <Link to="/restaurants" className="text-foodly-red font-medium">
              View All
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.slice(0, 6).map(restaurant => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        </div>
      </section>

      {/* App Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-foodly-warmYellow rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="font-bold text-2xl">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Choose a Restaurant</h3>
              <p className="text-foodly-lightText">Browse from our diverse range of restaurants and cuisines</p>
            </div>
            
            <div className="text-center">
              <div className="bg-foodly-warmYellow rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="font-bold text-2xl">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Select Your Meals</h3>
              <p className="text-foodly-lightText">Customize your order with your favorite dishes and add-ons</p>
            </div>
            
            <div className="text-center">
              <div className="bg-foodly-warmYellow rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="font-bold text-2xl">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Delivery to Your Door</h3>
              <p className="text-foodly-lightText">Track your order and enjoy delicious food at your doorstep</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
