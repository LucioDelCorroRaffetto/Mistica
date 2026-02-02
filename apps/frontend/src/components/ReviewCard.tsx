import { useState, useEffect } from "react";
import "./ReviewCard.css";

interface ReviewCardProps {
  productId: string;
  onReviewAdded: () => void;
}

export function ReviewCard({ productId, onReviewAdded }: ReviewCardProps) {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [avgRating, setAvgRating] = useState(0);

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const loadReviews = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/products/${productId}/reviews`);
      if (response.ok) {
        const data = await response.json();
        setReviews(Array.isArray(data) ? data : []);
      } else {
        setReviews([]);
      }

      const ratingResponse = await fetch(`http://localhost:3000/api/products/${productId}/rating`);
      if (ratingResponse.ok) {
        const ratingData = await ratingResponse.json();
        setAvgRating(typeof ratingData?.average === 'number' ? ratingData.average : 0);
      } else {
        setAvgRating(0);
      }
    } catch (error) {
      console.error("Error loading reviews:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:3000/api/products/${productId}/reviews`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId,
            userId: "user-001", // In real app, get from auth
            rating,
            title,
            comment,
          }),
        }
      );

      if (response.ok) {
        setTitle("");
        setComment("");
        setRating(5);
        loadReviews();
        onReviewAdded();
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-card">
      <div className="review-header">
        <h3>Reseñas y Calificaciones</h3>
        <div className="rating-summary">
          <div className="stars">
            {"⭐".repeat(Math.max(0, Math.round(avgRating)))}
            <span className="rating-value">{(avgRating ?? 0).toFixed(1)}/5</span>
          </div>
          <p className="review-count">({reviews.length} reseñas)</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="review-form">
        <div className="form-group">
          <label>Tu calificación:</label>
          <div className="star-selector">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`star-btn ${rating >= star ? "active" : ""}`}
                onClick={() => setRating(star)}
              >
                ⭐
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="title">Título:</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título de tu reseña"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="comment">Reseña:</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Comparte tu opinión sobre este libro..."
            rows={4}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Enviando..." : "Enviar Reseña"}
        </button>
      </form>

      <div className="reviews-list">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="review-item">
              <div className="review-meta">
                <span className="stars">{"⭐".repeat(review.rating)}</span>
                <span className="date">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h4>{review.title}</h4>
              <p>{review.comment}</p>
            </div>
          ))
        ) : (
          <p className="no-reviews">No hay reseñas aún. ¡Sé el primero en reseñar!</p>
        )}
      </div>
    </div>
  );
}
