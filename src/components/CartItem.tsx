
import React from 'react';
import { CartItem as CartItemType } from '@/contexts/CartContext';
import { useCart } from '@/contexts/CartContext';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CartItemProps {
  item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex items-center py-4 border-b border-gray-100">
      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
        {item.image && (
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div className="flex justify-between">
          <h3 className="text-sm font-medium text-foodly-darkText">
            {item.name}
            {item.size && <span className="ml-1 text-xs text-gray-400">({item.size})</span>}
          </h3>
          <p className="ml-4 text-sm font-medium text-foodly-darkText">
            ${(item.price * item.quantity).toFixed(2)}
          </p>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="outline" 
              size="icon"
              className="h-6 w-6 rounded-full p-0"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="mx-2 text-sm">{item.quantity}</span>
            <Button 
              variant="outline" 
              size="icon"
              className="h-6 w-6 rounded-full p-0"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <Button 
            variant="ghost" 
            size="icon"
            className="h-6 w-6 text-gray-400 hover:text-red-500"
            onClick={() => removeItem(item.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
