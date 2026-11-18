
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import "../styles/ProductList.css";

const API_URL = "http://localhost:5000/api";

function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(`${API_URL}/products`);
                const result = await response.json();

                if (!response.ok || result.success === false) {
                    throw new Error(
                        result.message || "Không thể tải danh sách sản phẩm."
                    );
                }

                setProducts(Array.isArray(result.data) ? result.data : []);
            } catch (error) {
                console.error("Lỗi lấy danh sách sản phẩm:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="product-list-page">

            <div className="product-list-heading">
                <h1>Danh sách linh kiện máy tính</h1>
                <p>Khám phá các linh kiện máy tính chất lượng.</p>
            </div>

            <div className="product-list-toolbar">
                <h2>Tất cả sản phẩm</h2>
                <span>{products.length} sản phẩm</span>
            </div>

            {loading ? (
                <p className="product-list-message">
                    Đang tải sản phẩm...
                </p>
            ) : error ? (
                <p className="product-list-error">
                    {error}
                </p>
            ) : products.length === 0 ? (
                <p className="product-list-message">
                    Hiện chưa có sản phẩm nào.
                </p>
            ) : (
                <div className="product-list-grid">
                    {products.map((product) => (
                        <ProductCard
                            key={product.product_id ?? product.id}
                            product={product}
                        />
                    ))}
                </div>
            )}

        </div>
    );
}

export default ProductList;
