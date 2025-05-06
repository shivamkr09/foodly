
import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface OrderSuccessState {
  orderId: string;
  restaurant: string;
  total: number;
}

const OrderSuccess = () => {
  const location = useLocation();
  const state = location.state as OrderSuccessState | null;
  
  // Redirect to home if accessed directly without state
  if (!state) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-md">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          
          <h1 className="text-2xl font-bold mb-4">Order Placed Successfully!</h1>
          
          <div className="mb-6">
            <p className="text-foodly-lightText mb-2">
              Your order has been placed and is being prepared.
            </p>
            <p className="font-medium">Order ID: {state.orderId}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <div className="mb-2">
              <h3 className="font-medium">{state.restaurant}</h3>
            </div>
            <div className="flex justify-between">
              <span>Total</span>
              <span className="font-bold">${state.total.toFixed(2)}</span>
            </div>
            <div className="mt-3">
              <p className="text-sm text-foodly-lightText">
                Estimated delivery time: 30-45 minutes
              </p>
            </div>
          </div>
          
          <Link to="/orders">
            <Button className="w-full mb-3 bg-foodly-red hover:bg-red-700">
              Track Order
            </Button>
          </Link>
          
          <Link to="/">
            <Button variant="outline" className="w-full">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default OrderSuccess;
