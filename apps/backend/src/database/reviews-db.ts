import { Review } from "@domain/src/entities/Review";

export let reviewsDB: Review[] = [
  {
    id: "review-001",
    productId: "libro-001",
    userId: "user-001",
    rating: 5,
    title: "Obra maestra absoluta",
    comment: "El Aleph es una historia fascinante que desafía la percepción de la realidad. Cada lectura revela nuevos significados.",
    helpful: 24,
    createdAt: new Date("2024-10-01"),
    updatedAt: new Date("2024-10-01"),
  },
  {
    id: "review-002",
    productId: "libro-002",
    userId: "user-002",
    rating: 4,
    title: "Exigente pero recompensador",
    comment: "Rayuela requiere paciencia, pero la estructura única y el contenido profundo hacen que valga la pena.",
    helpful: 18,
    createdAt: new Date("2024-09-15"),
    updatedAt: new Date("2024-09-15"),
  },
  {
    id: "review-003",
    productId: "libro-001",
    userId: "user-003",
    rating: 4,
    title: "Impresionante pero complicado",
    comment: "Borges es un genio, aunque sus historias pueden ser confusas en ocasiones.",
    helpful: 12,
    createdAt: new Date("2024-11-01"),
    updatedAt: new Date("2024-11-01"),
  },
];

export function addReview(review: Review): void {
  reviewsDB.push(review);
}

export function getReviewsByProduct(productId: string): Review[] {
  return reviewsDB.filter((r) => r.productId === productId);
}

export function getAverageRating(productId: string): number {
  const reviews = getReviewsByProduct(productId);
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return sum / reviews.length;
}

export function getReviewCount(productId: string): number {
  return getReviewsByProduct(productId).length;
}
