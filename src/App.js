import { BrowserRouter, Routes, Route } from "react-router-dom";
import "@/App.css";

import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { I18nProvider } from "./contexts/I18nContext";
import Layout from "./components/Layout";

import Home from "./pages/Home";
import Store from "./pages/Store";
import Category from "./pages/Category";
import Product from "./pages/Product";
import HowItWorks from "./pages/HowItWorks";
import Support from "./pages/Support";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/Account";
import Admin from "./pages/Admin";
function App() {
  return (
    <div className="App">
      <I18nProvider>
        <AuthProvider>
          <CartProvider>
            <BrowserRouter>
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/store" element={<Store />} />
                  <Route path="/categories/:slug" element={<Category />} />
                  <Route path="/product/:handle" element={<Product />} />
                  <Route path="/how-it-works" element={<HowItWorks />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/admin" element={<Admin />} />
                </Routes>
              </Layout>
            </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </I18nProvider>
    </div>
  );
}

export default App;
