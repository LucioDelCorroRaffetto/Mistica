export const getBooks = async () => {
  const res = await fetch("http://localhost:3000/api/books");
  if (!res.ok) throw new Error("Error fetching books");
  return res.json();
};
export async function getProducts() {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
  if (!res.ok) throw new Error("Network error");
  return await res.json();
}