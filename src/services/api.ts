import {
  ProductsResponse,
  ProductResponse,
  CategoriesResponse,
  OrderRequest,
  OrderResponse,
  ProductFilters,
  OrderHistoryResponse,
  OrderDetailsResponse,
  OrderHistoryFilters
} from '@/types/api';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:4011';

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
        throw new Error(`HTTP error! status: ${response.status}`);
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
    const token = this.getAuthToken();
    return this.request<OrderResponse>('/shopping/orders', {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjZkNDhlNmI1ZjU1NWI2MjRlOWI2NTgiLCJyb2xlcyI6WyJwbGF5ZXIiLCJhZG1pbiJdLCJpYXQiOjE3NTg1MzAwMDMsImV4cCI6MTc1ODUzMDE4M30.tSL-OFUuCLjEpQWjBYSRr96jj-YuBZHMueMdsGuVeUoY5GfN8zXcVym_zr4Q2oXKEwOCtFxhnIuVQFiw0HkvEw` }),
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
        'Authorization': `Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjZkNDhlNmI1ZjU1NWI2MjRlOWI2NTgiLCJyb2xlcyI6WyJwbGF5ZXIiLCJhZG1pbiJdLCJpYXQiOjE3NTg1MzAwMDMsImV4cCI6MTc1ODUzMDE4M30.tSL-OFUuCLjEpQWjBYSRr96jj-YuBZHMueMdsGuVeUoY5GfN8zXcVym_zr4Q2oXKEwOCtFxhnIuVQFiw0HkvEw`,
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
        'Authorization': `Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjZkNDhlNmI1ZjU1NWI2MjRlOWI2NTgiLCJyb2xlcyI6WyJwbGF5ZXIiLCJhZG1pbiJdLCJpYXQiOjE3NTg1MzAwMDMsImV4cCI6MTc1ODUzMDE4M30.tSL-OFUuCLjEpQWjBYSRr96jj-YuBZHMueMdsGuVeUoY5GfN8zXcVym_zr4Q2oXKEwOCtFxhnIuVQFiw0HkvEw`,
      },
    });
  }
}

export const apiService = new ApiService();