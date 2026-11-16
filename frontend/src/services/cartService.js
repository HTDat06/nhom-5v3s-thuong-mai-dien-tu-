const API_BASE_URL = import.meta.env.VITE_API_URL || "";

export async function getCartRequest(token) {
    const response = await fetch(`${API_BASE_URL}/api/cart`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message || "Không thể tải giỏ hàng.");
    }
    return result;
}

export async function addToCartRequest(token, productId, qty = 1) {
    const response = await fetch(`${API_BASE_URL}/api/cart`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, qty }),
    });

    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message || "Không thể thêm sản phẩm vào giỏ hàng.");
    }
    return result;
}