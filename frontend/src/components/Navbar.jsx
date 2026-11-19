
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const categories = [
        { name: "Trang chủ", path: "/" },
        { name: "VGA", path: "/products?category=vga" },
        { name: "RAM", path: "/products?category=ram" },
        { name: "CPU", path: "/products?category=cpu" },
        { name: "Mainboard", path: "/products?category=mainboard" },
        { name: "SSD", path: "/products?category=ssd" },
        { name: "PSU", path: "/products?category=psu" },
        { name: "Case PC", path: "/products?category=case" },
        { name: "Tản nhiệt", path: "/products?category=cooler" }
    ];

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user.role === 'admin';

    return (
        <nav className="navbar">
            <div className="navbar-container">

                {/* Nút danh mục chỉ hiện trên điện thoại */}
                <button
                    className="category-toggle"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    ☰ Danh mục
                    <span>{isOpen ? "▲" : "▼"}</span>
                </button>

                {/* Danh sách danh mục */}
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
            </div>
        </nav>
    );
}

export default Navbar;
