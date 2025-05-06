
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { menuItems } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("menu");
  
  // Mock orders for demo
  const [orders] = useState([
    { 
      id: 'ord-1', 
      customerName: 'John Doe', 
      items: ['Rotini Delight', 'Iced Lemonade'],
      total: 6.00,
      status: 'pending',
      date: '2023-05-01 10:30 AM'
    },
    { 
      id: 'ord-2', 
      customerName: 'Jane Smith', 
      items: ['Chicken Biryani', 'Crust Supreme'],
      total: 10.00,
      status: 'preparing',
      date: '2023-05-01 10:15 AM'
    },
    { 
      id: 'ord-3', 
      customerName: 'Alex Johnson', 
      items: ['Caprese Salad', 'Gleam Breeze'],
      total: 5.65,
      status: 'ready',
      date: '2023-05-01 9:45 AM'
    },
  ]);
  
  // If user is not logged in or not an admin, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // For demo purposes, we'll make the current user an admin
  // In a real app, this would be a property on the user object
  
  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    // This would update the order status in a real app
    toast({
      title: "Status Updated",
      description: `Order #${orderId} status updated to ${newStatus}`,
    });
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Restaurant Dashboard</h1>
        <p className="text-foodly-lightText mb-8">Manage your restaurant and orders</p>
        
        <Tabs 
          value={selectedTab} 
          onValueChange={setSelectedTab}
          className="space-y-8"
        >
          <TabsList>
            <TabsTrigger value="menu">Menu Management</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="menu" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Menu Items</h2>
              <Button className="bg-foodly-red hover:bg-red-700">
                Add New Item
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {menuItems.slice(0, 6).map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4 flex">
                    <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-md">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    
                    <div className="ml-4 flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-foodly-lightText line-clamp-1">
                        {item.description}
                      </p>
                      <p className="font-bold mt-1">${item.price.toFixed(2)}</p>
                      <div className="flex space-x-2 mt-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm" className="text-red-500 border-red-500">
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="orders">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Recent Orders</h2>
                <div className="flex space-x-2">
                  <Button variant="outline" className="text-xs">All</Button>
                  <Button variant="outline" className="text-xs">Pending</Button>
                  <Button variant="outline" className="text-xs">Preparing</Button>
                  <Button variant="outline" className="text-xs">Ready</Button>
                  <Button variant="outline" className="text-xs">Delivered</Button>
                </div>
              </div>
              
              <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Items
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {order.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.customerName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.items.join(', ')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${order.total.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                               order.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
                               order.status === 'ready' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <select 
                              className="text-sm border border-gray-300 rounded-md p-1"
                              defaultValue=""
                              onChange={(e) => {
                                if (e.target.value) {
                                  handleUpdateStatus(order.id, e.target.value);
                                }
                                e.target.value = "";
                              }}
                            >
                              <option value="">Update Status</option>
                              <option value="pending">Pending</option>
                              <option value="preparing">Preparing</option>
                              <option value="ready">Ready</option>
                              <option value="delivered">Delivered</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="payments">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Payment Ledger</h2>
              
              <div className="flex space-x-4 mb-6">
                <div className="flex-1">
                  <Label htmlFor="from-date">From</Label>
                  <Input type="date" id="from-date" />
                </div>
                <div className="flex-1">
                  <Label htmlFor="to-date">To</Label>
                  <Input type="date" id="to-date" />
                </div>
                <div className="flex items-end">
                  <Button variant="outline">Filter</Button>
                </div>
              </div>
              
              <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Transaction ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          txn_123456
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ord-1
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          $6.00
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            completed
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          2023-05-01 10:30 AM
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          txn_123457
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ord-2
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          $10.00
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            completed
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          2023-05-01 10:15 AM
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          txn_123458
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ord-3
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          $5.65
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            completed
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          2023-05-01 9:45 AM
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Admin;
