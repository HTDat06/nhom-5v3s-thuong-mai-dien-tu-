
import { useState, useEffect } from "react";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const getCategories = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/api/categories"
                );

                const result = await response.json();

                console.log("Dữ liệu API:", result);

                if (result.success) {
                    setCategories(result.data);
                }
            } catch (error) {
                console.error("Lỗi lấy danh mục:", error);
            }
        };

        getCategories();
    }, []);

    return (
        <nav className="navbar">
            <div className="navbar-container">

                <button
                    className="menu-toggle"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    ☰ Danh mục
                </button>

                <ul className={`nav-list ${menuOpen ? "active" : ""}`}>
                    <li>
                        <a href="/">Trang chủ</a>
                    </li>

                    {categories.map((category) => (
                        <li key={category.category_id}>
                            <a href={`/products?category=${category.category_id}`}>
                                {category.category_name}
                            </a>
                        </li>
                    ))}
                </ul>

            </div>
        </nav>
    );
}

export default Navbar;
