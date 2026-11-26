
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
    { name: "Ổ cứng - Lưu trữ", path: "/?category_id=5" },
    { name: "PSU - Nguồn máy tính", path: "/?category_id=6" },
    { name: "Case - Vỏ máy tính", path: "/?category_id=7" },
    { name: "Tản nhiệt - Cooling", path: "/?category_id=8" }
];

    return (
        <>
            <style>{`
                .myshop-navbar {
                    width: 100%;
                    background: #2563eb;
                    position: relative;
                    z-index: 100;
                }

                .myshop-navbar-container {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 20px;
                    padding: 10px 20px;
                }

                /* Desktop: luôn hiển thị danh mục ngang */
                .myshop-category-toggle {
                    display: none !important;
                }

                .myshop-category-list {
                    display: flex !important;
                    flex-direction: row;
                    align-items: center;
                    flex: 1;
                    gap: 25px;
                    margin: 0;
                    padding: 0;
                    list-style: none;
                }

                .myshop-category-list li {
                    white-space: nowrap;
                }

                .myshop-category-list a {
                    display: block;
                    color: white;
                    text-decoration: none;
                    font-weight: 500;
                    padding: 10px 0;
                }

                .myshop-category-list a:hover {
                    color: #bfdbfe;
                }

                .myshop-navbar-account {
                    flex-shrink: 0;
                    white-space: nowrap;
                }

                /* Mobile và tablet */
                @media (max-width: 900px) {
                    .myshop-navbar-container {
                        padding: 10px;
                    }

                    .myshop-category-toggle {
                        display: flex !important;
                        align-items: center;
                        gap: 10px;
                        padding: 10px 15px;
                        color: white;
                        background: #1d4ed8;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        white-space: nowrap;
                    }

                    .myshop-category-list {
                        display: none !important;
                        position: absolute;
                        top: 100%;
                        left: 10px;
                        right: 10px;
                        flex-direction: column;
                        align-items: stretch;
                        gap: 0;
                        background: white;
                        border-radius: 6px;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    }

                    .myshop-category-list.myshop-active {
                        display: flex !important;
                    }

                    .myshop-category-list a {
                        color: #333;
                        padding: 12px 16px;
                        border-bottom: 1px solid #eee;
                    }

                    .myshop-category-list a:hover {
                        color: #2563eb;
                        background: #eff6ff;
                    }

                    .myshop-navbar-account {
                        margin-left: auto;
                    }
                }
            `}</style>

            <nav className="myshop-navbar">
                <div className="myshop-navbar-container">

                    <button
                        type="button"
                        className="myshop-category-toggle"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        ☰ Danh mục
                        <span>{isOpen ? "▲" : "▼"}</span>
                    </button>

                    <ul className={`myshop-category-list ${isOpen ? "myshop-active" : ""}`}>
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

                    <div className="myshop-navbar-account">
                        <AccountMenu />
                    </div>

                </div>
            </nav>
        </>
    );
}

export default Navbar;
