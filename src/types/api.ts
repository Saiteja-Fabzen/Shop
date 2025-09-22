export interface ApiProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: Array<{
    url: string;
    altText: string;
    isPrimary: boolean;
  }>;
  stock: number;
  isAvailable: boolean;
  category: {
    name: string;
  };
  type: string;
  brand: string;
  rating: number;
  ratingsCount: number;
  variations: Array<{
    name: string;
    price: number;
    stock: number;
    imageUrl: string;
  }>;
  productDetails: Array<{
    section: string;
    content: string;
    contentType: string;
  }>;
  deliveryDays: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ProductsResponse {
  status: string;
  data: ApiProduct[];
  filters: Record<string, any>;
  pagination: {
    skip: number;
    limit: number;
    total: number;
  };
}

export interface ProductResponse {
  status: string;
  data: ApiProduct;
}

export interface Category {
  id: string;
  name: string;
}

export interface CategoriesResponse {
  success: boolean;
  message: string;
  categories: Category[];
}

export interface UserDetails {
  dialingCode: string;
  username: string;
  mobileNumber: string;
}

export interface ShippingAddress {
  houseNo: string;
  buildingName: string;
  roadNameArea: string;
  landmark: string;
  pincode: string;
  city: string;
  state: string;
}

export interface OrderProduct {
  productid: string;
  quantity: number;
  variationId: string;
  pricePerUnit: number;
}

export interface OrderRequest {
  userDetails: UserDetails;
  shippingAddress: ShippingAddress;
  products: OrderProduct[];
}

export interface OrderResponse {
  status: string;
  message?: string;
  orderId?: string;
}

export interface ProductFilters {
  skip?: number;
  limit?: number;
  category?: string;
  brand?: string;
  available?: boolean;
}

export interface ApiOrderProduct {
  productId: string;
  productName: string;
  quantity: number;
  variationId: string;
  variationName: string;
  pricePerUnit: number;
  totalPrice: number;
}

export interface Order {
  _id: string;
  userId: string;
  userDetails: UserDetails;
  shippingAddress: ShippingAddress;
  products: ApiOrderProduct[];
  totalGems: number;
  totalItems: number;
  status: string;
  trackingNumber: string;
  estimatedDeliveryDate: string;
  notes: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface OrderHistoryResponse {
  success: boolean;
  message: string;
  orders: Order[];
  pagination: {
    skip: string;
    limit: string;
    total: number;
  };
}

export interface OrderDetailsResponse {
  success: boolean;
  message: string;
  order: Order;
}

export interface OrderHistoryFilters {
  skip?: number;
  limit?: number;
}