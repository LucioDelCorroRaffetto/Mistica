import { useNavigate } from "react-router-dom";
import { useAuth } from "../hook/useAuth";
import BannerImg from "../assets/banners/wa.jpg";
import LogoMistica from "../assets/mistica-logo.svg";

export function HeroPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <article className="products-page">
      <div className="container mx-auto">
        {/* Hero Section con Banner */}
        <div className="hero-banner">
          <img
            src={BannerImg}
            alt="Mística Banner"
            className="w-full h-full object-cover"
          />
          <div className="hero-overlay">
            <div className="hero-content">
              <div className="hero-logo-section">
                <img src={LogoMistica} alt="Mística" className="hero-logo" />
              </div>
              <h1 className="hero-title">MÍSTICA</h1>
              <p className="hero-subtitle">
                Descubre el mundo de la literatura mágica y misteriosa
              </p>
              <button
                onClick={() => navigate("/libros")}
                className="btn btn-primary btn-lg"
              >
                Ver Libros →
              </button>
            </div>
          </div>
        </div>

        {/* Secciones destacadas */}
        <div className="products-header mb-12">
          <h2>Explora Nuestras Colecciones</h2>
          <p>Libros que transforman tu forma de ver el mundo</p>
        </div>

        <div className="hero-categories">
          {/* Ficción */}
          <div className="hero-category-card">
            <div className="hero-category-icon">📚</div>
            <h3 className="hero-category-title">Ficción</h3>
            <p className="hero-category-description">
              Historias que desafían la realidad y te transportan a mundos inexplorados
            </p>
            <button
              onClick={() => navigate("/libros")}
              className="btn btn-secondary btn-sm"
            >
              Explorar
            </button>
          </div>

          {/* Novela */}
          <div className="hero-category-card">
            <div className="hero-category-icon">✨</div>
            <h3 className="hero-category-title">Novela</h3>
            <p className="hero-category-description">
              Narrativas profundas que exploran la complejidad del ser humano
            </p>
            <button
              onClick={() => navigate("/libros")}
              className="btn btn-secondary btn-sm"
            >
              Explorar
            </button>
          </div>

          {/* Cuentos */}
          <div className="hero-category-card">
            <div className="hero-category-icon">🌙</div>
            <h3 className="hero-category-title">Cuentos</h3>
            <p className="hero-category-description">
              Relatos breves que capturan instantes mágicos de la existencia
            </p>
            <button
              onClick={() => navigate("/libros")}
              className="btn btn-secondary btn-sm"
            >
              Explorar
            </button>
          </div>
        </div>

        {/* CTA Section */}
        <div className="hero-cta-section">
          <h2 className="hero-cta-title">¿Listo para tu próxima aventura?</h2>
          <p className="hero-cta-subtitle">
            Explora nuestra colección de clásicos literarios y descubre nuevos mundos
          </p>
          {isAuthenticated ? (
            <button
              onClick={() => navigate("/libros")}
              className="btn btn-light btn-lg"
            >
              Ver Catálogo Completo
            </button>
          ) : (
            <button
              onClick={() => navigate("/register")}
              className="btn btn-light btn-lg"
            >
              Crear Cuenta
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
