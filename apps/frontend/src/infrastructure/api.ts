export const getBooks = async () => {
  const res = await fetch("http://localhost:3000/api/books");
  if (!res.ok) throw new Error("Error fetching books");
  return res.json();
};
