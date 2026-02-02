import { Wishlist, WishlistItem } from "../entities/Wishlist";

// Mock data for wishlist
const wishlistsDB: Wishlist[] = [];

function getWishlist(userId: string): Wishlist {
  let wishlist = wishlistsDB.find((w) => w.userId === userId);
  if (!wishlist) {
    wishlist = { userId, items: [] };
    wishlistsDB.push(wishlist);
  }
  return wishlist;
}

function addToWishlist(userId: string, productId: string): WishlistItem {
  const wishlist = getWishlist(userId);
  const exists = wishlist.items.some((i) => i.productId === productId);
  if (exists) throw new Error("Product already in wishlist");
  const item: WishlistItem = {
    id: `wishlist-${Date.now()}`,
    userId,
    productId,
    addedAt: new Date(),
  };
  wishlist.items.push(item);
  return item;
}

function removeFromWishlist(userId: string, productId: string): void {
  const wishlist = getWishlist(userId);
  wishlist.items = wishlist.items.filter((i) => i.productId !== productId);
}

function clearWishlist(userId: string): void {
  const wishlist = getWishlist(userId);
  wishlist.items = [];
}

function isInWishlist(userId: string, productId: string): boolean {
  const wishlist = getWishlist(userId);
  return wishlist.items.some((i) => i.productId === productId);
}

export function getMyWishlist(userId: string): Wishlist {
  return getWishlist(userId);
}

export function addBookToWishlist(userId: string, productId: string): WishlistItem {
  return addToWishlist(userId, productId);
}

export function removeBookFromWishlist(userId: string, productId: string): void {
  removeFromWishlist(userId, productId);
}

export function clearMyWishlist(userId: string): void {
  clearWishlist(userId);
}

export function isBookInWishlist(userId: string, productId: string): boolean {
  return isInWishlist(userId, productId);
}
