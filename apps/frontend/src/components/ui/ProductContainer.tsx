import { type FC } from "react";
import { ProductCard } from "./ProductCard";
import type { ProductContainerProps } from "../../types/product";

export const ProductContainer: FC<ProductContainerProps> = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <article className="chango-empty" style={{ gridColumn: "1 / -1" }}>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No hay productos disponibles</h2>
        <p className="text-gray-600">Por favor, vuelve más tarde</p>
      </article>
    );
  }

  return (
    <>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </>
  );
};