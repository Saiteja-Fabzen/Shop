import {
  ProductsResponse,
  ProductResponse,
  CategoriesResponse,
  OrderRequest,
  OrderResponse,
  ProductFilters,
  OrderHistoryResponse,
  OrderDetailsResponse,
  OrderHistoryFilters,
  WalletResponse
} from '@/types/api';

const API_BASE_URL = 'https://test.api.empiregames.in';

class ApiService {
  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error! status: ${response.status}, response: ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async getProducts(filters?: ProductFilters): Promise<ProductsResponse> {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const endpoint = `/shopping/products${params.toString() ? `?${params.toString()}` : ''}`;
    return this.request<ProductsResponse>(endpoint);
  }

  async getProductById(productId: string): Promise<ProductResponse> {
    return this.request<ProductResponse>(`/shopping/products/${productId}`);
  }

  async getCategories(): Promise<CategoriesResponse> {
    return this.request<CategoriesResponse>('/shopping/categories');
  }

  async submitOrder(orderData: OrderRequest): Promise<OrderResponse> {
    return this.request<OrderResponse>('/shopping/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGJkMDU4M2Q3ZGI5MTVjOGYyZGZkNmEiLCJyb2xlcyI6WyJwbGF5ZXIiXSwiaWF0IjoxNzU4NjA4NTY1LCJleHAiOjE3NTkyMTMzNjV9.s_9T3bG4QHAS9GYdWFch63A1NHDbJFBoe2jmVUpvzxIVnbCAj1LNV_7RSP7j9cJQ7NqBE7AtAZQ4vwmBLSL90w`
      },
      body: JSON.stringify(orderData),
    });
  }

  async getOrderHistory(filters?: OrderHistoryFilters): Promise<OrderHistoryResponse> {
    const token = this.getAuthToken();
    if (!token) {
      throw new Error('Authentication token required for order history');
    }

    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const endpoint = `/shopping/orders/history`;
    return this.request<OrderHistoryResponse>(endpoint, {
      headers: {
        'Authorization': `Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjZkNDhlNmI1ZjU1NWI2MjRlOWI2NTgiLCJyb2xlcyI6WyJwbGF5ZXIiLCJhZG1pbiJdLCJpYXQiOjE3NTg1MjIwNDIsImV4cCI6MTc1OTEyNjg0Mn0.laq4wcVRigvrmznu0-Ae7YQBU8BKe7jOMfS2RlSqQzUfQofqoovjZ6_Zb557gpaTQPxmGpyKQocWV6NEdDnMkQ`,
      },
    });
  }

  async getOrderById(orderId: string): Promise<OrderDetailsResponse> {
    const token = this.getAuthToken();
    if (!token) {
      throw new Error('Authentication token required for order details');
    }

    return this.request<OrderDetailsResponse>(`/shopping/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjZkNDhlNmI1ZjU1NWI2MjRlOWI2NTgiLCJyb2xlcyI6WyJwbGF5ZXIiLCJhZG1pbiJdLCJpYXQiOjE3NTg1MjIwNDIsImV4cCI6MTc1OTEyNjg0Mn0.laq4wcVRigvrmznu0-Ae7YQBU8BKe7jOMfS2RlSqQzUfQofqoovjZ6_Zb557gpaTQPxmGpyKQocWV6NEdDnMkQ`,
      },
    });
  }

  async getWallet(): Promise<WalletResponse> {
    return this.request<WalletResponse>('/users/wallet', {
      headers: {
        'Authorization': `Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGJkMDU4M2Q3ZGI5MTVjOGYyZGZkNmEiLCJyb2xlcyI6WyJwbGF5ZXIiXSwiaWF0IjoxNzU4NjA4NTY1LCJleHAiOjE3NTkyMTMzNjV9.s_9T3bG4QHAS9GYdWFch63A1NHDbJFBoe2jmVUpvzxIVnbCAj1LNV_7RSP7j9cJQ7NqBE7AtAZQ4vwmBLSL90w`,
      },
    });
  }
}

export const apiService = new ApiService();