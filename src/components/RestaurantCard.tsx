
import React from 'react';
import { Link } from 'react-router-dom';
import { Restaurant } from '@/data/models';
import { Star } from 'lucide-react';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

const RestaurantCard = ({ restaurant }: RestaurantCardProps) => {
  return (
    <Link 
      to={`/restaurants/${restaurant.id}`}
      className="block bg-white rounded-lg shadow-sm overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-md animate-fade-in"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={restaurant.image} 
          alt={restaurant.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-2 right-2 bg-white px-2 py-1 rounded-md text-sm font-medium flex items-center">
          <Star className="text-yellow-500 w-4 h-4 mr-1" />
          {restaurant.rating}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg text-foodly-darkText">{restaurant.name}</h3>
        <p className="text-sm text-foodly-lightText">{restaurant.cuisine}</p>
        
        <div className="flex justify-between items-center mt-2 text-sm text-foodly-lightText">
          <span>${restaurant.deliveryFee.toFixed(2)} delivery</span>
          <span>{restaurant.deliveryTime}</span>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
