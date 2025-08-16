import { useEffect, useState } from "react";
import { getBooks } from "../infrastructure/api";
import { Product } from "@domain/src/entities/Products";
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
