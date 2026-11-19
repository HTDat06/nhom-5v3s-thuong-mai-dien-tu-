import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import AdminOrderManager from "../components/AdminOrderManager";

function Admin() {
    const { token } = useAuth();
    const [status, setStatus] = useState("loading");
    const [message, setMessage] = useState("");

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
                    setMessage(result.message);
                    setStatus("success");
                }
            })
            .catch((error) => {
                if (!cancelled) {
                    setMessage(error.message);
                    setStatus("error");
                }
            });

        return () => { cancelled = true; };
    }, [token]);

    return (
        <section style={{ width: "90%", maxWidth: 1200, margin: "32px auto" }}>
            <h1>Trang quản trị</h1>
            {status === "loading" && <p>Đang kiểm tra quyền truy cập...</p>}
            {status === "error" && <p style={{ color: "#c62828" }}>{message}</p>}
            {status === "success" && (
                <>
                    {message && <p style={{ color: "#2e7d32" }}>{message}</p>}
                    <AdminOrderManager />
                </>
            )}
        </section>
    );
}

export default Admin;