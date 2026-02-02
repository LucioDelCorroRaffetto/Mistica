export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  helpful: number; // count of helpful votes
  createdAt: Date;
  updatedAt: Date;
}
