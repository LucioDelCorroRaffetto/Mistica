import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProductById } from "../services/product-service";
import { addToCart } from "../services/cart-service";
import { useAuth } from "../hook/useAuth";
import { ReviewCard } from "../components/ReviewCard";
import { WishlistButton } from "../components/WishlistButton";
import { ImageGallery } from "../components/ImageGallery";
import type { AddToCartRequest } from "@backend-types/type";

export function DetailProduct() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductById(productId!),
    enabled: !!productId,
  });

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

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      alert("Debes iniciar sesión para añadir productos al carrito.");
      navigate("/login");
      return;
    }

    if (product && productId) {
      const requestData: AddToCartRequest = {
        productId: productId,
        quantity: 1,
      };
      mutate(requestData);
    }
  };

  if (isLoading) {
    return (
      <article className="detail-product-page flex items-center justify-center" style={{ minHeight: "100vh" }}>
        <p className="text-xl text-gray-500">Cargando producto...</p>
      </article>
    );
  }

  if (isError || !product) {
    return (
      <article className="detail-product-page flex items-center justify-center" style={{ minHeight: "100vh" }}>
        <p className="text-xl text-red-500">Producto no encontrado o error.</p>
      </article>
    );
  }

  // Create array of images (for gallery)
  const productImages = [product.imageUrl];

  return (
    <article className="detail-product-page">
      <div className="detail-product-container">
        <figure className="detail-product-image">
          <ImageGallery images={productImages} productName={product.name} />
        </figure>
        <aside className="detail-product-info">
          <div className="detail-product-header">
            <div className="detail-product-category">{product.category}</div>
            <h1 className="detail-product-title">{product.name}</h1>
            <p className="detail-product-description">{product.description}</p>
          </div>

          <div className="detail-product-price-section">
            <div className="detail-product-price">${product.price}</div>
            <p className={`detail-product-stock ${product.stock > 0 ? "in-stock" : "out-of-stock"}`}>
              {product.stock > 0 ? `✓ ${product.stock} en stock` : "❌ Agotado"}
            </p>
          </div>

          <div className="detail-product-actions">
            <button
              className="detail-product-add-btn"
              onClick={handleAddToCart}
              disabled={isAdding || product.stock === 0}
            >
              {isAdding ? "Añadiendo..." : "Añadir al carrito"}
            </button>
            <WishlistButton productId={productId!} />
          </div>

          <button
            className="btn btn-outline w-full"
            onClick={() => navigate(-1)}
          >
            ← Volver
          </button>
        </aside>
      </div>

      {/* Reviews Section */}
      <div className="detail-product-reviews">
        <ReviewCard productId={productId!} onReviewAdded={() => {}} />
      </div>
    </article>
  );
}