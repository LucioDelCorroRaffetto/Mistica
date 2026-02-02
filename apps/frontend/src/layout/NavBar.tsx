import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hook/useAuth";
import { useTheme } from "../context/ThemeContext";
import LogoMistica from "../assets/mistica-logo.svg";

export function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <Link to="/" className="navbar-brand flex items-center gap-2">
            <img src={LogoMistica} alt="Mística" className="w-10 h-10" />
            <span>MÍSTICA</span>
          </Link>

          <div className="navbar-nav">
            <Link to="/">Mística</Link>
            <Link to="/libros">Libros</Link>
            {isAuthenticated ? (
              <>
                <Link to="/wishlist">❤️ Wishlist</Link>
                <Link to="/orders">📦 Órdenes</Link>
                <Link to="/cart">🛒 Carrito</Link>
                <Link to="/perfil">👤 Perfil</Link>
                <button
                  onClick={handleLogout}
                  className="btn btn-error btn-sm ml-2"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-primary btn-sm">
                  Login
                </Link>
                <Link to="/register" className="btn btn-secondary btn-sm">
                  Registro
                </Link>
              </>
            )}

            <button
              onClick={toggleTheme}
              className="theme-toggle-btn ml-2"
              title={`Cambiar a modo ${theme === "light" ? "oscuro" : "claro"}`}
              aria-label="Toggle theme"
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}