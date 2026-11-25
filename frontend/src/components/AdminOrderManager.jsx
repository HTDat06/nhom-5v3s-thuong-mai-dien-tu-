import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
    getAllOrdersAdminRequest,
    reviewReturnRequestAdmin,
    updateOrderStatusAdminRequest,
} from "../services/adminOrderService";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const STATUS_META = {
    pending: { label: "Chờ xác nhận", bg: "#fff8e1", color: "#f57c00", border: "#ffe082" },
    shipping: { label: "Đang giao", bg: "#e3f2fd", color: "#1565c0", border: "#90caf9" },
    completed: { label: "Hoàn thành", bg: "#e8f5e9", color: "#2e7d32", border: "#a5d6a7" },
    return_requested: { label: "Yêu cầu trả hàng", bg: "#fff3e0", color: "#e65100", border: "#ffcc80" },
    returned: { label: "Đã trả hàng & Hoàn tiền", bg: "#f3e5f5", color: "#6a1b9a", border: "#ce93d8" },
    cancelled: { label: "Đã hủy", bg: "#ffebee", color: "#c62828", border: "#ef9a9a" },
};

const FILTER_TABS = [
    { key: "all", label: "Tất cả đơn" },
    { key: "pending", label: "Chờ xác nhận" },
    { key: "shipping", label: "Đang giao" },
    { key: "completed", label: "Hoàn thành" },
    { key: "return_requested", label: "Yêu cầu trả hàng" },
    { key: "returned", label: "Đã hoàn tiền" },
    { key: "cancelled", label: "Đã hủy" },
];

const resolveEvidenceUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};

