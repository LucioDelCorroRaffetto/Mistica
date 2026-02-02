import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCart, removeFromCart, clearCart } from "../services/cart-service";
import { getProductsByIds } from "../services/product-service";
import type { Cart } from "@domain/entities/Cart";
import type { Product } from "@domain/entities/Products";
import LoadingSpinner from "../components/Spinner";
import { useAuth } from "../hook/useAuth";
import type { CombinedCartItem } from "../types/cart";
import { useNavigate } from "react-router-dom";

export function CartPage() {
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();

  const {
    data: cartData,
    isLoading: isCartLoading,
    isError: isCartError,
  } = useQuery<Cart>({
    queryKey: ["cart"],
    queryFn: () => getCart(),
    enabled: isAuthenticated,
  });

  const productIds = cartData?.item?.map((item) => item.productId) || [];

  const {
    data: products,
    isLoading: isProductsLoading,
    isError: isProductsError,
  } = useQuery<Product[]>({
    queryKey: ["productsInCart", productIds],
    queryFn: () => getProductsByIds(productIds),
    enabled: !!cartData && productIds.length > 0 && isAuthenticated,
  });

  const combinedData: CombinedCartItem[] =
    (cartData?.item
      .map((cartItem) => {
        const product = products?.find(
          (product) => product.id === cartItem.productId
        );

        if (product) {
          return { ...product, quantity: cartItem.quantity };
        }
        return null;
      })
      .filter(Boolean) as CombinedCartItem[]) || [];

  const removeMutation = useMutation({
    mutationFn: removeFromCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      console.error("Error al eliminar el producto del cart:", error);
      alert("No se pudo eliminar el producto del cart.");
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: clearCart,
    onError: (error) => {
      console.error("Error al vaciar el cart:", error);
      alert("No se pudo vaciar el cart.");
    },
  });

  const subtotal = combinedData.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleRemoveClick = (productId: string) => {
    removeMutation.mutate(productId);
  };

  const handleClearCartClick = () => {
    clearCartMutation.mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
        alert("¡El cart ha sido vaciado!");
      },
    });
  };

  const handleCheckout = () => {
    clearCartMutation.mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
        alert("¡Compra finalizada con éxito! El cart ha sido vaciado.");
        navigate("/");
      },
    });
  };

  if (isAuthLoading || isCartLoading || isProductsLoading) {
    return <LoadingSpinner />;
  }

  if (isCartError || isProductsError) {
    return (
      <article className="cart-page">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-red-500 text-center mb-4">Error</h1>
          <p className="text-center text-gray-600">
            Hubo un problema al cargar el cart. Por favor, inténtelo de nuevo
            más tarde.
          </p>
        </div>
      </article>
    );
  }

  if (combinedData.length === 0) {
    return (
      <article className="cart-page">
        <div className="container mx-auto">
          <div className="cart-header">
            <h1>Tu Carrito</h1>
          </div>
          <div className="cart-empty">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">🛒 Tu carrito está vacío</h2>
            <p className="text-gray-600 mb-6">Descubre nuestros productos y agrega tus favoritos</p>
            <button
              onClick={() => navigate("/")}
              className="btn btn-primary"
            >
              Continuar comprando
            </button>
          </div>
        </div>
      </article>
    );
  }

  if (!isAuthenticated) {
    return (
      <article className="cart-page">
        <div className="container mx-auto">
          <div className="cart-header">
            <h1>Tu Carrito</h1>
          </div>
          <div className="cart-empty">
            <p className="text-gray-600 mb-4">Por favor, inicia sesión para ver tu carrito.</p>
            <button
              onClick={() => navigate("/login")}
              className="btn btn-primary"
            >
              Iniciar sesión
            </button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="cart-page">
      <div className="container mx-auto">
        <div className="cart-header">
          <h1>Tu Carrito</h1>
        </div>

        {(removeMutation.isPending || clearCartMutation.isPending) && (
          <div className="alert alert-info mb-6">
            <p>Procesando...</p>
          </div>
        )}

        <div className="cart-items">
          {combinedData.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-image">
                <img
                  src={item.imageUrl || "https://via.placeholder.com/120"}
                  alt={item.name}
                />
              </div>
              <div className="cart-item-info">
                <h3 className="cart-item-title">{item.name}</h3>
                <div className="cart-item-quantity">Cantidad: {item.quantity}</div>
                <div className="cart-item-price">Precio: ${item.price}</div>
                <div className="cart-item-total">
                  Subtotal: ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
              <div className="cart-item-actions">
                <button
                  className="cart-item-remove"
                  onClick={() => handleRemoveClick(item.id)}
                  disabled={removeMutation.isPending}
                >
                  ✕ Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="cart-summary-row">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="cart-summary-row">
            <span>Envío:</span>
            <span>Gratis</span>
          </div>
          <div className="cart-summary-total">
            <span>Total:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <div className="cart-actions">
            <button
              className="cart-clear-btn"
              onClick={handleClearCartClick}
              disabled={clearCartMutation.isPending || combinedData.length === 0}
            >
              ✕ Vaciar carrito
            </button>
            <button
              className="cart-checkout-btn"
              onClick={handleCheckout}
              disabled={clearCartMutation.isPending || combinedData.length === 0}
            >
              ✓ Finalizar compra
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}