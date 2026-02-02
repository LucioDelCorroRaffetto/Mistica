import { useState, useEffect } from "react";
import "./WishlistButton.css";

interface WishlistButtonProps {
  productId: string;
  userId?: string;
}

export function WishlistButton({ productId, userId = "user-001" }: WishlistButtonProps) {
  const [inWishlist, setInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkWishlist();
  }, [productId, userId]);

  const checkWishlist = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/wishlist/check?userId=${userId}&productId=${productId}`
      );
      const data = await response.json();
      setInWishlist(data.inWishlist);
    } catch (error) {
      console.error("Error checking wishlist:", error);
    }
  };

  const handleToggle = async () => {
    setLoading(true);
    try {
      if (inWishlist) {
        await fetch("http://localhost:3000/api/wishlist/remove", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, productId }),
        });
      } else {
        await fetch("http://localhost:3000/api/wishlist/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, productId }),
        });
      }
      checkWishlist();
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`wishlist-btn ${inWishlist ? "active" : ""}`}
      title={inWishlist ? "Remover de lista de deseos" : "Agregar a lista de deseos"}
    >
      {inWishlist ? "❤️" : "🤍"} {inWishlist ? "En wishlist" : "Wishlist"}
    </button>
  );
}