function AdminOrderManager() {
    const { token } = useAuth();
    const [orders, setOrders] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // State cho Modal xét duyệt trả hàng của Admin
    const [reviewOrder, setReviewOrder] = useState(null);
    const [adminNote, setAdminNote] = useState("");
    const [reviewing, setReviewing] = useState(false);

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

    const handleReviewReturn = async (action) => {
        if (!reviewOrder) return;
        const confirmText =
            action === "approve"
                ? `Xác nhận thu hồi hàng, hoàn tiền và cộng lại tồn kho cho đơn #${reviewOrder.order_id}?`
                : `Xác nhận từ chối yêu cầu trả hàng của đơn #${reviewOrder.order_id}?`;

        if (!window.confirm(confirmText)) return;

        try {
            setReviewing(true);
            setErrorMessage("");
            setSuccessMessage("");
            const res = await reviewReturnRequestAdmin(token, reviewOrder.order_id, {
                action,
                adminNote,
            });
            setSuccessMessage(res.message || "Đã xử lý yêu cầu trả hàng.");
            setReviewOrder(null);
            setAdminNote("");
            await fetchOrders();
        } catch (err) {
            alert(err.message || "Xử lý yêu cầu trả hàng thất bại.");
        } finally {
            setReviewing(false);
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
                                            {order.customer_confirmed && (
                                                <div style={styles.confirmedText}>
                                                    ✓ Khách đã xác nhận nhận hàng
                                                </div>
                                            )}
                                        </td>
                                        <td style={styles.td}>
                                            {(order.order_items || []).map((item, idx) => (
                                                <div
                                                    key={
                                                        item.order_items_id ??
                                                        item.order_item_id ??
                                                        `${order.order_id}-${item.product_id}-${idx}`
                                                    }
                                                    style={{ fontSize: "13px" }}
                                                >
                                                    - {item.products?.product_name} x{item.quantity}
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
                                                            Giao hàng
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
                                                            Hủy đơn
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
                                                        Xác nhận hoàn thành
                                                    </button>
                                                )}

                                                {order.status === "return_requested" && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setReviewOrder(order);
                                                            setAdminNote("");
                                                        }}
                                                        style={styles.reviewBtn}
                                                    >
                                                        Xem & Duyệt trả hàng
                                                    </button>
                                                )}

                                                {["completed", "returned", "cancelled"].includes(
                                                    order.status
                                                ) && (
                                                    <span style={{ fontSize: "13px", color: "#777" }}>
                                                        Đã chốt trạng thái
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

            {/* Modal xét duyệt yêu cầu trả hàng */}
            {reviewOrder && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalBox}>
                        <h3 style={{ marginTop: 0, marginBottom: "12px" }}>
                            🔍 Xét duyệt yêu cầu trả hàng - Đơn #{reviewOrder.order_id}
                        </h3>

                        <div style={styles.evidenceCard}>
                            <p style={{ margin: "0 0 8px 0" }}>
                                <strong>Khách hàng:</strong> {reviewOrder.receiver_name} ({reviewOrder.phone})
                            </p>
                            <p style={{ margin: "0 0 8px 0" }}>
                                <strong>Tổng tiền hoàn dự kiến:</strong>{" "}
                                <span style={{ color: "#d32f2f", fontWeight: "700" }}>
                                    {formatCurrency(reviewOrder.total_amount)}
                                </span>
                            </p>
                            <p style={{ margin: "0 0 8px 0" }}>
                                <strong>Lý do khách trình bày:</strong>{" "}
                                {reviewOrder.return_reason || "Không có"}
                            </p>

                            {reviewOrder.return_evidence ? (
                                <div style={{ marginTop: "10px" }}>
                                    <strong>Bằng chứng đính kèm:</strong>
                                    <div style={{ marginTop: "6px" }}>
                                        {/\.(mp4|webm|ogg)$/i.test(reviewOrder.return_evidence) ? (
                                            <video
                                                src={resolveEvidenceUrl(reviewOrder.return_evidence)}
                                                controls
                                                style={{ maxWidth: "100%", maxHeight: "220px", borderRadius: "6px" }}
                                            />
                                        ) : (
                                            <a
                                                href={resolveEvidenceUrl(reviewOrder.return_evidence)}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                <img
                                                    src={resolveEvidenceUrl(reviewOrder.return_evidence)}
                                                    alt="Bằng chứng trả hàng"
                                                    style={{
                                                        maxWidth: "100%",
                                                        maxHeight: "220px",
                                                        borderRadius: "6px",
                                                        border: "1px solid #ddd",
                                                    }}
                                                />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <p style={{ color: "#777", fontStyle: "italic", margin: 0 }}>
                                    Khách hàng không đính kèm ảnh/video bằng chứng.
                                </p>
                            )}
                        </div>

                        <div style={{ marginBottom: "16px" }}>
                            <label style={{ display: "block", fontWeight: "600", marginBottom: "6px" }}>
                                Ghi chú phản hồi của Admin (tùy chọn)
                            </label>
                            <textarea
                                rows={3}
                                value={adminNote}
                                onChange={(e) => setAdminNote(e.target.value)}
                                placeholder="Nhập ghi chú xác nhận hoàn tiền hoặc lý do từ chối..."
                                style={styles.textarea}
                            />
                        </div>

                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", flexWrap: "wrap" }}>
                            <button
                                type="button"
                                disabled={reviewing}
                                onClick={() => setReviewOrder(null)}
                                style={styles.secondaryBtn}
                            >
                                Đóng
                            </button>
                            <button
                                type="button"
                                disabled={reviewing}
                                onClick={() => handleReviewReturn("reject")}
                                style={styles.rejectBtn}
                            >
                                Từ chối trả hàng
                            </button>
                            <button
                                type="button"
                                disabled={reviewing}
                                onClick={() => handleReviewReturn("approve")}
                                style={styles.approveBtn}
                            >
                                {reviewing ? "Đang xử lý..." : "Xác nhận thu hồi & Hoàn tiền"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    wrapper: { padding: "16px" },
    headerRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "12px",
        marginBottom: "16px",
    },
    title: { margin: 0, fontSize: "22px" },
    filterGroup: { display: "flex", gap: "8px", flexWrap: "wrap" },
    filterBtn: {
        padding: "7px 13px",
        borderRadius: "6px",
        border: "none",
        cursor: "pointer",
        fontSize: "13px",
    },
    errorBanner: {
        backgroundColor: "#ffebee",
        color: "#c62828",
        border: "1px solid #ef9a9a",
        padding: "10px 14px",
        borderRadius: "6px",
        marginBottom: "12px",
    },
    successBanner: {
        backgroundColor: "#e8f5e9",
        color: "#2e7d32",
        border: "1px solid #a5d6a7",
        padding: "10px 14px",
        borderRadius: "6px",
        marginBottom: "12px",
    },
    emptyBox: {
        backgroundColor: "#fff",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        padding: "36px",
        textAlign: "center",
        color: "#666",
    },
    tableWrapper: {
        overflowX: "auto",
        backgroundColor: "#fff",
        borderRadius: "8px",
        border: "1px solid #e0e0e0",
    },
    table: { width: "100%", borderCollapse: "collapse" },
    theadRow: { backgroundColor: "#f8f9fa", borderBottom: "1px solid #ddd" },
    th: { padding: "12px", textAlign: "left", fontSize: "14px" },
    tr: { borderBottom: "1px solid #eee" },
    td: { padding: "12px", verticalAlign: "top", fontSize: "14px" },
    subText: { fontSize: "12px", color: "#666", marginTop: "3px" },
    confirmedText: { fontSize: "12px", color: "#00695c", fontWeight: "600", marginTop: "4px" },
    badge: {
        display: "inline-block",
        padding: "4px 10px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: "600",
    },
    actionGroup: { display: "flex", gap: "8px", flexWrap: "wrap" },
    shipBtn: {
        backgroundColor: "#1565c0",
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
        color: "#c62828",
        border: "1px solid #c62828",
        padding: "6px 12px",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "13px",
    },
    reviewBtn: {
        backgroundColor: "#e65100",
        color: "#fff",
        border: "none",
        padding: "6px 12px",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: "600",
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
        maxWidth: "560px",
        maxHeight: "90vh",
        overflowY: "auto",
    },
    evidenceCard: {
        backgroundColor: "#f8f9fa",
        border: "1px solid #e0e0e0",
        borderRadius: "6px",
        padding: "12px 14px",
        marginBottom: "14px",
        fontSize: "14px",
    },
    textarea: {
        width: "100%",
        padding: "10px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        fontSize: "14px",
        boxSizing: "border-box",
    },
    secondaryBtn: {
        backgroundColor: "#e0e0e0",
        color: "#333",
        border: "none",
        padding: "9px 14px",
        borderRadius: "6px",
        cursor: "pointer",
    },
    rejectBtn: {
        backgroundColor: "#c62828",
        color: "#fff",
        border: "none",
        padding: "9px 14px",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "600",
    },
    approveBtn: {
        backgroundColor: "#2e7d32",
        color: "#fff",
        border: "none",
        padding: "9px 14px",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "600",
    },
};

export default AdminOrderManager;