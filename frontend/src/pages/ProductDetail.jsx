
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import "../styles/ProductDetail.css";
import { getImageUrl } from "../utils/imageUrl";

const API_URL = "http://localhost:5000/api";

function formatPrice(price) {
    const value = Number(String(price).replace(/[^\d]/g, ""));

    if (!Number.isFinite(value)) return price;

    return value.toLocaleString("vi-VN") + " ₫";
}

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { user } = useAuth();
    const { addToCart } = useCart() || {};

    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [adding, setAdding] = useState(false);
    const [addedSuccess, setAddedSuccess] = useState(false);

    // Lấy chi tiết sản phẩm
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError("");
                setProduct(null);
                setRelatedProducts([]);

                const response = await fetch(`${API_URL}/products/${id}`);
                const result = await response.json();

                if (!response.ok || result.success === false) {
                    throw new Error(
                        result.message || "Không thể tải chi tiết sản phẩm."
                    );
                }

                const productData = result.data;

                if (!productData) {
                    throw new Error("Không tìm thấy sản phẩm.");
                }

                setProduct(productData);

                // Lấy sản phẩm cùng danh mục
                if (productData.category_id) {
                    const relatedResponse = await fetch(
                        `${API_URL}/products?category_id=${productData.category_id}`
                    );

                    const relatedResult = await relatedResponse.json();

                    if (relatedResponse.ok && relatedResult.success !== false) {
                        const related = (relatedResult.data || [])
                            .filter(
                                (item) =>
                                    item.product_id !== productData.product_id
                            )
                            .slice(0, 4);

                        setRelatedProducts(related);
                    }
                }
            } catch (err) {
                console.error("Lỗi tải chi tiết sản phẩm:", err);
                setError(err.message || "Đã xảy ra lỗi.");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    // Thêm sản phẩm vào giỏ hàng bằng chức năng TM-05
    const handleAddToCart = async () => {
        if (!user) {
            alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
            navigate("/login");
            return;
        }

        if (!product || product.stock <= 0) {
            alert("Sản phẩm hiện đã hết hàng.");
            return;
        }

        try {
            setAdding(true);
            await addToCart(product.product_id, 1);

            setAddedSuccess(true);
            setTimeout(() => setAddedSuccess(false), 1500);
        } catch (err) {
            alert(err.message || "Không thể thêm sản phẩm vào giỏ hàng.");
        } finally {
            setAdding(false);
        }
    };

    if (loading) {
        return <div className="detail-message">Đang tải sản phẩm...</div>;
    }

    if (error || !product) {
        return (
            <div className="detail-message error">
                {error || "Không tìm thấy sản phẩm."}
                <button onClick={() => navigate("/products")}>
                    Quay lại danh sách
                </button>
            </div>
        );
    }

    const isOutOfStock = Number(product.stock) <= 0;

    return (
        <div className="product-detail-page">
            <button
                className="back-button"
                onClick={() => navigate(-1)}
            >
                ← Quay lại
            </button>

            <section className="product-detail">
                <div className="detail-image">
                    <img
                        src={getImageUrl(product.image)}
                        alt={product.product_name}
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.style.display = "none";
                        }}
                    />
                </div>

                <div className="detail-info">
                    <p className="detail-category">
                        {product.categories?.category_name || "Sản phẩm"}
                    </p>

                    <h1>{product.product_name}</h1>

                    <p className="detail-price">
                        {formatPrice(product.price)}
                    </p>

                    <div className="detail-description">
                        <h3>Mô tả sản phẩm</h3>
                        <p>
                            {product.description || "Chưa có mô tả sản phẩm."}
                        </p>
                    </div>

                    <p className="detail-stock">
                        Tồn kho:{" "}
                        <strong>
                            {isOutOfStock
                                ? "Hết hàng"
                                : `${product.stock} sản phẩm`}
                        </strong>
                    </p>

                    <button
                        className="detail-add-button"
                        onClick={handleAddToCart}
                        disabled={adding || isOutOfStock}
                    >
                        {isOutOfStock
                            ? "Hết hàng"
                            : adding
                                ? "Đang thêm..."
                                : addedSuccess
                                    ? "✓ Đã thêm vào giỏ"
                                    : "Thêm vào giỏ hàng"}
                    </button>
                </div>
            </section>

            <section className="related-products">
                <h2>Sản phẩm cùng danh mục</h2>

                {relatedProducts.length === 0 ? (
                    <p>Chưa có sản phẩm cùng danh mục.</p>
                ) : (
                    <div className="product-list-grid">
                        {relatedProducts.map((item) => (
                            <ProductCard
                                key={item.product_id}
                                product={item}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default ProductDetail;
