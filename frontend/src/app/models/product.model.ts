export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  children: Category[];
}

export interface ProductImage {
  id: number;
  image: string;
  alt_text: string;
  is_primary: boolean;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  is_active: boolean;
  category: number;
  category_name: string;
  seller: number;
  seller_name: string;
  images: ProductImage[];
  average_rating: number;
  review_count: number;
  created_at: string;
}

export interface Review {
  id: number;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}
