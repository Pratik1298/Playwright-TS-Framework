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
  product_image: ProductImage;
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
export interface ProductImage {
  id: string;
  file_name: string;
}

export interface BrandRequest {
  name: string;
  slug: string;
}

export interface SuccessResponse {
  success: boolean;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  dob: string;
  phone: string;
  email: string;
  password: string;
}

export interface ProductRequest {
  name: string;
  description: string;
  price: number;
  category_id: string;
  brand_id: string;
  product_image_id: string;
  is_location_offer: boolean;
  is_rental: boolean;
  co2_rating: string;
}

export type ValidationErrors = Record<string, string[]>;