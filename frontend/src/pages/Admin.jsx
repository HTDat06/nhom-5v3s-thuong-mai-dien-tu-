import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import AdminOrderManager from "../components/AdminOrderManager";
import AdminUserManager from "../components/AdminUserManager";
import AdminCategoryManager from "../components/AdminCategoryManager";
import AdminProductManager from "../components/AdminProductManager";
import AdminRevenueStats from "../components/AdminRevenueStats";
import "./Admin.css";

function Admin() {
    const { token } = useAuth();

    const [status, setStatus] = useState("loading");
    const [message, setMessage] = useState("");
    const [activeTab, setActiveTab] = useState("products");

    useEffect(() => {
        let cancelled = false;

        fetch("/api/admin", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(async (response) => {
                const result = await response.json();
                if (!response.ok) {
                    throw new Error(result.message || "Không có quyền truy cập.");
                }
                return result;
            })
            .then((result) => {
                if (!cancelled) {
                    setMessage(result.message || "");
                    setStatus("success");
                }
            })
            .catch((error) => {
                if (!cancelled) {
                    setMessage(error.message);
                    setStatus("error");
                }
            });

        return () => {
            cancelled = true;
        };
    }, [token]);

    if (status === "loading") {
        return <p className="admin-loading">Đang kiểm tra quyền truy cập...</p>;
    }

    if (status === "error") {
        return <p className="admin-error">{message}</p>;
    }

    const tabs = [
        { id: "products", label: "Quản lý sản phẩm" },
        { id: "categories", label: "Quản lý danh mục" },
        { id: "users", label: "Quản lý tài khoản" },
        { id: "orders", label: "Quản lý đơn hàng" },
        { id: "revenue", label: "Thống kê doanh thu" },
    ];

    return (
        <main className="admin-page">
            <h1>Trang quản trị</h1>

            {message && <p className="admin-success">{message}</p>}

            <nav className="admin-tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={activeTab === tab.id ? "active" : ""}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>

            {activeTab === "products" && <AdminProductManager />}
            {activeTab === "categories" && <AdminCategoryManager />}
            {activeTab === "users" && <AdminUserManager />}
            {activeTab === "orders" && <AdminOrderManager />}
            {activeTab === "revenue" && <AdminRevenueStats />}
        </main>
    );
}

export default Admin;