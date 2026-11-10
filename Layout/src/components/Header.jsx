function Header() {
    return (
        <header className="header">
            <div className="header-container">

                {/* Logo */}
                <a href="/" className="logo">
                    MyShop
                </a>

                {/* Ô tìm kiếm */}
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm..."
                    />
                    <button type="button">Tìm kiếm</button>
                </div>

                {/* Các chức năng */}
                <div className="header-actions">
                    <a href="/cart" className="header-link">
                        🛒 Giỏ hàng
                    </a>

                    <a href="/login" className="header-link">
                        Đăng nhập
                    </a>
                </div>

            </div>
        </header>
    );
}

export default Header;