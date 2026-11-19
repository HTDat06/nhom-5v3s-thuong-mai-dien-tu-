import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";

import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Login from "./pages/login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import ProfilePage from "./pages/ProfilePage";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import Order from "./pages/Order";
import CartPage from "./pages/CartPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import { RequireAdmin } from "./components/ProtectedRoute";

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
                        <Route path="/products" element={<MainLayout><ProductList /></MainLayout>} />
                        <Route path="/products/:id" element={<MainLayout><ProductDetail /></MainLayout>} />
                        <Route path="/cart" element={<MainLayout><CartPage /></MainLayout>} />
                        <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
                        <Route path="/register" element={<MainLayout><Register /></MainLayout>} />
                        <Route path="/profile" element={<MainLayout><ProfilePage /></MainLayout>} />
                        <Route path="/order" element={<MainLayout><Order /></MainLayout>} />
                        <Route path="/my-orders" element={<MainLayout><MyOrdersPage /></MainLayout>} />
                        <Route path="/my-orders/:id" element={<MainLayout><OrderDetailPage /></MainLayout>} />
                        <Route path="/orders/:id" element={<MainLayout><OrderDetailPage /></MainLayout>} />

                        <Route element={<RequireAdmin />}>
                            <Route path="/admin" element={<MainLayout><Admin /></MainLayout>} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;