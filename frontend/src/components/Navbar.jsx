
import React, { useState } from "react";
import { Link } from "react-router-dom";
import AccountMenu from "../components/AccountMenu";

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

    return (
        <nav
            className="navbar"
            style={{
                width: "100%",
                backgroundColor: "#2563eb"
            }}
        >
            <div
                className="navbar-container"
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "nowrap",
                    gap: "15px",
                    padding: "0 20px"
                }}
            >
                <button
                    className="category-toggle"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    ☰ Danh mục
                    <span>{isOpen ? "▲" : "▼"}</span>
                </button>

                <ul
                    className={`nav-list ${isOpen ? "active" : ""}`}
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        flexWrap: "nowrap",
                        flex: 1,
                        gap: "25px",
                        margin: 0,
                        padding: 0,
                        listStyle: "none"
                    }}
                >
                    {categories.map((item) => (
                        <li
                            key={item.name}
                            style={{ whiteSpace: "nowrap" }}
                        >
                            <Link
                                to={item.path}
                                onClick={() => setIsOpen(false)}
                            >
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>

                <div
                    className="navbar-account"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "row",
                        flexShrink: 0,
                        whiteSpace: "nowrap"
                    }}
                >
                    <AccountMenu />
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
