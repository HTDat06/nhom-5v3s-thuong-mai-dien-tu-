import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import "../styles/ProductCard.css";

function formatPrice(price) {
    const value = Number(String(price).replace(/[^\d]/g, ""));

    if (!Number.isFinite(value)) return price;
    return value.toLocaleString("vi-VN") + " ₫";
}

function ProductCard({ product }) {
    const { user } = useAuth();
    const { addToCart } = useCart() || {};
    const navigate = useNavigate();

    const [adding, setAdding] = useState(false);
    const [addedSuccess, setAddedSuccess] = useState(false);

    const isOutOfStock =
        product.stock !== undefined && product.stock <= 0;

    const productId = product.product_id ?? product.id;

    const handleAddToCart = async () => {
        if (!user) {
            alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
            navigate("/login");
            return;
        }

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
                <h3>
                    <Link
                        to={`/products/${productId}`}
                        className="product-name-link"
                    >
                        {product.name || product.product_name}
                    </Link>
                </h3>

                <p className="product-price">
                    {formatPrice(product.price)}
                </p>

                <button
                    type="button"
                    className={`add-cart-button ${addedSuccess ? "added" : ""}`}
                    onClick={handleAddToCart}
                    disabled={adding || isOutOfStock}
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