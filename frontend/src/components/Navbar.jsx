
import React, { useState } from "react";
import { Link } from "react-router-dom";
import AccountMenu from "../components/AccountMenu";

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const categories = [
        { name: "Trang chủ", path: "/" },
        { name: "CPU - Bộ vi xử lý", path: "/?category_id=1" },
        { name: "Mainboard - Bo mạch chủ", path: "/?category_id=2" },
        { name: "RAM - Bộ nhớ", path: "/?category_id=3" },
        { name: "VGA - Card màn hình", path: "/?category_id=4" },
        { name: "Ổ cứng - Lưu trữ", path: "/?category_id=5" }
    ];

    return (
        <nav className="navbar">
            <div className="navbar-container">

                <button
                    className="category-toggle"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-expanded={isOpen}
                >
                    <span>☰ Danh mục</span>
                    <span>{isOpen ? "▲" : "▼"}</span>
                </button>

                <ul className={`nav-list ${isOpen ? "active" : ""}`}>
                    {categories.map((item) => (
                        <li key={item.name}>
                            <Link
                                to={item.path}
                                onClick={() => setIsOpen(false)}
                            >
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Khách hàng nằm cùng hàng với danh mục */}
                <div className="navbar-account">
                    <AccountMenu />
                </div>

            </div>
        </nav>
    );
}

export default Navbar;
