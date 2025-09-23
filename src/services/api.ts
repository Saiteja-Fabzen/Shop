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
      // First try to get token from URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const tokenFromUrl = urlParams.get('token');

      if (tokenFromUrl) {
        // Store in localStorage for future use
        localStorage.setItem('authToken', tokenFromUrl);

        // Clean URL by removing token parameter
        this.cleanTokenFromUrl();

        return tokenFromUrl;
      }

      // Fallback to localStorage
      return localStorage.getItem('authToken');
    }
    return null;
  }

  private cleanTokenFromUrl(): void {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('token');

      // Update URL without reloading the page
      window.history.replaceState({}, document.title, url.toString());
    }
  }

  // Public method to set token programmatically
  public setAuthToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  }

  // Public method to clear token
  public clearAuthToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
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
    const token = this.getAuthToken();
    if (!token) {
      throw new Error('Authentication token required for order submission');
    }

    return this.request<OrderResponse>('/shopping/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
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
        'Authorization': `Bearer ${token}`,
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
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async getWallet(): Promise<WalletResponse> {
    const token = this.getAuthToken();
    if (!token) {
      throw new Error('Authentication token required for wallet access');
    }

    return this.request<WalletResponse>('/users/wallet', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }
}

export const apiService = new ApiService();