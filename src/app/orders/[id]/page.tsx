'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Package, MapPin, User, Calendar, Phone } from 'lucide-react';
import { apiService } from '@/services/api';
import { Order } from '@/types/api';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) {
      loadOrderDetails();
    }
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await apiService.getOrderById(orderId);
      setOrder(response.order);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return 'text-green-400';
      case 'cancelled':
      case 'failed':
        return 'text-red-400';
      case 'pending':
      case 'processing':
        return 'text-yellow-400';
      default:
        return 'text-blue-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center">
        <div className="w-full max-w-md mx-auto bg-gradient-to-b from-[#1a1a2e] to-[#16213e] min-h-screen">
          <div className="flex items-center justify-center h-screen">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex justify-center">
        <div className="w-full max-w-md mx-auto bg-gradient-to-b from-[#1a1a2e] to-[#16213e] min-h-screen">
          <header className="px-4 py-3 text-white safe-top">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-purple-700/50 rounded-full transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-xl font-bold">Order Details</h1>
            </div>
          </header>
          <div className="text-center py-12 px-4">
            <Package className="mx-auto mb-4 text-gray-400" size={64} />
            <h2 className="text-white text-xl font-semibold mb-2">Order Not Found</h2>
            <p className="text-gray-400 mb-6">{error || 'The requested order could not be found'}</p>
            <button
              onClick={() => router.push('/orders')}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center">
      <div className="w-full max-w-md mx-auto bg-gradient-to-b from-[#1a1a2e] to-[#16213e] min-h-screen">
        <header className="px-4 py-3 text-white safe-top">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-purple-700/50 rounded-full transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold">Order Details</h1>
          </div>
        </header>

        <main className="px-4 py-6 space-y-6">
          {/* Order Status */}
          <div className="bg-[#002E74] rounded-lg p-4 border-1 border-[#0053CF]">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-white font-semibold">{order.trackingNumber}</h2>
              <span className={`font-medium capitalize ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
            <div className="flex items-center text-gray-300 text-sm">
              <Calendar size={16} className="mr-2" />
              <span>Placed on {formatDate(order.createdAt)}</span>
            </div>
          </div>

          {/* Products */}
          <div className="bg-[#002E74] rounded-lg p-4 border-1 border-[#0053CF]">
            <h3 className="text-white font-semibold mb-4 flex items-center">
              <Package size={18} className="mr-2" />
              Items ({order.products.length})
            </h3>
            <div className="space-y-3">
              {order.products.map((product, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-purple-700/50 last:border-b-0">
                  <div className="flex-1">
                    <p className="text-white text-sm">{product.productName}</p>
                    <p className="text-gray-400 text-xs">Product ID: {product.productId}</p>
                    {product.variationId && (
                      <p className="text-gray-400 text-xs">{product.variationName}</p>
                    )}
                    <p className="text-gray-300 text-xs">Qty: {product.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">₹{product.pricePerUnit.toLocaleString()}</p>
                    <p className="text-gray-400 text-xs">per unit</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-purple-700/50 pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="text-white font-semibold">Total Amount</span>
                <span className="text-white font-bold text-lg">₹{order.totalGems.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="bg-[#002E74] rounded-lg p-4 border-1 border-[#0053CF]">
            <h3 className="text-white font-semibold mb-4 flex items-center">
              <User size={18} className="mr-2" />
              Customer Details
            </h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-gray-300 text-sm w-20">Name:</span>
                <span className="text-white text-sm">{order.userDetails.username}</span>
              </div>
              <div className="flex items-center">
                <Phone size={14} className="mr-2 text-gray-400" />
                <span className="text-white text-sm">
                  {order.userDetails.dialingCode} {order.userDetails.mobileNumber}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-[#002E74] rounded-lg p-4 border-1 border-[#0053CF]">
            <h3 className="text-white font-semibold mb-4 flex items-center">
              <MapPin size={18} className="mr-2" />
              Shipping Address
            </h3>
            <div className="text-gray-300 text-sm space-y-1">
              <p>{order.shippingAddress.houseNo}, {order.shippingAddress.buildingName}</p>
              <p>{order.shippingAddress.roadNameArea}</p>
              {order.shippingAddress.landmark && (
                <p>Near {order.shippingAddress.landmark}</p>
              )}
              <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
              <p>PIN: {order.shippingAddress.pincode}</p>
            </div>
          </div>

          {/* Tracking & Delivery */}
          <div className="bg-[#002E74] rounded-lg p-4 border-1 border-[#0053CF]">
            <h3 className="text-white font-semibold mb-4">Tracking Information</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300 text-sm">Tracking Number:</span>
                <span className="text-white text-sm font-mono">{order.trackingNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300 text-sm">Est. Delivery:</span>
                <span className="text-white text-sm">{formatDate(order.estimatedDeliveryDate)}</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}