import { useEffect, useState } from "react";
import { getBooks } from "../infrastructure/api";
import type { Product } from "@domain/entities/Products";
export function useBooks() {
  const [books, setBooks] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBooks().then(data => {
      setBooks(data);
      setLoading(false);
    });
  }, []);

  return { books, loading };
}
