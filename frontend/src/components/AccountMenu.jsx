
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function getCurrentUser() {
    try {
        // Không có token nghĩa là đã đăng xuất
        const token = localStorage.getItem("token");

        if (!token) return null;

        const data = localStorage.getItem("user");

        if (!data) return null;

        const parsed = JSON.parse(data);

        return (
            parsed.user ||
            parsed.data?.user ||
            parsed.data ||
            parsed
        );
    } catch (error) {
        console.error("Lỗi đọc thông tin user:", error);
        return null;
    }
}

function AccountMenu() {
    const [user, setUser] = useState(getCurrentUser);

    useEffect(() => {
        const handleAuthChanged = () => {
            setUser(getCurrentUser());
        };

        const handleUserUpdated = (event) => {
            setUser(getCurrentUser());
        };

        window.addEventListener("authChanged", handleAuthChanged);
        window.addEventListener("userUpdated", handleUserUpdated);
        window.addEventListener("storage", handleAuthChanged);

        return () => {
            window.removeEventListener("authChanged", handleAuthChanged);
            window.removeEventListener("userUpdated", handleUserUpdated);
            window.removeEventListener("storage", handleAuthChanged);
        };
    }, []);

    // Chưa đăng nhập thì ẩn icon
    if (!user) return null;

    const role = String(user.role || "").trim().toLowerCase();

    // Admin không hiển thị
    if (role === "admin") return null;

    // Chỉ khách hàng mới hiển thị
    if (role !== "customer") return null;

    return (
        <Link
            to="/profile"
            className="account-menu"
            title="Hồ sơ cá nhân"
        >
            <span className="account-icon">👤</span>
            <span className="account-name">
                {user.name || "Khách hàng"}
            </span>
        </Link>
    );
}

export default AccountMenu;
