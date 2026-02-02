export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  addedAt: Date;
}

export interface Wishlist {
  userId: string;
  items: WishlistItem[];
}
