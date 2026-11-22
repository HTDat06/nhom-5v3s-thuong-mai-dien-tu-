
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

function Header() {
    const { user, logout } = useAuth();
    const { totalQuantity = 0 } = useCart() || {};
    const navigate = useNavigate();

    const [keyword, setKeyword] = useState("");

    const handleLogout = () => {
        logout();
        navigate("/", { replace: true });
    };

    const handleSearch = (e) => {
        e.preventDefault();

        const search = keyword.trim();

        if (!search) return;

        navigate(`/products?search=${encodeURIComponent(search)}`);
    };

    return (
        <header className="header">
            <div className="header-container">

                <Link to="/" className="logo">
                    MyShop
                </Link>

                <form className="search-box" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />

                    <button type="submit">Tìm kiếm</button>
                </form>

                <div className="header-actions">

                    {user?.role !== "admin" && (
                        <Link to="/cart" className="header-link">
                            🛒 Giỏ hàng
                            <span className="cart-badge">
                                {totalQuantity}
                            </span>
                        </Link>
                    )}

                    {user ? (
                        <>
                            {user.role === "admin" ? (
                                <Link to="/admin" className="header-link">
                                    Quản trị
                                </Link>
                            ) : (
                                <Link to="/my-orders" className="header-link">
                                    📦 Đơn hàng của tôi
                                </Link>
                            )}

                            <span className="header-link user-name">
                                Xin chào, {user.name}
                            </span>

                            <button
                                type="button"
                                className="header-link logout-button"
                                onClick={handleLogout}
                            >
                                Đăng xuất
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="header-link">
                                Đăng nhập
                            </Link>

                            <Link to="/register" className="header-link">
                                Đăng ký
                            </Link>
                        </>
                    )}

                </div>
            </div>
        </header>
    );
}

export default Header;
