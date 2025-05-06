
// Define the core data models for our application

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  image: string;
  cuisine: string;
  rating: number;
  deliveryFee: number;
  deliveryTime: string;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
  options?: {
    sizes?: { name: string; price: number }[];
    addOns?: { name: string; price: number }[];
  };
  isAvailable: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
}

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  items: {
    menuItemId: string;
    name: string;
    price: number;
    quantity: number;
    size?: string;
    addOns?: string[];
  }[];
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  total: number;
  deliveryFee: number;
  discount: number;
  paymentMethod: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin' | 'restaurant';
  addresses?: {
    id: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    default: boolean;
  }[];
}
