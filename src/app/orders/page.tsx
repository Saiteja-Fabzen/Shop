'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import { apiService } from '@/services/api';
import { Order } from '@/types/api';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await apiService.getOrderHistory({ skip: 0, limit: 20 });
      setOrders(response.orders);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'cancelled':
      case 'failed':
        return <XCircle className="text-red-500" size={20} />;
      case 'pending':
      case 'processing':
        return <Clock className="text-yellow-500" size={20} />;
      default:
        return <Package className="text-blue-500" size={20} />;
    }
  };

  const getStatusChipStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'cancelled':
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'pending':
      case 'processing':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleOrderClick = (orderId: string) => {
    router.push(`/orders/${orderId}`);
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

  return (
    <div className="min-h-screen flex justify-center">
      <div className="w-full max-w-md mx-auto bg-gradient-to-b from-[#1a1a2e] to-[#16213e] min-h-screen">
        <header className="px-4 py-3 mt-4 text-white safe-top">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-purple-700/50 rounded-full transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold">My Orders</h1>
          </div>
        </header>

        <main className="px-4 py-6">
          {error ? (
            <div className="text-center py-8">
              <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                <p className="text-red-300">{error}</p>
              </div>
              <button
                onClick={loadOrders}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : !orders || orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="mx-auto mb-4 text-gray-400" size={64} />
              <h2 className="text-white text-xl font-semibold mb-2">No Orders Yet</h2>
              <p className="text-gray-400 mb-6">Start shopping to see your orders here</p>
              <button
                onClick={() => router.push('/')}
                className="bg-gradient-button text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  onClick={() => handleOrderClick(order._id)}
                  className="bg-[#002E74] rounded-lg p-4 border-1 border-[#0053CF] hover:bg-[#003080] transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.status)}
                      <span className="text-white font-medium">
                        {order.trackingNumber}
                      </span>
                    </div>
                    <span className="text-gray-300 text-sm">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>

                  <div className="mb-3">
                    <p className="text-white text-sm font-medium line-clamp-2">
                      {order.products.length === 1
                        ? order.products[0].productName
                        : `${order.products[0].productName} ${order.products.length > 1 ? `+${order.products.length - 1} more` : ''}`
                      }
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-300 text-sm">
                        {order.products?.length || 0} item{(order.products?.length || 0) > 1 ? 's' : ''}
                      </p>
                      <p className="text-white font-bold">
                        ₹{order.totalGems ? order.totalGems.toLocaleString() : '0'}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusChipStyle(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}