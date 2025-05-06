
import { Restaurant, MenuItem, Category } from './models';

export const categories: Category[] = [
  { id: 'cat-1', name: 'Main Dishes', icon: 'utensils' },
  { id: 'cat-2', name: 'Vegan', icon: 'leaf' },
  { id: 'cat-3', name: 'Street Food', icon: 'food-truck' },
  { id: 'cat-4', name: 'Desserts', icon: 'ice-cream' },
  { id: 'cat-5', name: 'Drinks', icon: 'coffee' }
];

export const mealCategories: Category[] = [
  { id: 'meal-1', name: 'Pasta' },
  { id: 'meal-2', name: 'Salad' },
  { id: 'meal-3', name: 'Seafood' },
  { id: 'meal-4', name: 'Soups' },
  { id: 'meal-5', name: 'Roasted Meats' },
  { id: 'meal-6', name: 'Oven-Baked' },
  { id: 'meal-7', name: 'Plant-Based' },
  { id: 'meal-8', name: 'Rice' },
];

export const restaurants: Restaurant[] = [
  {
    id: 'rest-1',
    name: 'Flavors of Italy',
    description: 'Authentic Italian cuisine with fresh pasta and wood-fired pizza',
    image: '/placeholder.svg',
    cuisine: 'Italian',
    rating: 4.7,
    deliveryFee: 3.99,
    deliveryTime: '25-35 min'
  },
  {
    id: 'rest-2',
    name: 'Spice Garden',
    description: 'Aromatic Indian dishes with perfect blend of spices',
    image: '/placeholder.svg',
    cuisine: 'Indian',
    rating: 4.5,
    deliveryFee: 2.99,
    deliveryTime: '30-40 min'
  },
  {
    id: 'rest-3',
    name: 'Tokyo Bento',
    description: 'Fresh sushi, ramen, and other Japanese favorites',
    image: '/placeholder.svg',
    cuisine: 'Japanese',
    rating: 4.8,
    deliveryFee: 4.50,
    deliveryTime: '20-30 min'
  },
  {
    id: 'rest-4',
    name: 'Green Bistro',
    description: 'Healthy and delicious vegetarian and vegan options',
    image: '/placeholder.svg',
    cuisine: 'Vegetarian',
    rating: 4.3,
    deliveryFee: 2.50,
    deliveryTime: '25-35 min'
  }
];

export const menuItems: MenuItem[] = [
  {
    id: 'item-1',
    restaurantId: 'rest-1',
    name: 'Rotini Delight',
    description: 'A vibrant and flavorful pasta dish made with rotini, sun-dried tomatoes, and a rich tomato-based sauce.',
    image: '/placeholder.svg',
    price: 4.50,
    category: 'Pasta',
    options: {
      sizes: [
        { name: '380g', price: 4.50 },
        { name: '480g', price: 5.50 },
        { name: '560g', price: 6.50 }
      ]
    },
    isAvailable: true
  },
  {
    id: 'item-2',
    restaurantId: 'rest-1',
    name: 'Caprese Salad',
    description: 'Fresh mozzarella, tomatoes, and basil with balsamic glaze',
    image: '/placeholder.svg',
    price: 3.50,
    category: 'Salad',
    isAvailable: true
  },
  {
    id: 'item-3',
    restaurantId: 'rest-1',
    name: 'Tomato Sauce',
    description: 'Homemade rich tomato sauce with herbs',
    image: '/placeholder.svg',
    price: 0.75,
    category: 'Sauce',
    isAvailable: true
  },
  {
    id: 'item-4',
    restaurantId: 'rest-1',
    name: 'Iced Lemonade',
    description: 'Refreshing lemonade with fresh mint',
    image: '/placeholder.svg',
    price: 1.50,
    category: 'Drinks',
    isAvailable: true
  },
  {
    id: 'item-5',
    restaurantId: 'rest-1',
    name: 'Chicken Biryani',
    description: 'Fragrant basmati rice cooked with tender chicken and aromatic spices',
    image: '/placeholder.svg',
    price: 4.50,
    category: 'Rice',
    isAvailable: true
  },
  {
    id: 'item-6',
    restaurantId: 'rest-1',
    name: 'Crust Supreme',
    description: 'The ultimate pizza with cheese, pepperoni, mushrooms, and bell peppers',
    image: '/placeholder.svg',
    price: 5.50,
    category: 'Oven-Baked',
    isAvailable: true
  },
  {
    id: 'item-7',
    restaurantId: 'rest-1',
    name: 'Gleam Breeze',
    description: 'A citrusy cocktail with refreshing notes',
    image: '/placeholder.svg',
    price: 2.15,
    category: 'Drinks',
    isAvailable: true
  },
];
