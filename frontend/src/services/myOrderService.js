const API_BASE_URL = import.meta.env.VITE_API_URL || "";

export async function getMyOrdersRequest(token) {
    const response = await fetch(`${API_BASE_URL}/api/orders/my-orders`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    const result = await response.json();
    if (!response.ok) {
        const error = new Error(result.message || "Không thể tải danh sách đơn hàng.");
        error.status = response.status;
        throw error;
    }
    return result.data || [];
}

export async function getOrderDetailRequest(token, orderId) {
    const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    const result = await response.json();
    if (!response.ok) {
        const error = new Error(result.message || "Không thể tải chi tiết đơn hàng.");
        error.status = response.status;
        throw error;
    }
    return result.data;
}

export async function cancelOrderRequest(token, orderId) {
    const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/cancel`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    const result = await response.json();
    if (!response.ok) {
        const error = new Error(result.message || "Không thể hủy đơn hàng.");
        error.status = response.status;
        throw error;
    }
    return result;
}