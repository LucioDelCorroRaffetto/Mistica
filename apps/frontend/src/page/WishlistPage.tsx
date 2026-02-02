import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./WishlistPage.css";

export function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userId = "user-001"; // Get from auth

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/wishlist?userId=${userId}`);
      const data = await response.json();
      
      // Fetch full product details (API returns { payload })
      const itemsWithProducts = await Promise.all(
        data.items.map(async (item: any) => {
          const prodResponse = await fetch(`http://localhost:3000/api/products/${item.productId}`);
          const prodJson = await prodResponse.json();
          const product = prodJson?.payload ?? prodJson;
          return { ...item, product };
        })
      );
      
      setWishlistItems(itemsWithProducts);
    } catch (error) {
      console.error("Error loading wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      await fetch("http://localhost:3000/api/wishlist/remove", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId }),
      });
      loadWishlist();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleAddToCart = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  const handleClear = async () => {
    if (window.confirm("¿Estás seguro de que deseas vaciar toda tu lista de deseos?")) {
      try {
        await fetch(`http://localhost:3000/api/wishlist/clear?userId=${userId}`, {
          method: "DELETE",
        });
        loadWishlist();
      } catch (error) {
        console.error("Error clearing wishlist:", error);
      }
    }
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <article className="wishlist-page">
      <div className="container mx-auto">
        <div className="wishlist-header">
          <h1>Mi Lista de Deseos</h1>
          <p>{wishlistItems.length} libro(s) en tu lista</p>
        </div>

        {wishlistItems.length > 0 ? (
          <>
            <div className="wishlist-items">
              {wishlistItems.map((item) => (
                <div key={item.id} className="wishlist-item">
                  <div className="item-image">
                    <img src={item.product?.imageUrl || "https://via.placeholder.com/150"} alt={item.product?.name || "Libro"} />
                  </div>
                  <div className="item-details">
                    <h3>{item.product?.name}</h3>
                    <p className="category">{item.product?.category}</p>
                    <p className="description">{item.product?.description}</p>
                    <div className="item-footer">
                      <span className="price">${item.product?.price ?? "-"}</span>
                      <div className="item-actions">
                        <button
                          onClick={() => handleAddToCart(item.product?.id)}
                          className="btn btn-primary btn-sm"
                          disabled={!item.product?.id}
                        >
                          Ver Producto
                        </button>
                        <button
                          onClick={() => handleRemove(item.product?.id)}
                          className="btn btn-error btn-sm"
                          disabled={!item.product?.id}
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={handleClear} className="btn btn-error btn-lg clear-btn">
              Vaciar Lista de Deseos
            </button>
          </>
        ) : (
          <div className="empty-wishlist">
            <p>Tu lista de deseos está vacía</p>
            <button onClick={() => navigate("/libros")} className="btn btn-primary">
              Explorar Libros
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
