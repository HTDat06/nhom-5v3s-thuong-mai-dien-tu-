import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { cancelOrderRequest, getMyOrdersRequest } from "../services/myOrderService";

const STATUS_CONFIG = {
    pending: { label: "Chờ xác nhận", bg: "#fff8e1", color: "#f57c00", border: "#ffe082" },
    confirmed: { label: "Đã xác nhận", bg: "#e3f2fd", color: "#1565c0", border: "#90caf9" },
    shipping: { label: "Đang giao hàng", bg: "#e8eaf6", color: "#283593", border: "#9fa8da" },
    completed: { label: "Hoàn thành", bg: "#e8f5e9", color: "#2e7d32", border: "#a5d6a7" },
    cancelled: { label: "Đã hủy", bg: "#ffebee", color: "#c62828", border: "#ef9a9a" },
};

function MyOrdersPage() {
    const { token } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const fetchOrders = useCallback(async () => {
        if (!token) {
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            setErrorMessage("");
            const data = await getMyOrdersRequest(token);
            setOrders(data);
        } catch (err) {
            setErrorMessage(err.message || "Không thể tải danh sách đơn hàng.");
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm(`Bạn có chắc chắn muốn hủy đơn hàng #${orderId} không?`)) {
            return;
        }
        try {
            setCancellingId(orderId);
            setErrorMessage("");
            setSuccessMessage("");
            const res = await cancelOrderRequest(token, orderId);
            setSuccessMessage(res.message || `Đã hủy đơn hàng #${orderId}.`);
            await fetchOrders();
        } catch (err) {
            setErrorMessage(err.message || "Hủy đơn hàng thất bại.");
        } finally {
            setCancellingId(null);
        }
    };

    const formatCurrency = (val) => Number(val || 0).toLocaleString("vi-VN") + " ₫";

    if (!token) {
        return (
            <div style={styles.container}>
                <div style={styles.emptyBox}>
                    <h2>Đơn hàng của tôi</h2>
                    <p>Vui lòng đăng nhập để xem lịch sử đặt hàng.</p>
                    <Link to="/login" style={styles.primaryBtn}>
                        Đăng nhập ngay
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>📦 Đơn hàng của tôi</h2>

            {errorMessage && <div style={styles.errorBanner}>{errorMessage}</div>}
            {successMessage && <div style={styles.successBanner}>{successMessage}</div>}

            {loading ? (
                <div style={styles.emptyBox}>Đang tải danh sách đơn hàng...</div>
            ) : orders.length === 0 ? (
                <div style={styles.emptyBox}>
                    <p style={{ marginBottom: "16px", color: "#555" }}>
                        Bạn chưa có đơn hàng nào.
                    </p>
                    <Link to="/products" style={styles.primaryBtn}>
                        Mua sắm ngay
                    </Link>
                </div>
            ) : (
                <div style={styles.orderList}>
                    {orders.map((order) => {
                        const statusInfo = STATUS_CONFIG[order.status] || {
                            label: order.status,
                            bg: "#f5f5f5",
                            color: "#333",
                            border: "#ddd",
                        };
                        const items = order.order_items || [];
                        const isPending = order.status === "pending";

                        return (
                            <div key={order.order_id} style={styles.orderCard}>
                                <div style={styles.cardHeader}>
                                    <div>
                                        <strong>Mã đơn hàng: #{order.order_id}</strong>
                                        <span style={styles.receiverInfo}>
                                            {" "}
                                            | Người nhận: {order.receiver_name} ({order.phone})
                                        </span>
                                    </div>
                                    <span
                                        style={{
                                            ...styles.statusBadge,
                                            backgroundColor: statusInfo.bg,
                                            color: statusInfo.color,
                                            border: `1px solid ${statusInfo.border}`,
                                        }}
                                    >
                                        {statusInfo.label}
                                    </span>
                                </div>

                                <div style={styles.cardBody}>
                                    <div style={styles.addressText}>
                                        Địa chỉ giao hàng: {order.shipping_address}
                                    </div>
                                    <div style={styles.itemPreviewList}>
                                        {items.map((item) => (
                                            <div key={item.order_item_id} style={styles.itemRow}>
                                                <span>
                                                    • {item.products?.product_name || "Sản phẩm"} x{" "}
                                                    <strong>{item.quantity}</strong>
                                                </span>
                                                <span>{formatCurrency(item.subtotal)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div style={styles.cardFooter}>
                                    <div>
                                        Tổng tiền:{" "}
                                        <strong style={styles.totalPrice}>
                                            {formatCurrency(order.total_amount)}
                                        </strong>
                                    </div>
                                    <div style={styles.actions}>
                                        <Link
                                            to={`/my-orders/${order.order_id}`}
                                            style={styles.detailBtn}
                                        >
                                            Xem chi tiết
                                        </Link>
                                        {isPending && (
                                            <button
                                                type="button"
                                                disabled={cancellingId === order.order_id}
                                                onClick={() => handleCancelOrder(order.order_id)}
                                                style={styles.cancelBtn}
                                            >
                                                {cancellingId === order.order_id
                                                    ? "Đang hủy..."
                                                    : "Hủy đơn hàng"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

const styles = {
    container: { maxWidth: "1000px", margin: "24px auto", padding: "0 16px" },
    heading: { fontSize: "24px", marginBottom: "18px", color: "#222" },
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
    orderList: { display: "flex", flexDirection: "column", gap: "16px" },
    orderCard: {
        backgroundColor: "#fff",
        borderRadius: "8px",
        border: "1px solid #e0e0e0",
        overflow: "hidden",
    },
    cardHeader: {
        padding: "12px 16px",
        backgroundColor: "#f8f9fa",
        borderBottom: "1px solid #eee",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "8px",
    },
    receiverInfo: { color: "#555", fontSize: "14px" },
    statusBadge: {
        padding: "4px 10px",
        borderRadius: "999px",
        fontSize: "13px",
        fontWeight: "600",
    },
    cardBody: { padding: "14px 16px" },
    addressText: { fontSize: "14px", color: "#555", marginBottom: "10px" },
    itemPreviewList: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        borderTop: "1px dashed #eee",
        paddingTop: "10px",
    },
    itemRow: {
        display: "flex",
        justifyContent: "space-between",
        fontSize: "14px",
        color: "#333",
    },
    cardFooter: {
        padding: "12px 16px",
        borderTop: "1px solid #eee",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "12px",
    },
    totalPrice: { fontSize: "18px", color: "#d32f2f" },
    actions: { display: "flex", gap: "10px" },
    primaryBtn: {
        display: "inline-block",
        backgroundColor: "#1976d2",
        color: "#fff",
        padding: "10px 18px",
        borderRadius: "6px",
        textDecoration: "none",
        fontWeight: "600",
    },
    detailBtn: {
        display: "inline-block",
        backgroundColor: "#1976d2",
        color: "#fff",
        padding: "7px 14px",
        borderRadius: "5px",
        textDecoration: "none",
        fontSize: "14px",
        fontWeight: "500",
    },
    cancelBtn: {
        backgroundColor: "#fff",
        color: "#d32f2f",
        border: "1px solid #d32f2f",
        padding: "7px 14px",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "500",
    },
};

export default MyOrdersPage;