export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  brand: Brand;
  category: Category;
}

export interface PaginatedProducts {
  current_page: number;
  data: Product[];
  total: number;
}

export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}