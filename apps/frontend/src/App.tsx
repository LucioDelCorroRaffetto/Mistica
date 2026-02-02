import { Routes, Route } from "react-router-dom";
import { ProductListPage } from "./page/ListProductPage";
import { DetailProduct } from "./page/DetailProduct";
import { CartPage } from "./page/CartPage";
import { HeroPage } from "./page/HeroPage";
import { ProfilePage } from "./page/ProfilePage";
import { WishlistPage } from "./page/WishlistPage";
import { OrdersHistoryPage } from "./page/OrdersHistoryPage";
import { Navbar } from "./layout/NavBar";
import { Footer } from "./layout/Footer";
import { LoginPage } from "./page/LoginPage";
import { RegisterPage } from "./page/RegisterPage";
import { AuthGuard } from "./components/authenticate/auth";
import NotificationCenter from "./components/NotificationCenter";
import ProductComparator from "./components/ProductComparator";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <NotificationCenter />
      <ProductComparator />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HeroPage />} />
          <Route path="/libros" element={<ProductListPage />} />
          <Route path="/products/:productId" element={<DetailProduct />} />
          <Route
            path="/cart"
            element={
              <AuthGuard>
                <CartPage />
              </AuthGuard>
            }
          />
          <Route
            path="/perfil"
            element={
              <AuthGuard>
                <ProfilePage />
              </AuthGuard>
            }
          />
          <Route
            path="/wishlist"
            element={
              <AuthGuard>
                <WishlistPage />
              </AuthGuard>
            }
          />
          <Route
            path="/orders"
            element={
              <AuthGuard>
                <OrdersHistoryPage />
              </AuthGuard>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;