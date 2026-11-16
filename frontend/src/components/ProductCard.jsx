import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import "../styles/ProductCard.css";

function ProductCard({ product }) {
    const { user } = useAuth();
    const { addToCart } = useCart() || {};
    const navigate = useNavigate();
    const [adding, setAdding] = useState(false);
    const [addedSuccess, setAddedSuccess] = useState(false);

    const isOutOfStock = product.stock !== undefined && product.stock <= 0;

    const handleAddToCart = async () => {
        if (!user) {
            alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
            navigate("/login");
            return;
        }

        const productId = product.product_id ?? product.id;

        try {
            setAdding(true);
            await addToCart(productId, 1);
            setAddedSuccess(true);
            setTimeout(() => setAddedSuccess(false), 1200);
        } catch (error) {
            alert(error.message || "Không thể thêm sản phẩm vào giỏ hàng.");
        } finally {
            setAdding(false);
        }
    };

    return (
        <div className="product-card">
            <img
                src={product.image}
                alt={product.name || product.product_name}
                className="product-image"
            />

            <div className="product-info">
                <h3>{product.name || product.product_name}</h3>
                <p className="product-price">{product.price}</p>

                <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={adding || isOutOfStock}
                    style={{
                        marginTop: "10px",
                        width: "100%",
                        padding: "8px 12px",
                        backgroundColor: isOutOfStock
                            ? "#9e9e9e"
                            : addedSuccess
                            ? "#2e7d32"
                            : "#1976d2",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        cursor: adding || isOutOfStock ? "not-allowed" : "pointer",
                        fontWeight: "600",
                    }}
                >
                    {isOutOfStock
                        ? "Hết hàng"
                        : adding
                        ? "Đang thêm..."
                        : addedSuccess
                        ? "✓ Đã thêm vào giỏ"
                        : "Thêm vào giỏ"}
                </button>
            </div>
        </div>
    );
}

export default ProductCard;