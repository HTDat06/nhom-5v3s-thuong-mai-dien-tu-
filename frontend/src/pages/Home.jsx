
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const API_URL = "http://localhost:5000/api";

function Home() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const categoryId = searchParams.get("category_id");

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const categoryNames = {
        1: "CPU - Bộ vi xử lý",
        2: "Mainboard - Bo mạch chủ",
        3: "RAM - Bộ nhớ",
        4: "VGA - Card màn hình",
        5: "Ổ cứng - Lưu trữ"
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError("");

                let url = `${API_URL}/products`;

                if (categoryId) {
                    url += `?category_id=${categoryId}`;
                }

                const response = await fetch(url);
                const result = await response.json();

                if (!response.ok || result.success === false) {
                    throw new Error(
                        result.message || "Không thể tải sản phẩm."
                    );
                }

                setProducts(result.data || []);

            } catch (error) {
                console.error("Lỗi lấy sản phẩm:", error);
                setError(error.message);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [categoryId]);

    const title = categoryId
        ? categoryNames[categoryId] || "Danh sách sản phẩm"
        : "Sản phẩm nổi bật";

    return (
        <div className="home-container">

            {/* Chỉ hiện banner khi ở trang chủ */}
            {!categoryId && (
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
            )}

            <section className="products-section">
                <h2>{title}</h2>

                {loading ? (
                    <p>Đang tải sản phẩm...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : products.length === 0 ? (
                    <p>Không có sản phẩm trong danh mục này.</p>
                ) : (
                    <div className="product-list-grid">
                        {products.map((product) => (
                            <ProductCard
                                key={product.product_id}
                                product={product}
                            />
                        ))}
                    </div>
                )}
            </section>

        </div>
    );
}

export default Home;
