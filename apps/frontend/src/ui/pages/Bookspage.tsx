import { useBooks } from "../../application/useBooks";

export default function BooksPage() {
  const { books, loading } = useBooks();
  if (loading) return <p>Cargando...</p>;

  return (
    <div>
      {books.map(book => (
        <div key={book.id}>{book.title}</div>
      ))}
    </div>
  );
}
