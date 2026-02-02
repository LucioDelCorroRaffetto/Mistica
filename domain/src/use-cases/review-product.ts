import { Review } from "../entities/Review";

// Mock data for reviews - in real app, would come from backend
const reviewsDB: Review[] = [];

function getReviewsByProduct(productId: string): Review[] {
  return reviewsDB.filter((r) => r.productId === productId);
}

function addReview(review: Review): void {
  reviewsDB.push(review);
}

function getAverageRating(productId: string): number {
  const reviews = getReviewsByProduct(productId);
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return sum / reviews.length;
}

export function createReview(
  productId: string,
  userId: string,
  rating: number,
  title: string,
  comment: string
): Review {
  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  const review: Review = {
    id: `review-${Date.now()}`,
    productId,
    userId,
    rating,
    title,
    comment,
    helpful: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  addReview(review);
  return review;
}

export function getProductReviews(productId: string): Review[] {
  return getReviewsByProduct(productId);
}

export function getProductRating(productId: string): {
  average: number;
  count: number;
  reviews: Review[];
} {
  const reviews = getReviewsByProduct(productId);
  return {
    average: getAverageRating(productId),
    count: reviews.length,
    reviews,
  };
}

export function markReviewHelpful(reviewId: string): void {
  // Implement in database layer
}
