import { useEffect, useState } from "react";
import { getBooks } from "../infrastructure/api";
import { Book } from "../domain/Book";

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBooks().then(data => {
      setBooks(data);
      setLoading(false);
    });
  }, []);

  return { books, loading };
}
