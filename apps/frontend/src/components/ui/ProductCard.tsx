import { type FC } from "react";
import { Link } from "react-router-dom";
import type { ProductCardProps } from "../../types/product";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToChango } from "../../services/chango-service";
import { useAuth } from "../../hook/useAuth";
import type { AddToChangoRequest } from "@backend-types/type";

export const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  const { mutate, isPending: isAdding } = useMutation({
    mutationFn: (data: AddToChangoRequest) => addToChango(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chango"] });
      alert("Producto añadido al chango!");
    },
    onError: (error) => {
      console.error("Error al añadir al chango", error);
      alert("Error al añadir al chango. Revisa la consola.");
    },
  });

  const handleAddToChango = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("Debes iniciar sesión para añadir productos al chango.");
      return;
    }

    if (product) {
      const requestData: AddToChangoRequest = {
        productId: product.id,
        quantity: 1,
      };
      mutate(requestData);
    }
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 max-w-sm"
    >
      <figure className="w-32 h-40 mx-auto">
        <img
          className="w-full h-full object-cover"
          src={product.imageUrl || "https://via.placeholder.com/150"}
          alt={product.name}
        />
      </figure>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
        <p className="mt-1 text-gray-600">{product.description}</p>
        <p className="mt-2 text-xl font-bold text-gray-900">${product.price}</p>
        {isAuthenticated && (
          <button
            className="mt-4 w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition-colors disabled:bg-gray-400"
            onClick={handleAddToChango}
            disabled={isAdding || product.stock === 0}
          >
            {isAdding ? "Añadiendo..." : "Añadir al carrito"}
          </button>
        )}
      </div>
    </Link>
  );
};