
import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MenuItem } from '@/data/models';
import { useCart } from '@/contexts/CartContext';
import { Minus, Plus } from 'lucide-react';

interface MenuItemModalProps {
  menuItem: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const MenuItemModal = ({ menuItem, isOpen, onClose }: MenuItemModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const { addItem } = useCart();
  
  if (!menuItem) return null;
  
  const handleAddToCart = () => {
    if (menuItem) {
      // Find the selected size price or use default price
      let price = menuItem.price;
      if (selectedSize && menuItem.options?.sizes) {
        const sizeOption = menuItem.options.sizes.find(
          size => size.name === selectedSize
        );
        if (sizeOption) {
          price = sizeOption.price;
        }
      }
      
      addItem({
        id: selectedSize ? `${menuItem.id}-${selectedSize}` : menuItem.id,
        name: menuItem.name,
        price,
        quantity,
        image: menuItem.image,
        size: selectedSize || undefined,
        restaurantId: menuItem.restaurantId,
      });
      
      onClose();
    }
  };
  
  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(1, quantity + change);
    setQuantity(newQuantity);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={isOpen => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{menuItem.name}</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <div className="relative h-48 w-full rounded-md overflow-hidden mb-4">
            <img 
              src={menuItem.image} 
              alt={menuItem.name} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <p className="text-foodly-darkText mb-4">{menuItem.description}</p>
          
          {menuItem.options?.sizes && (
            <div className="mb-6">
              <h4 className="text-sm font-medium mb-2">SIZE</h4>
              <div className="flex space-x-2">
                {menuItem.options.sizes.map((size) => (
                  <button
                    key={size.name}
                    onClick={() => setSelectedSize(size.name)}
                    className={`
                      border rounded-full px-4 py-2 text-sm font-medium
                      ${selectedSize === size.name 
                        ? 'bg-black text-white border-black' 
                        : 'border-gray-300 hover:border-gray-500'}
                    `}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-2">QUANTITY</h4>
            <div className="flex items-center">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 rounded-full"
                onClick={() => handleQuantityChange(-1)}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 rounded-full"
                onClick={() => handleQuantityChange(1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-6">
            <div className="text-xl font-bold">
              ${(menuItem.price * quantity).toFixed(2)}
            </div>
            <Button 
              onClick={handleAddToCart}
              className="bg-foodly-red hover:bg-red-700 text-white"
            >
              Add to order
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MenuItemModal;
