
const API_BASE_URL = import.meta.env.VITE_API_URL || "";

// Lấy danh sách tài khoản, tìm kiếm và phân trang
export async function getAllUsersAdminRequest(
    token,
    email = "",
    page = 1
) {
    const params = new URLSearchParams();

    if (email.trim()) {
        params.append("keyword", email.trim());
    }

    params.append("page", page);

    const response = await fetch(
        `${API_BASE_URL}/api/users/admin?${params.toString()}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || "Không thể tải danh sách tài khoản."
        );
    }

    return {
        users: Array.isArray(result.data) ? result.data : [],
        pagination: result.pagination || {
            currentPage: 1,
            pageSize: 10,
            totalItems: 0,
            totalPages: 0
        }
    };
}

// Khóa tài khoản
export async function lockUserAdminRequest(token, userId) {
    const response = await fetch(
        `${API_BASE_URL}/api/users/admin/${userId}/lock`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || "Khóa tài khoản thất bại."
        );
    }

    return result;
}

// Mở khóa tài khoản
export async function unlockUserAdminRequest(token, userId) {
    const response = await fetch(
        `${API_BASE_URL}/api/users/admin/${userId}/unlock`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || "Mở khóa tài khoản thất bại."
        );
    }

    return result;
}
