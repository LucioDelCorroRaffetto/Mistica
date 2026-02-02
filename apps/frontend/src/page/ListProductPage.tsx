import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../services/product-service";
import { ProductContainer } from "../components/ui/ProductContainer";
import LoadingSpinner from "../components/Spinner";

export function ProductListPage() {
  const {
    data: products,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <article className="products-page">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-red-500 text-center mb-4">Error</h1>
          <p className="text-center text-gray-600">
            Hubo un problema al cargar los productos. Por favor, inténtelo de
            nuevo más tarde.
          </p>
        </div>
      </article>
    );
  }

  return (
    <article className="products-page">
      <div className="container mx-auto">
        <div className="products-header">
          <h1>Nuestros Productos</h1>
          <p>Descubre nuestra colección exclusiva de libros y literatura</p>
        </div>
        <div className="products-grid">
          <ProductContainer products={products || []} />
        </div>
      </div>
    </article>
  );
}