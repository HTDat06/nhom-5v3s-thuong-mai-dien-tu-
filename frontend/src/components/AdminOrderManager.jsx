import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
    getAllOrdersAdminRequest,
    updateOrderStatusAdminRequest,
} from "../services/adminOrderService";

const STATUS_META = {
    pending: { label: "Chờ xác nhận", bg: "#fff8e1", color: "#f57c00", border: "#ffe082" },
    shipping: { label: "Đang giao", bg: "#e3f2fd", color: "#1565c0", border: "#90caf9" },
    completed: { label: "Hoàn thành", bg: "#e8f5e9", color: "#2e7d32", border: "#a5d6a7" },
    cancelled: { label: "Đã hủy", bg: "#ffebee", color: "#c62828", border: "#ef9a9a" },
};

const FILTER_TABS = [
    { key: "all", label: "Tất cả đơn" },
    { key: "pending", label: "Chờ xác nhận" },
    { key: "shipping", label: "Đang giao" },
    { key: "completed", label: "Hoàn thành" },
    { key: "cancelled", label: "Đã hủy" },
];

function AdminOrderManager() {
    const { token } = useAuth();
    const [orders, setOrders] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const fetchOrders = useCallback(async () => {
        if (!token) return;
        try {
            setLoading(true);
            setErrorMessage("");
            const data = await getAllOrdersAdminRequest(token, selectedStatus);
            setOrders(data);
        } catch (err) {
            setErrorMessage(err.message || "Lỗi tải danh sách đơn hàng.");
        } finally {
            setLoading(false);
        }
    }, [token, selectedStatus]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleChangeStatus = async (orderId, nextStatus, labelAction) => {
        if (!window.confirm(`Xác nhận chuyển đơn #${orderId} sang "${labelAction}"?`)) {
            return;
        }
        try {
            setUpdatingId(orderId);
            setErrorMessage("");
            setSuccessMessage("");
            const res = await updateOrderStatusAdminRequest(token, orderId, nextStatus);
            setSuccessMessage(res.message || `Đã cập nhật đơn #${orderId}.`);
            await fetchOrders();
        } catch (err) {
            setErrorMessage(err.message || "Cập nhật trạng thái thất bại.");
        } finally {
            setUpdatingId(null);
        }
    };

    const formatCurrency = (val) => Number(val || 0).toLocaleString("vi-VN") + " ₫";

    return (
        <div style={styles.wrapper}>
            <div style={styles.headerRow}>
                <h2 style={styles.title}>📋 Quản lý đơn hàng</h2>
                <div style={styles.filterGroup}>
                    {FILTER_TABS.map((tab) => {
                        const active = selectedStatus === tab.key;
                        return (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => setSelectedStatus(tab.key)}
                                style={{
                                    ...styles.filterBtn,
                                    backgroundColor: active ? "#1976d2" : "#f1f3f4",
                                    color: active ? "#fff" : "#333",
                                    fontWeight: active ? "600" : "400",
                                }}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {errorMessage && <div style={styles.errorBanner}>{errorMessage}</div>}
            {successMessage && <div style={styles.successBanner}>{successMessage}</div>}

            {loading ? (
                <div style={styles.emptyBox}>Đang tải danh sách đơn hàng...</div>
            ) : orders.length === 0 ? (
                <div style={styles.emptyBox}>Không có đơn hàng nào ở trạng thái này.</div>
            ) : (
                <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.theadRow}>
                                <th style={styles.th}>Mã đơn</th>
                                <th style={styles.th}>Khách hàng & Nhận hàng</th>
                                <th style={styles.th}>Sản phẩm</th>
                                <th style={styles.th}>Tổng tiền</th>
                                <th style={styles.th}>Trạng thái</th>
                                <th style={styles.th}>Thao tác chuyển trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => {
                                const meta = STATUS_META[order.status] || {
                                    label: order.status,
                                    bg: "#eee",
                                    color: "#333",
                                    border: "#ccc",
                                };
                                const isUpdating = updatingId === order.order_id;

                                return (
                                    <tr key={order.order_id} style={styles.tr}>
                                        <td style={styles.td}>
                                            <strong>#{order.order_id}</strong>
                                        </td>
                                        <td style={styles.td}>
                                            <div>
                                                <strong>{order.receiver_name}</strong> ({order.phone})
                                            </div>
                                            <div style={styles.subText}>{order.shipping_address}</div>
                                            {order.users?.email && (
                                                <div style={styles.subText}>
                                                    TK: {order.users.email}
                                                </div>
                                            )}
                                        </td>
                                        <td style={styles.td}>
                                            {(order.order_items || []).map((item, idx) => (
                                                <div
                                                    key={
                                                        item.order_item_id ??
                                                        item.item_id ??
                                                        item.id ??
                                                        `${order.order_id}-${item.product_id}-${idx}`
                                                    }
                                                    style={{ fontSize: "13px" }}
                                                >
                                                    • {item.products?.product_name} x{item.quantity}
                                                </div>
                                            ))}
                                        </td>
                                        <td style={{ ...styles.td, fontWeight: "600", color: "#d32f2f" }}>
                                            {formatCurrency(order.total_amount)}
                                        </td>
                                        <td style={styles.td}>
                                            <span
                                                style={{
                                                    ...styles.badge,
                                                    backgroundColor: meta.bg,
                                                    color: meta.color,
                                                    border: `1px solid ${meta.border}`,
                                                }}
                                            >
                                                {meta.label}
                                            </span>
                                        </td>
                                        <td style={styles.td}>
                                            <div style={styles.actionGroup}>
                                                {order.status === "pending" && (
                                                    <>
                                                        <button
                                                            type="button"
                                                            disabled={isUpdating}
                                                            onClick={() =>
                                                                handleChangeStatus(
                                                                    order.order_id,
                                                                    "shipping",
                                                                    "Đang giao"
                                                                )
                                                            }
                                                            style={styles.shipBtn}
                                                        >
                                                            🚚 Giao hàng
                                                        </button>
                                                        <button
                                                            type="button"
                                                            disabled={isUpdating}
                                                            onClick={() =>
                                                                handleChangeStatus(
                                                                    order.order_id,
                                                                    "cancelled",
                                                                    "Đã hủy"
                                                                )
                                                            }
                                                            style={styles.cancelBtn}
                                                        >
                                                            ✖ Hủy đơn
                                                        </button>
                                                    </>
                                                )}

                                                {order.status === "shipping" && (
                                                    <button
                                                        type="button"
                                                        disabled={isUpdating}
                                                        onClick={() =>
                                                            handleChangeStatus(
                                                                order.order_id,
                                                                "completed",
                                                                "Hoàn thành"
                                                            )
                                                        }
                                                        style={styles.completeBtn}
                                                    >
                                                        ✔ Hoàn thành
                                                    </button>
                                                )}

                                                {(order.status === "completed" ||
                                                    order.status === "cancelled") && (
                                                    <span style={styles.lockedText}>
                                                        🔒 Đã khóa trạng thái
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

const styles = {
    wrapper: {
        backgroundColor: "#fff",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        padding: "20px",
        marginTop: "24px",
    },
    headerRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "12px",
        marginBottom: "16px",
    },
    title: { margin: 0, fontSize: "20px", color: "#222" },
    filterGroup: { display: "flex", gap: "8px", flexWrap: "wrap" },
    filterBtn: {
        border: "none",
        padding: "7px 14px",
        borderRadius: "20px",
        cursor: "pointer",
        fontSize: "13px",
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
    emptyBox: { textAlign: "center", padding: "32px", color: "#666" },
    tableWrapper: { overflowX: "auto" },
    table: { width: "100%", borderCollapse: "collapse", fontSize: "14px" },
    theadRow: { backgroundColor: "#f8f9fa", borderBottom: "2px solid #dee2e6" },
    th: { padding: "10px 12px", textAlign: "left", whiteSpace: "nowrap" },
    tr: { borderBottom: "1px solid #eee" },
    td: { padding: "12px", verticalAlign: "top" },
    subText: { fontSize: "12px", color: "#666", marginTop: "2px" },
    badge: {
        display: "inline-block",
        padding: "4px 10px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: "600",
        whiteSpace: "nowrap",
    },
    actionGroup: { display: "flex", gap: "8px", flexWrap: "wrap" },
    shipBtn: {
        backgroundColor: "#1976d2",
        color: "#fff",
        border: "none",
        padding: "6px 12px",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "13px",
    },
    completeBtn: {
        backgroundColor: "#2e7d32",
        color: "#fff",
        border: "none",
        padding: "6px 12px",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "13px",
    },
    cancelBtn: {
        backgroundColor: "#fff",
        color: "#d32f2f",
        border: "1px solid #d32f2f",
        padding: "6px 12px",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "13px",
    },
    lockedText: { fontSize: "12px", color: "#888", fontStyle: "italic" },
};

export default AdminOrderManager;