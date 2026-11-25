const API_BASE_URL = import.meta.env.VITE_API_URL || "";

export async function getAllOrdersAdminRequest(token, status = "all") {
    const query = status && status !== "all" ? `?status=${encodeURIComponent(status)}` : "";
    const response = await fetch(`${API_BASE_URL}/api/orders${query}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message || "Không thể tải danh sách đơn hàng.");
    }
    return result.data || [];
}

export async function updateOrderStatusAdminRequest(token, orderId, status) {
    const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
    });

    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message || "Không thể cập nhật trạng thái đơn hàng.");
    }
    return result;
}

export async function reviewReturnRequestAdmin(token, orderId, { action, adminNote }) {
    const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/review-return`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action, admin_note: adminNote }),
    });

    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message || "Không thể xét duyệt yêu cầu trả hàng.");
    }
    return result;
}