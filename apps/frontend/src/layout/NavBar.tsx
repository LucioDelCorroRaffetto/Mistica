import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hook/useAuth";

export function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-900 via-purple-800 to-pink-700 p-4 shadow-lg rounded-b-xl">
      <article className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-3xl font-extrabold tracking-wide drop-shadow-lg">
          Mistica
        </Link>
        <div className="flex gap-4 items-center">
          <Link to="/" className="text-pink-200 hover:text-white font-medium px-3 py-1 rounded transition-colors duration-200">
            Libros
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/chango" className="text-pink-200 hover:text-white font-medium px-3 py-1 rounded transition-colors duration-200">
                Chango
              </Link>
              <button
                onClick={handleLogout}
                className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-4 py-1 rounded shadow transition-colors duration-200"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="bg-indigo-700 hover:bg-indigo-800 text-white font-semibold px-4 py-1 rounded shadow transition-colors duration-200">
                Login
              </Link>
              <Link to="/register" className="bg-purple-700 hover:bg-purple-800 text-white font-semibold px-4 py-1 rounded shadow transition-colors duration-200">
                Registro
              </Link>
            </>
          )}
        </div>
      </article>
    </nav>
  );
}