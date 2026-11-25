import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
    cancelOrderRequest,
    confirmReceivedOrderRequest,
    getMyOrdersRequest,
    submitReturnRequest,
} from "../services/myOrderService";

const STATUS_CONFIG = {
    pending: { label: "Chờ xác nhận", bg: "#fff8e1", color: "#f57c00", border: "#ffe082" },
    confirmed: { label: "Đã xác nhận", bg: "#e3f2fd", color: "#1565c0", border: "#90caf9" },
    shipping: { label: "Đang giao hàng", bg: "#e8eaf6", color: "#283593", border: "#9fa8da" },
    completed: { label: "Hoàn thành", bg: "#e8f5e9", color: "#2e7d32", border: "#a5d6a7" },
    return_requested: { label: "Yêu cầu trả hàng", bg: "#fff3e0", color: "#e65100", border: "#ffcc80" },
    returned: { label: "Đã trả hàng & Hoàn tiền", bg: "#f3e5f5", color: "#6a1b9a", border: "#ce93d8" },
    cancelled: { label: "Đã hủy", bg: "#ffebee", color: "#c62828", border: "#ef9a9a" },
};

function MyOrdersPage() {
    const { token } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState(null);
    const [confirmingId, setConfirmingId] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // State cho Modal Form trả hàng
    const [returnModalOrder, setReturnModalOrder] = useState(null);
    const [returnReason, setReturnReason] = useState("");
    const [returnFile, setReturnFile] = useState(null);
    const [submittingReturn, setSubmittingReturn] = useState(false);

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

    const handleConfirmReceived = async (orderId) => {
        if (!window.confirm(`Xác nhận bạn đã nhận đầy đủ hàng của đơn #${orderId}?`)) {
            return;
        }
        try {
            setConfirmingId(orderId);
            setErrorMessage("");
            setSuccessMessage("");
            const res = await confirmReceivedOrderRequest(token, orderId);
            setSuccessMessage(res.message || `Đã xác nhận nhận hàng cho đơn #${orderId}.`);
            await fetchOrders();
        } catch (err) {
            setErrorMessage(err.message || "Xác nhận nhận hàng thất bại.");
        } finally {
            setConfirmingId(null);
        }
    };

    const openReturnModal = (order) => {
        setReturnModalOrder(order);
        setReturnReason("");
        setReturnFile(null);
    };

    const closeReturnModal = () => {
        setReturnModalOrder(null);
        setReturnReason("");
        setReturnFile(null);
    };

    const handleSubmitReturn = async (e) => {
        e.preventDefault();
        if (!returnModalOrder) return;
        if (!returnReason.trim()) {
            alert("Vui lòng nhập lý do trả hàng.");
            return;
        }
        try {
            setSubmittingReturn(true);
            setErrorMessage("");
            setSuccessMessage("");
            const res = await submitReturnRequest(token, returnModalOrder.order_id, {
                reason: returnReason.trim(),
                evidenceFile: returnFile,
            });
            setSuccessMessage(res.message || "Đã gửi yêu cầu trả hàng thành công.");
            closeReturnModal();
            await fetchOrders();
        } catch (err) {
            alert(err.message || "Gửi yêu cầu trả hàng thất bại.");
        } finally {
            setSubmittingReturn(false);
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
                        const isShipping = order.status === "shipping";
                        const isCompleted = order.status === "completed";

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
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        {order.customer_confirmed && (
                                            <span style={styles.confirmedTag}>✓ Đã nhận hàng</span>
                                        )}
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
                                </div>

                                <div style={styles.cardBody}>
                                    <div style={styles.addressText}>
                                        Địa chỉ giao hàng: {order.shipping_address}
                                    </div>
                                    <div style={styles.itemPreviewList}>
                                        {items.map((item) => (
                                            <div key={item.order_items_id || item.order_item_id} style={styles.itemRow}>
                                                <span>
                                                    - {item.products?.product_name || "Sản phẩm"} x{" "}
                                                    <strong>{item.quantity}</strong>
                                                </span>
                                                <span>{formatCurrency(item.subtotal)}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {isShipping && (
                                        <div style={styles.shippingNotice}>
                                            🚚 Đơn hàng đang được vận chuyển (không thể hủy trong lúc đang giao).
                                        </div>
                                    )}

                                    {order.admin_return_note && (
                                        <div style={styles.adminNoteBox}>
                                            <strong>Phản hồi từ cửa hàng:</strong> {order.admin_return_note}
                                        </div>
                                    )}
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

                                        {isCompleted && !order.customer_confirmed && (
                                            <button
                                                type="button"
                                                disabled={confirmingId === order.order_id}
                                                onClick={() => handleConfirmReceived(order.order_id)}
                                                style={styles.confirmBtn}
                                            >
                                                {confirmingId === order.order_id
                                                    ? "Đang xác nhận..."
                                                    : "Đã nhận hàng"}
                                            </button>
                                        )}

                                        {isCompleted && (
                                            <button
                                                type="button"
                                                onClick={() => openReturnModal(order)}
                                                style={styles.returnBtn}
                                            >
                                                Yêu cầu trả hàng
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal Form yêu cầu trả hàng */}
            {returnModalOrder && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalBox}>
                        <h3 style={{ marginTop: 0, marginBottom: "12px" }}>
                            🔄 Yêu cầu trả hàng / Hoàn tiền - Đơn #{returnModalOrder.order_id}
                        </h3>
                        <form onSubmit={handleSubmitReturn}>
                            <div style={{ marginBottom: "12px" }}>
                                <label style={styles.label}>
                                    Lý do trả hàng <span style={{ color: "red" }}>*</span>
                                </label>
                                <textarea
                                    rows={4}
                                    required
                                    value={returnReason}
                                    onChange={(e) => setReturnReason(e.target.value)}
                                    placeholder="Mô tả chi tiết tình trạng lỗi, sai mẫu mã hoặc lý do hoàn trả..."
                                    style={styles.textarea}
                                />
                            </div>

                            <div style={{ marginBottom: "16px" }}>
                                <label style={styles.label}>
                                    Ảnh / Video bằng chứng (tối đa 10MB)
                                </label>
                                <input
                                    type="file"
                                    accept="image/*,video/*"
                                    onChange={(e) => setReturnFile(e.target.files?.[0] || null)}
                                    style={{ display: "block", marginTop: "6px" }}
                                />
                            </div>

                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                                <button
                                    type="button"
                                    onClick={closeReturnModal}
                                    disabled={submittingReturn}
                                    style={styles.secondaryBtn}
                                >
                                    Đóng
                                </button>
                                <button
                                    type="submit"
                                    disabled={submittingReturn}
                                    style={styles.primaryBtn}
                                >
                                    {submittingReturn ? "Đang gửi..." : "Gửi yêu cầu trả hàng"}
                                </button>
                            </div>
                        </form>
                    </div>
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
    confirmedTag: {
        backgroundColor: "#e0f2f1",
        color: "#00695c",
        border: "1px solid #80cbc4",
        padding: "4px 10px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: "600",
    },
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
    shippingNotice: {
        marginTop: "10px",
        fontSize: "13px",
        color: "#283593",
        backgroundColor: "#e8eaf6",
        padding: "8px 12px",
        borderRadius: "5px",
    },
    adminNoteBox: {
        marginTop: "10px",
        fontSize: "13px",
        color: "#4a148c",
        backgroundColor: "#f3e5f5",
        padding: "8px 12px",
        borderRadius: "5px",
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
    actions: { display: "flex", gap: "10px", flexWrap: "wrap" },
    primaryBtn: {
        display: "inline-block",
        backgroundColor: "#1976d2",
        color: "#fff",
        padding: "9px 16px",
        borderRadius: "6px",
        border: "none",
        cursor: "pointer",
        textDecoration: "none",
        fontWeight: "600",
        fontSize: "14px",
    },
    secondaryBtn: {
        backgroundColor: "#e0e0e0",
        color: "#333",
        padding: "9px 16px",
        borderRadius: "6px",
        border: "none",
        cursor: "pointer",
        fontWeight: "500",
        fontSize: "14px",
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
    confirmBtn: {
        backgroundColor: "#2e7d32",
        color: "#fff",
        border: "none",
        padding: "7px 14px",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "500",
    },
    returnBtn: {
        backgroundColor: "#fff",
        color: "#e65100",
        border: "1px solid #e65100",
        padding: "7px 14px",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "500",
    },
    modalOverlay: {
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "16px",
    },
    modalBox: {
        backgroundColor: "#fff",
        borderRadius: "8px",
        padding: "24px",
        width: "100%",
        maxWidth: "500px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    },
    label: {
        display: "block",
        fontWeight: "600",
        fontSize: "14px",
        marginBottom: "6px",
    },
    textarea: {
        width: "100%",
        padding: "10px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        fontSize: "14px",
        boxSizing: "border-box",
    },
};

export default MyOrdersPage;