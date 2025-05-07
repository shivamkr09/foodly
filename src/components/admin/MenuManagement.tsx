
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import MenuItemForm from '@/components/MenuItemForm';
import CategoryForm from '@/components/CategoryForm';
import { mapSupabaseMenuItem } from '@/utils/dataMappers';

const MenuManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isAddMenuItemOpen, setIsAddMenuItemOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<any | null>(null);
  
  useEffect(() => {
    if (user) {
      fetchRestaurantId();
    }
  }, [user]);

  useEffect(() => {
    if (restaurantId) {
      fetchMenuItems();
      fetchCategories();
    }
  }, [restaurantId]);

  const fetchRestaurantId = async () => {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('id')
        .eq('owner_id', user?.id)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setRestaurantId(data.id);
      }
    } catch (error) {
      console.error('Error fetching restaurant ID:', error);
    }
  };

  const fetchMenuItems = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('name');

      if (error) {
        throw error;
      }

      setMenuItems(data || []);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      toast({
        title: 'Error',
        description: 'Failed to load menu items',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: 'Error',
        description: 'Failed to load categories',
        variant: 'destructive',
      });
    }
  };

  const handleAddMenuItem = async (formData: any) => {
    try {
      setIsSubmitting(true);
      
      const menuItemData = {
        restaurant_id: restaurantId,
        name: formData.name,
        description: formData.description,
        price: formData.price,
        category: formData.category,
        image: formData.image,
        is_available: formData.isAvailable
      };
      
      let result;
      
      if (editingMenuItem) {
        // Update existing menu item
        result = await supabase
          .from('menu_items')
          .update(menuItemData)
          .eq('id', editingMenuItem.id);
      } else {
        // Create new menu item
        result = await supabase
          .from('menu_items')
          .insert([menuItemData]);
      }
      
      if (result.error) {
        throw result.error;
      }
      
      toast({
        title: editingMenuItem ? 'Menu Item Updated' : 'Menu Item Created',
        description: editingMenuItem ? 'Your menu item has been updated.' : 'Your menu item has been added to your menu.',
      });
      
      setIsAddMenuItemOpen(false);
      setEditingMenuItem(null);
      fetchMenuItems();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save menu item',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddCategory = async (formData: any) => {
    try {
      setIsSubmitting(true);
      
      const { data, error } = await supabase
        .from('categories')
        .insert([{
          name: formData.name,
          icon: formData.icon || null
        }])
        .select();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Category Created',
        description: 'Your category has been created successfully.',
      });
      
      setIsAddCategoryOpen(false);
      fetchCategories();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create category',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditMenuItem = (item: any) => {
    const formattedItem = mapSupabaseMenuItem(item);
    setEditingMenuItem({
      ...formattedItem,
      id: item.id
    });
    setIsAddMenuItemOpen(true);
  };

  const handleDeleteMenuItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Menu Item Deleted',
        description: 'The menu item has been removed from your menu.',
      });
      
      fetchMenuItems();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete menu item',
        variant: 'destructive',
      });
    }
  };

  if (!restaurantId) {
    return (
      <div className="p-6 text-center">
        <p>You need to create a restaurant before managing menu items.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-foodly-red" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Menu Items</h2>
        <div className="flex gap-2">
          <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" /> New Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Category</DialogTitle>
              </DialogHeader>
              <CategoryForm 
                onSubmit={handleAddCategory} 
                isSubmitting={isSubmitting} 
              />
            </DialogContent>
          </Dialog>
          
          <Dialog open={isAddMenuItemOpen} onOpenChange={setIsAddMenuItemOpen}>
            <DialogTrigger asChild>
              <Button className="bg-foodly-red hover:bg-red-700">
                <Plus className="h-4 w-4 mr-2" /> Add Menu Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingMenuItem ? 'Edit Menu Item' : 'Add New Menu Item'}
                </DialogTitle>
              </DialogHeader>
              <MenuItemForm
                initialData={editingMenuItem}
                categories={categories}
                onSubmit={handleAddMenuItem}
                isSubmitting={isSubmitting}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuItems.length > 0 ? (
          menuItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-40 object-cover"
              />
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.category}</p>
                  </div>
                  <div className="text-base font-semibold">${item.price.toFixed(2)}</div>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                <div className="mt-3 flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleEditMenuItem(item)}
                  >
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    className="flex-1"
                    onClick={() => handleDeleteMenuItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-10 border rounded-lg">
            <p className="text-gray-500">No menu items yet. Click "Add Menu Item" to create your first menu item.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuManagement;
