import { useNavigate } from "react-router-dom";
import { useAuth } from "../hook/useAuth";
import AvatarImg from "../assets/avatars/descarga (1).png";
import { useState } from "react";
import { updateProfile } from "../services/auth";

export function ProfilePage() {
  const { isAuthenticated, user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <article className="products-page">
        <div className="container mx-auto">
          <div className="chango-empty">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Por favor, inicia sesión</h1>
            <p className="text-gray-600 mb-6">Necesitas estar autenticado para ver tu perfil</p>
            <button
              onClick={() => navigate("/login")}
              className="btn btn-primary"
            >
              Ir a Login
            </button>
          </div>
        </div>
      </article>
    );
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const [editMode, setEditMode] = useState(false);
  const [nameInput, setNameInput] = useState(user?.name ?? "");
  const [emailInput, setEmailInput] = useState(user?.email ?? "");

  const handleSave = async () => {
    try {
      await updateProfile({ name: nameInput, email: emailInput });
      await refreshUser();
      setEditMode(false);
    } catch (err) {
      console.error("Error updating profile", err);
      alert("No se pud actualizar el perfil. Revisa la consola.");
    }
  };

  return (
    <article className="products-page">
      <div className="container mx-auto max-w-lg">
        <div className="products-header mb-8">
          <h1 className="text-3xl">Mi Perfil</h1>
          <p className="text-sm">Información de tu cuenta</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header con fondo degradado */}
          <div className="h-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

          {/* Contenido del perfil */}
          <div className="px-6 pb-6">
            {/* Avatar */}
            <div className="flex flex-col items-center -mt-12 mb-6">
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                <img
                  src={AvatarImg}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mt-3">
                {user?.name || "Usuario"}
              </h2>
              <p className="text-sm text-gray-500">{user?.email || "email@example.com"}</p>
            </div>

            {/* Información de cuenta */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-base font-bold text-gray-800 mb-3">Información de la Cuenta</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center pb-2 border-b border-gray-200 text-sm">
                  <span className="text-gray-600">Nombre:</span>
                  {!editMode ? (
                    <span className="font-semibold text-gray-800">{user?.name || "N/A"}</span>
                  ) : (
                    <input value={nameInput} onChange={(e) => setNameInput(e.target.value)} className="ml-4 p-1 rounded border" />
                  )}
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-200 text-sm">
                  <span className="text-gray-600">Email:</span>
                  {!editMode ? (
                    <span className="font-semibold text-gray-800">{user?.email || "N/A"}</span>
                  ) : (
                    <input value={emailInput} onChange={(e) => setEmailInput(e.target.value)} className="ml-4 p-1 rounded border" />
                  )}
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Estado:</span>
                  <span className="text-green-600 font-semibold">✓ Activo</span>
                </div>
              </div>
            </div>

            {/* Small brand hint (non-distracting) */}
            <div className="flex justify-center mb-6 text-xs text-gray-400">Mística · Tu librería</div>

            {/* Acciones */}
            <div className="flex gap-3">
              {!editMode ? (
                <>
                  <button onClick={() => navigate("/")} className="flex-1 btn btn-outline btn-sm">← Volver</button>
                  <button onClick={() => setEditMode(true)} className="flex-1 btn btn-primary btn-sm">Editar</button>
                  <button onClick={handleLogout} className="flex-1 btn btn-error btn-sm">Cerrar Sesión</button>
                </>
              ) : (
                <>
                  <button onClick={() => setEditMode(false)} className="flex-1 btn btn-outline btn-sm">Cancelar</button>
                  <button onClick={handleSave} className="flex-1 btn btn-primary btn-sm">Guardar</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
