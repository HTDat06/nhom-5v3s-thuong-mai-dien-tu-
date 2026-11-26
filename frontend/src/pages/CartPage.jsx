import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const resolveImageUrl = (image) => {
    if (!image) return "https://via.placeholder.com/80?text=No+Image";

    if (image.startsWith("http://") || image.startsWith("https://")) {
        return image;
    }

    if (image.startsWith("/uploads/")) {
        return `${API_BASE_URL}${image}`;
    }

    if (image.startsWith("uploads/")) {
        return `${API_BASE_URL}/${image}`;
    }

    return `${API_BASE_URL}/uploads/products/${image.split("/").pop()}`;
};

function CartPage() {
    const { token } = useAuth();
    const {
        cartItems,
        totalQuantity,
        totalAmount,
        updateQuantity,
        removeFromCart,
        clearCart,
    } = useCart();

    const [draftQuantities, setDraftQuantities] = useState({});
    const [loadingItemId, setLoadingItemId] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        const synced = {};
        cartItems.forEach((item) => {
            synced[item.cart_item_id] = item.quantity;
        });
        setDraftQuantities(synced);
    }, [cartItems]);

    const formatCurrency = (value) => Number(value || 0).toLocaleString("vi-VN") + " ₫";

    const handleChangeQuantity = async (item, newQty) => {
        setErrorMessage("");
        setSuccessMessage("");

        const stock = Number(item.products?.stock ?? 0);
        const parsedQty = Number(newQty);

        if (!Number.isInteger(parsedQty) || parsedQty < 1) {
            setDraftQuantities((prev) => ({ ...prev, [item.cart_item_id]: item.quantity }));
            setErrorMessage("Số lượng sản phẩm tối thiểu phải là 1.");
            return;
        }

        if (parsedQty > stock) {
            setDraftQuantities((prev) => ({ ...prev, [item.cart_item_id]: item.quantity }));
            setErrorMessage(
                `Sản phẩm "${item.products?.product_name}" chỉ còn ${stock} sản phẩm trong kho.`
            );
            return;
        }

        if (parsedQty === item.quantity) return;

        try {
            setLoadingItemId(item.cart_item_id);
            await updateQuantity(item.cart_item_id, parsedQty);
            setSuccessMessage("Đã cập nhật số lượng giỏ hàng.");
        } catch (err) {
            setDraftQuantities((prev) => ({ ...prev, [item.cart_item_id]: item.quantity }));
            setErrorMessage(err.message || "Không thể cập nhật số lượng.");
        } finally {
            setLoadingItemId(null);
        }
    };

    const handleRemoveItem = async (item) => {
        setErrorMessage("");
        setSuccessMessage("");

        try {
            setLoadingItemId(item.cart_item_id);
            await removeFromCart(item.cart_item_id);
            setSuccessMessage(`Đã xóa "${item.products?.product_name}" khỏi giỏ hàng.`);
        } catch (err) {
            setErrorMessage(err.message || "Không thể xóa sản phẩm.");
        } finally {
            setLoadingItemId(null);
        }
    };

    const handleClearCart = async () => {
        const confirmed = window.confirm(
            "Bạn có chắc chắn muốn xóa toàn bộ sản phẩm khỏi giỏ hàng không?"
        );

        if (!confirmed) return;

        setErrorMessage("");
        setSuccessMessage("");

        try {
            setLoadingItemId("all");
            await clearCart();
            setSuccessMessage("Đã xóa toàn bộ giỏ hàng thành công.");
        } catch (err) {
            setErrorMessage(err.message || "Không thể xóa giỏ hàng.");
        } finally {
            setLoadingItemId(null);
        }
    };

    if (!token) {
        return (
            <div style={styles.container}>
                <div style={styles.emptyBox}>
                    <h2>Giỏ hàng của bạn</h2>
                    <p>Vui lòng đăng nhập để xem và quản lý giỏ hàng.</p>
                    <Link to="/login" style={styles.primaryBtn}>
                        Đăng nhập ngay
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.headingRow}>
                <h2 style={styles.heading}>
                    🛒 Giỏ hàng của bạn ({totalQuantity} sản phẩm)
                </h2>

                {cartItems.length > 0 && (
                    <button
                        type="button"
                        style={styles.deleteAllBtn}
                        disabled={loadingItemId !== null}
                        onClick={handleClearCart}
                    >
                        Xóa toàn bộ giỏ hàng
                    </button>
                )}
            </div>

            {errorMessage && <div style={styles.errorBanner}>{errorMessage}</div>}
            {successMessage && <div style={styles.successBanner}>{successMessage}</div>}

            {cartItems.length === 0 ? (
                <div style={styles.emptyBox}>
                    <p style={{ fontSize: "16px", color: "#555", marginBottom: "16px" }}>
                        Giỏ hàng của bạn hiện đang trống.
                    </p>
                    <Link to="/products" style={styles.primaryBtn}>
                        Tiếp tục mua sắm
                    </Link>
                </div>
            ) : (
                <div style={styles.contentWrapper}>
                    <div style={styles.tableWrapper}>
                        <table style={styles.table}>
                            <thead>
                                <tr style={styles.theadRow}>
                                    <th style={styles.th}>Sản phẩm</th>
                                    <th style={styles.th}>Đơn giá</th>
                                    <th style={styles.th}>Số lượng</th>
                                    <th style={styles.th}>Thành tiền</th>
                                    <th style={styles.th}>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartItems.map((item) => {
                                    const product = item.products || {};
                                    const unitPrice = Number(product.price || 0);
                                    const stock = Number(product.stock ?? 0);
                                    const isBusy = loadingItemId === item.cart_item_id;
                                    const currentDraft =
                                        draftQuantities[item.cart_item_id] ?? item.quantity;

                                    return (
                                        <tr key={item.cart_item_id} style={styles.tr}>
                                            <td style={styles.tdProduct}>
                                                <img
                                                    src={resolveImageUrl(product.image)}
                                                    alt={product.product_name}
                                                    style={styles.productImg}
                                                />
                                                <div>
                                                    <div style={styles.productName}>
                                                        {product.product_name || "Sản phẩm"}
                                                    </div>
                                                    <div style={styles.stockText}>
                                                        Tồn kho: <strong>{stock}</strong>
                                                    </div>
                                                </div>
                                            </td>

                                            <td style={styles.td}>{formatCurrency(unitPrice)}</td>

                                            <td style={styles.td}>
                                                <div style={styles.qtyControl}>
                                                    <button
                                                        type="button"
                                                        disabled={isBusy || item.quantity <= 1}
                                                        onClick={() =>
                                                            handleChangeQuantity(
                                                                item,
                                                                item.quantity - 1
                                                            )
                                                        }
                                                        style={styles.qtyBtn}
                                                    >
                                                        -
                                                    </button>
                                                    <input
                                                        type="number"
                                                        min={1}
                                                        max={stock}
                                                        disabled={isBusy}
                                                        value={currentDraft}
                                                        onChange={(e) =>
                                                            setDraftQuantities((prev) => ({
                                                                ...prev,
                                                                [item.cart_item_id]: e.target.value,
                                                            }))
                                                        }
                                                        onBlur={(e) =>
                                                            handleChangeQuantity(
                                                                item,
                                                                e.target.value
                                                            )
                                                        }
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter") {
                                                                e.target.blur();
                                                            }
                                                        }}
                                                        style={styles.qtyInput}
                                                    />
                                                    <button
                                                        type="button"
                                                        disabled={isBusy || item.quantity >= stock}
                                                        onClick={() =>
                                                            handleChangeQuantity(
                                                                item,
                                                                item.quantity + 1
                                                            )
                                                        }
                                                        style={styles.qtyBtn}
                                                        title={
                                                            item.quantity >= stock
                                                                ? "Đã đạt số lượng tối đa trong kho"
                                                                : ""
                                                        }
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </td>

                                            <td style={{ ...styles.td, fontWeight: "bold", color: "#d32f2f" }}>
                                                {formatCurrency(unitPrice * item.quantity)}
                                            </td>

                                            <td style={styles.td}>
                                                <button
                                                    type="button"
                                                    disabled={isBusy}
                                                    onClick={() => handleRemoveItem(item)}
                                                    style={styles.deleteBtn}
                                                >
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div style={styles.summaryBox}>
                        <div style={styles.summaryRow}>
                            <span>Tổng số lượng sản phẩm:</span>
                            <strong>{totalQuantity}</strong>
                        </div>
                        <div style={styles.summaryRow}>
                            <span style={{ fontSize: "18px" }}>Tổng tiền thanh toán:</span>
                            <strong style={styles.totalPrice}>
                                {formatCurrency(totalAmount)}
                            </strong>
                        </div>
                        <div style={styles.summaryActions}>
                            <Link to="/products" style={styles.secondaryBtn}>
                                ← Tiếp tục mua sắm
                            </Link>
                            <Link to="/order" style={styles.primaryBtn}>
                                Tiến hành đặt hàng
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        maxWidth: "1100px",
        margin: "24px auto",
        padding: "0 16px",
    },
    heading: {
        marginBottom: "18px",
        fontSize: "24px",
        color: "#222",
    },
    errorBanner: {
        backgroundColor: "#ffebee",
        color: "#c62828",
        border: "1px solid #ef9a9a",
        padding: "10px 14px",
        borderRadius: "6px",
        marginBottom: "14px",
    },
    successBanner: {
        backgroundColor: "#e8f5e9",
        color: "#2e7d32",
        border: "1px solid #a5d6a7",
        padding: "10px 14px",
        borderRadius: "6px",
        marginBottom: "14px",
    },
    emptyBox: {
        textAlign: "center",
        padding: "48px 20px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        border: "1px solid #e0e0e0",
    },
    contentWrapper: {
        display: "flex",
        flexDirection: "column",
        gap: "20px",
    },
    tableWrapper: {
        overflowX: "auto",
        backgroundColor: "#fff",
        borderRadius: "8px",
        border: "1px solid #e0e0e0",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
    },
    theadRow: {
        backgroundColor: "#f5f5f5",
        borderBottom: "1px solid #e0e0e0",
    },
    th: {
        padding: "12px 16px",
        textAlign: "left",
        fontWeight: "600",
        color: "#333",
    },
    tr: {
        borderBottom: "1px solid #eee",
    },
    td: {
        padding: "14px 16px",
        verticalAlign: "middle",
    },
    tdProduct: {
        padding: "14px 16px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
    },
    productImg: {
        width: "64px",
        height: "64px",
        objectFit: "cover",
        borderRadius: "6px",
        border: "1px solid #eee",
    },
    productName: {
        fontWeight: "600",
        color: "#222",
        marginBottom: "4px",
    },
    stockText: {
        fontSize: "13px",
        color: "#666",
    },
    qtyControl: {
        display: "inline-flex",
        alignItems: "center",
        border: "1px solid #ccc",
        borderRadius: "4px",
        overflow: "hidden",
    },
    qtyBtn: {
        width: "30px",
        height: "30px",
        border: "none",
        backgroundColor: "#f5f5f5",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "16px",
    },
    qtyInput: {
        width: "48px",
        height: "30px",
        border: "none",
        borderLeft: "1px solid #ccc",
        borderRight: "1px solid #ccc",
        textAlign: "center",
        fontSize: "14px",
    },
    deleteBtn: {
        backgroundColor: "#fff",
        color: "#e53935",
        border: "1px solid #e53935",
        borderRadius: "4px",
        padding: "6px 12px",
        cursor: "pointer",
        fontWeight: "500",
    },
    summaryBox: {
        alignSelf: "flex-end",
        width: "100%",
        maxWidth: "420px",
        backgroundColor: "#fff",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
    },
    summaryRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    totalPrice: {
        fontSize: "22px",
        color: "#d32f2f",
    },
    summaryActions: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "12px",
        marginTop: "8px",
    },
    primaryBtn: {
        display: "inline-block",
        backgroundColor: "#1976d2",
        color: "#fff",
        padding: "10px 18px",
        borderRadius: "6px",
        textDecoration: "none",
        border: "none",
        cursor: "pointer",
        fontWeight: "600",
    },
    secondaryBtn: {
        display: "inline-block",
        backgroundColor: "#f5f5f5",
        color: "#333",
        padding: "10px 14px",
        borderRadius: "6px",
        textDecoration: "none",
        border: "1px solid #ccc",
        fontWeight: "500",
    },
    headingRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "12px",
        flexWrap: "wrap",
    },

    deleteAllBtn: {
        backgroundColor: "#fff",
        color: "#e53935",
        border: "1px solid #e53935",
        borderRadius: "6px",
        padding: "9px 14px",
        cursor: "pointer",
        fontWeight: "600",
    },
};

export default CartPage;
