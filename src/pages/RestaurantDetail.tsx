
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import CategoryFilter from '@/components/CategoryFilter';
import MenuItemCard from '@/components/MenuItemCard';
import MenuItemModal from '@/components/MenuItemModal';
import { restaurants, menuItems, mealCategories } from '@/data/mockData';
import { Restaurant, MenuItem } from '@/data/models';
import { Star } from 'lucide-react';

const RestaurantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [restaurantMenuItems, setRestaurantMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Find restaurant details
    const foundRestaurant = restaurants.find(r => r.id === id);
    if (foundRestaurant) {
      setRestaurant(foundRestaurant);
    }

    // Find menu items for this restaurant
    const foundMenuItems = menuItems.filter(item => item.restaurantId === id);
    setRestaurantMenuItems(foundMenuItems);
  }, [id]);

  const handleOpenModal = (menuItem: MenuItem) => {
    setSelectedMenuItem(menuItem);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMenuItem(null);
  };

  const filteredMenuItems = selectedCategory
    ? restaurantMenuItems.filter(item => item.category === selectedCategory)
    : restaurantMenuItems;

  if (!restaurant) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <p className="text-center">Loading restaurant details...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Restaurant Header */}
      <div className="relative h-64 md:h-80 bg-gray-200">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="container mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold">{restaurant.name}</h1>
            <div className="flex items-center mt-2">
              <Star className="text-yellow-400 w-5 h-5 mr-1" />
              <span>{restaurant.rating}</span>
              <span className="mx-2">•</span>
              <span>{restaurant.cuisine}</span>
              <span className="mx-2">•</span>
              <span>{restaurant.deliveryTime}</span>
            </div>
            <p className="mt-2">{restaurant.description}</p>
          </div>
        </div>
      </div>

      {/* Menu Content */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Menu</h2>
        
        <CategoryFilter
          categories={mealCategories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredMenuItems.map(menuItem => (
            <MenuItemCard 
              key={menuItem.id} 
              menuItem={menuItem} 
              onSelect={handleOpenModal}
            />
          ))}
          
          {filteredMenuItems.length === 0 && (
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl font-medium text-foodly-darkText">No items found</h3>
              <p className="text-foodly-lightText mt-2">Try selecting another category</p>
            </div>
          )}
        </div>
      </div>

      {/* Menu Item Modal */}
      <MenuItemModal
        menuItem={selectedMenuItem}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </Layout>
  );
};

export default RestaurantDetail;
