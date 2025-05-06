
import React from 'react';
import { MenuItem } from '@/data/models';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface MenuItemCardProps {
  menuItem: MenuItem;
  onSelect: (item: MenuItem) => void;
}

const MenuItemCard = ({ menuItem, onSelect }: MenuItemCardProps) => {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      quantity: 1,
      image: menuItem.image,
      restaurantId: menuItem.restaurantId,
    });
  };
  
  return (
    <div 
      onClick={() => onSelect(menuItem)}
      className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer transition-all hover:shadow-md animate-fade-in"
    >
      <div className="relative h-40 w-full overflow-hidden">
        <img 
          src={menuItem.image} 
          alt={menuItem.name} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-4">
        <h3 className="font-medium text-lg text-foodly-darkText">{menuItem.name}</h3>
        <p className="text-sm text-foodly-lightText line-clamp-2">{menuItem.description}</p>
        
        <div className="flex justify-between items-center mt-3">
          <span className="font-bold text-foodly-darkText">
            ${menuItem.price.toFixed(2)}
          </span>
          
          <Button 
            size="sm" 
            variant="outline"
            className="rounded-full w-8 h-8 p-0 border-foodly-red"
            onClick={handleAddToCart}
          >
            <Plus className="h-4 w-4 text-foodly-red" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;
