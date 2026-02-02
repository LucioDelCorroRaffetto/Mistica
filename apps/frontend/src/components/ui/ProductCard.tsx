import { type FC } from "react";
import { Link } from "react-router-dom";
import type { ProductCardProps } from "../../types/product";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToCart } from "../../services/cart-service";
import { useAuth } from "../../hook/useAuth";
import type { AddToCartRequest } from "@backend-types/type";

export const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  const { mutate, isPending: isAdding } = useMutation({
    mutationFn: (data: AddToCartRequest) => addToCart(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      alert("Producto añadido al carrito!");
    },
    onError: (error) => {
      console.error("Error al añadir al carrito", error);
      alert("Error al añadir al carrito. Revisa la consola.");
    },
  });

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("Debes iniciar sesión para añadir productos al carrito.");
      return;
    }

    if (product) {
      const requestData: AddToCartRequest = {
        productId: product.id,
        quantity: 1,
      };
      mutate(requestData);
    }
  };

  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <div className="product-card-image-wrapper">
        {product.stock === 0 && <div className="product-card-out-of-stock">Agotado</div>}
        {product.stock > 0 && product.stock <= 3 && (
          <div className="product-card-badge">Solo {product.stock} disponibles</div>
        )}
        <img
          className="product-card-image"
          src={product.imageUrl || "https://via.placeholder.com/300x280"}
          alt={product.name}
        />
      </div>
      <div className="product-card-content">
        <div className="product-card-category">{product.category}</div>
        <h3 className="product-card-title">{product.name}</h3>
        <p className="product-card-description">{product.description}</p>
        <div className="product-card-footer">
          <span className="product-card-price">${product.price}</span>
          {isAuthenticated && (
            <button
              className="product-card-btn"
              onClick={handleAddToCart}
              disabled={isAdding || product.stock === 0}
            >
              {isAdding ? "Añadiendo..." : "Añadir"}
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};