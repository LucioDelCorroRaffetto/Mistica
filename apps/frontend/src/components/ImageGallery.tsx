import { useState } from "react";
import "./ImageGallery.css";

interface ImageGalleryProps {
  images: string[];
  productName: string;
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="image-gallery">
        <div className="no-image">Imagen no disponible</div>
      </div>
    );
  }

  return (
    <div className="image-gallery">
      <div className={`main-image ${isZoomed ? "zoomed" : ""}`}>
        <img
          src={images[selectedIndex]}
          alt={productName}
          onClick={() => setIsZoomed(!isZoomed)}
        />
        {images.length > 1 && (
          <>
            <button
              className="gallery-nav prev"
              onClick={() => setSelectedIndex((i) => (i === 0 ? images.length - 1 : i - 1))}
            >
              ❮
            </button>
            <button
              className="gallery-nav next"
              onClick={() => setSelectedIndex((i) => (i === images.length - 1 ? 0 : i + 1))}
            >
              ❯
            </button>
          </>
        )}
        {isZoomed && <div className="zoom-hint">Haz click para salir del zoom</div>}
      </div>

      {images.length > 1 && (
        <div className="thumbnails">
          {images.map((img, index) => (
            <button
              key={index}
              className={`thumbnail ${index === selectedIndex ? "active" : ""}`}
              onClick={() => setSelectedIndex(index)}
            >
              <img src={img} alt={`${productName} ${index + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
