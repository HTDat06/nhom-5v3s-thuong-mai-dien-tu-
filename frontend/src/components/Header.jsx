import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

function Header() {
    const { user, logout } = useAuth();
    const { totalQuantity = 0 } = useCart() || {};
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/", { replace: true });
    };

    return (
        <header className="header">
            <div className="header-container">
                <Link to="/" className="logo">MyShop</Link>

                <div className="search-box">
                    <input type="text" placeholder="Tìm kiếm sản phẩm..." />
                    <button type="button">Tìm kiếm</button>
                </div>

                <div className="header-actions">
                    <Link to="/cart" className="header-link">
                        🛒 Giỏ hàng
                        <span
                            style={{
                                backgroundColor: "#e53935",
                                color: "#fff",
                                borderRadius: "999px",
                                padding: "2px 7px",
                                fontSize: "12px",
                                marginLeft: "5px",
                                fontWeight: "bold",
                            }}
                        >
                            {totalQuantity}
                        </span>
                    </Link>

                    {user ? (
                        <>
                            {user.role === "admin" && (
                                <Link to="/admin" className="header-link">Quản trị</Link>
                            )}
                            <span className="header-link">Xin chào, {user.name}</span>
                            <button type="button" className="header-link" onClick={handleLogout}>
                                Đăng xuất
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="header-link">Đăng nhập</Link>
                            <Link to="/register" className="header-link">Đăng ký</Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;