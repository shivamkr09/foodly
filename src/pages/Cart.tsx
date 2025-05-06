
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import CartItem from '@/components/CartItem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { restaurants } from '@/data/mockData';

const Cart = () => {
  const { items, total, clearCart, restaurantId } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const restaurant = restaurants.find(r => r.id === restaurantId);
  
  const deliveryFee = restaurant?.deliveryFee || 0;
  const subtotal = total;
  const discount = 0; // No discount for now
  const finalTotal = subtotal + deliveryFee - discount;
  
  const handleCheckout = () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to proceed with checkout",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    
    navigate('/checkout');
  };
  
  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
          <p className="mb-8">Your cart is empty</p>
          <Link to="/restaurants">
            <Button className="bg-foodly-red hover:bg-red-700">
              Browse Restaurants
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {restaurant && (
              <div className="mb-4">
                <h2 className="text-lg font-medium">{restaurant.name}</h2>
                <p className="text-sm text-foodly-lightText">{restaurant.deliveryTime} delivery time</p>
              </div>
            )}
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              {items.map(item => (
                <CartItem key={item.id} item={item} />
              ))}
              
              <div className="mt-6">
                <div className="flex items-center">
                  <Input 
                    placeholder="Promo code" 
                    className="max-w-xs mr-2"
                  />
                  <Button variant="outline">Apply</Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                
                <Separator />
                
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>
              
              <Button 
                onClick={handleCheckout}
                className="w-full mt-6 bg-foodly-red hover:bg-red-700"
              >
                Proceed to Checkout
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full mt-2"
                onClick={clearCart}
              >
                Clear Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
