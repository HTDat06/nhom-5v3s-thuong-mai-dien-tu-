
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const API_URL = "http://localhost:5000/api";

function Home() {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${API_URL}/products`);
                const result = await response.json();

                if (!response.ok || result.success === false) {
                    throw new Error(result.message || "Không thể tải sản phẩm.");
                }

                setProducts(result.data || []);
            } catch (error) {
                console.error("Lỗi lấy sản phẩm:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="home-container">
            <section className="banner">
                <h1>Chào mừng đến với MyShop</h1>
                <p>Khám phá các sản phẩm công nghệ mới nhất</p>

                <button
                    className="view-products-button"
                    onClick={() => navigate("/products")}
                >
                    Xem sản phẩm
                </button>
            </section>

            <section className="products-section">
                <h2>Sản phẩm nổi bật</h2>

                {loading ? (
                    <p>Đang tải sản phẩm...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : products.length === 0 ? (
                    <p>Không có sản phẩm.</p>
                ) : (
                    <>
                        <div className="product-list-grid">
                            {products.slice(0, 8).map(product => (
                                <ProductCard
                                    key={product.product_id}
                                    product={product}
                                />
                            ))}
                        </div>

                        <div className="view-all-container">
                            <button
                                className="view-all-button"
                                onClick={() => navigate("/products")}
                            >
                                Xem tất cả sản phẩm →
                            </button>
                        </div>
                    </>
                )}
            </section>
        </div>
    );
}

export default Home;
