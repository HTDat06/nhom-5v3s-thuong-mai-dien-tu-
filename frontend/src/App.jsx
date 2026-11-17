import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Login from "./pages/login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import ProfilePage from './pages/ProfilePage'; // Đã xóa chữ x thừa ở cuối
import ProductList from "./pages/ProductList";
import { RequireAdmin } from "./components/ProtectedRoute";


function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
                        <Route path="/products" element={<MainLayout><ProductList /></MainLayout>} />
                        <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
                        <Route path="/register" element={<MainLayout><Register /></MainLayout>} />
                        {/* Bọc MainLayout vào đây để hiện Navbar */}
                        <Route path="/profile" element={<MainLayout><ProfilePage /></MainLayout>} />
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