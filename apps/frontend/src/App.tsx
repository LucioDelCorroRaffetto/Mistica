import { Routes, Route } from "react-router-dom";
import { ProductListPage } from "./page/ListProductPage";
import { DetailProduct } from "./page/DetailProduct";
import { ChangoPage } from "./page/ChangoPage";
import { Navbar } from "./layout/NavBar";
import { Footer } from "./layout/Footer";
import { LoginPage } from "./page/LoginPage";
import { RegisterPage } from "./page/RegisterPage";
import { AuthGuard } from "./components/authenticate/auth";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<ProductListPage />} />
          <Route path="/products/:productId" element={<DetailProduct />} />
          <Route
            path="/chango"
            element={
              <AuthGuard>
                <ChangoPage />
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