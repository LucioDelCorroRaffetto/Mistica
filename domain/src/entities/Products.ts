export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
  // Optional extended fields used across app
  author?: string;
  rating?: number;
  reviewCount?: number;
  // alternative snake_case fields for DB rows
  image_url?: string;
  review_count?: number;
}