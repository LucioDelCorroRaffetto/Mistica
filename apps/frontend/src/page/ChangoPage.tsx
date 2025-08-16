import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getChango, removeFromChango, clearChango } from "../services/chango-service";
import { getProductsByIds } from "../services/product-service";
import type { Chango } from "@domain/entities/Chango";
import type { Product } from "@domain/entities/Products";
import LoadingSpinner from "../components/Spinner";
import { useAuth } from "../hook/useAuth";
import type { CombinedChangoItem } from "../types/chango";
import { useNavigate } from "react-router-dom";

export function ChangoPage() {
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();

  const {
    data: changoData,
    isLoading: isChangoLoading,
    isError: isChangoError,
  } = useQuery<Chango>({
    queryKey: ["chango"],
    queryFn: () => getChango(),
    enabled: isAuthenticated,
  });

  const productIds = changoData?.item?.map((item) => item.productId) || [];

  const {
    data: products,
    isLoading: isProductsLoading,
    isError: isProductsError,
  } = useQuery<Product[]>({
    queryKey: ["productsInChango", productIds],
    queryFn: () => getProductsByIds(productIds),
    enabled: !!changoData && productIds.length > 0 && isAuthenticated,
  });

  const combinedData: CombinedChangoItem[] =
    (changoData?.item
      .map((changoItem) => {
        const product = products?.find(
          (product) => product.id === changoItem.productId
        );

        if (product) {
          return { ...product, quantity: changoItem.quantity };
        }
        return null;
      })
      .filter(Boolean) as CombinedChangoItem[]) || [];

  const removeMutation = useMutation({
    mutationFn: removeFromChango,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chango"] });
    },
    onError: (error) => {
      console.error("Error al eliminar el producto del chango:", error);
      alert("No se pudo eliminar el producto del chango.");
    },
  });

  const clearChangoMutation = useMutation({
    mutationFn: clearChango,
    onError: (error) => {
      console.error("Error al vaciar el chango:", error);
      alert("No se pudo vaciar el chango.");
    },
  });

  const subtotal = combinedData.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleRemoveClick = (productId: string) => {
    removeMutation.mutate(productId);
  };

  const handleClearChangoClick = () => {
    clearChangoMutation.mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["chango"] });
        alert("¡El chango ha sido vaciado!");
      },
    });
  };

  const handleCheckout = () => {
    clearChangoMutation.mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["chango"] });
        alert("¡Compra finalizada con éxito! El chango ha sido vaciado.");
        navigate("/");
      },
    });
  };

  if (isAuthLoading || isChangoLoading || isProductsLoading) {
    return <LoadingSpinner />;
  }

  if (isChangoError || isProductsError) {
    return (
      <article className="container">
        <h1>Error</h1>
        <p>
          Hubo un problema al cargar el chango. Por favor, inténtelo de nuevo
          más tarde.
        </p>
      </article>
    );
  }

  if (combinedData.length === 0) {
    return (
      <article className="container mx-auto p-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Tu Carrito</h1>
        <p className="text-gray-600">Tu carrito está vacío.</p>
      </article>
    );
  }

  if (!isAuthenticated) {
    return (
      <article className="container">
        <h1>Carrito</h1>
        <p>Por favor, inicia sesión para ver tu carrito.</p>
      </article>
    );
  }

  return (
    <article className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Tu Chango</h1>
      {removeMutation.isPending && <p>Eliminando producto...</p>}
      {clearChangoMutation.isPending && <p>Vaciando chango...</p>}
      <article className="bg-white shadow-md rounded-lg p-6">
        <ul>
          {combinedData.map((item) => (
            <li
              key={item.id}
              className="flex justify-between items-center py-4 border-b"
            >
              <div className="flex items-center">
                <img
                  src={item.imageUrl || "https://via.placeholder.com/64"}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded mr-4"
                />
                <div>
                  <p className="text-lg font-semibold">{item.name}</p>
                  <p className="text-gray-500">Cantidad: {item.quantity}</p>
                </div>
              </div>
              <aside className="text-right">
                <p>Precio unitario: ${item.price}</p>
                <p className="font-semibold">
                  Subtotal: ${(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  className="w-full border border-black rounded-md bg-gray-100 hover:bg-gray-300 mt-2"
                  onClick={() => handleRemoveClick(item.id)}
                  disabled={removeMutation.isPending}
                >
                  Eliminar
                </button>
              </aside>
            </li>
          ))}
        </ul>
        <footer className="mt-6 pt-4 border-t-2 border-gray-200">
          <div className="flex justify-between items-center font-bold text-xl">
            <p>Total:</p>
            <p>${subtotal.toFixed(2)}</p>
          </div>
        </footer>
        <button
          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-md shadow-sm transition-colors duration-200 mt-3"
          onClick={handleClearChangoClick}
          disabled={clearChangoMutation.isPending || combinedData.length === 0}
        >
          Vaciar Chango
        </button>
        <button
          className="mt-6 w-full bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-colors text-lg"
          onClick={handleCheckout}
          disabled={clearChangoMutation.isPending || combinedData.length === 0}
        >
          Finalizar Compra
        </button>
      </article>
    </article>
  );
}