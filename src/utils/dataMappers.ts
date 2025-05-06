
import { Json } from "@/integrations/supabase/types";
import { MenuItem, Restaurant } from "@/data/models";

// Convert from Supabase restaurant data to app Restaurant model
export const mapSupabaseRestaurant = (restaurant: any): Restaurant => {
  return {
    id: restaurant.id,
    name: restaurant.name,
    description: restaurant.description,
    image: restaurant.image,
    cuisine: restaurant.cuisine,
    rating: restaurant.rating || 0,
    deliveryFee: restaurant.delivery_fee,
    deliveryTime: restaurant.delivery_time
  };
};

// Convert from Supabase menu item data to app MenuItem model
export const mapSupabaseMenuItem = (menuItem: any): MenuItem => {
  return {
    id: menuItem.id,
    restaurantId: menuItem.restaurant_id,
    name: menuItem.name,
    description: menuItem.description,
    image: menuItem.image,
    price: menuItem.price,
    category: menuItem.category,
    options: menuItem.options as MenuItem['options'],
    isAvailable: menuItem.is_available
  };
};
