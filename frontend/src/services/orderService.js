
const API_BASE_URL = import.meta.env.VITE_API_URL || "";

export async function placeOrderRequest(token, orderData) {
    const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Đặt hàng thất bại.");
    }

    return result;
}
