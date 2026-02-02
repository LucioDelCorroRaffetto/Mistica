import { Wishlist, WishlistItem } from "@domain/src/entities/Wishlist";

export let wishlistsDB: Wishlist[] = [];

export function getWishlist(userId: string): Wishlist {
  let wishlist = wishlistsDB.find((w) => w.userId === userId);
  if (!wishlist) {
    wishlist = { userId, items: [] };
    wishlistsDB.push(wishlist);
  }
  return wishlist;
}

export function addToWishlist(userId: string, productId: string): WishlistItem {
  const wishlist = getWishlist(userId);
  const exists = wishlist.items.some((i) => i.productId === productId);

  if (exists) {
    throw new Error("Product already in wishlist");
  }

  const item: WishlistItem = {
    id: `wishlist-${Date.now()}`,
    userId,
    productId,
    addedAt: new Date(),
  };

  wishlist.items.push(item);
  return item;
}

export function removeFromWishlist(userId: string, productId: string): void {
  const wishlist = getWishlist(userId);
  wishlist.items = wishlist.items.filter((i) => i.productId !== productId);
}

export function clearWishlist(userId: string): void {
  const wishlist = getWishlist(userId);
  wishlist.items = [];
}

export function isInWishlist(userId: string, productId: string): boolean {
  const wishlist = getWishlist(userId);
  return wishlist.items.some((i) => i.productId === productId);
}
