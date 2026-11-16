
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

function Admin() {
    const { token } = useAuth();

    const [users, setUsers] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const [pagination, setPagination] = useState({
        currentPage: 1,
        limit: 10,
        totalUsers: 0,
        totalPages: 0,
    });

    const [status, setStatus] = useState("loading");
    const [message, setMessage] = useState("");

    // Lấy danh sách người dùng
    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Bạn chưa đăng nhập.");
            return;
        }

        let cancelled = false;

        const fetchUsers = async () => {
            try {
                setStatus("loading");
                setMessage("");

                const params = new URLSearchParams({
                    keyword: search,
                    page: String(page),
                });

                const response = await fetch(
                    `/api/admin/users?${params.toString()}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.message || "Không thể lấy danh sách người dùng."
                    );
                }

                if (!cancelled) {
                    setUsers(result.data || []);
                    setPagination(result.pagination);
                    setStatus("success");
                }
            } catch (error) {
                if (!cancelled) {
                    setStatus("error");
                    setMessage(error.message);
                }
            }
        };

        fetchUsers();

        return () => {
            cancelled = true;
        };
    }, [token, search, page]);

    // Tìm kiếm theo email
    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        setSearch(keyword.trim());
    };

    return (
        <section
            style={{
                width: "90%",
                maxWidth: 1200,
                margin: "32px auto",
            }}
        >
            <h1>Quản lý người dùng</h1>

            {/* Ô tìm kiếm */}
            <form
                onSubmit={handleSearch}
                style={{
                    display: "flex",
                    gap: 10,
                    margin: "24px 0",
                }}
            >
                <input
                    type="text"
                    placeholder="Nhập email người dùng..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    style={{
                        flex: 1,
                        padding: 10,
                        border: "1px solid #ccc",
                        borderRadius: 5,
                    }}
                />

                <button type="submit">
                    Tìm kiếm
                </button>
            </form>

            {/* Trạng thái */}
            {status === "loading" && (
                <p>Đang tải danh sách người dùng...</p>
            )}

            {status === "error" && (
                <p style={{ color: "red" }}>{message}</p>
            )}

            {/* Bảng người dùng */}
            {status === "success" && (
                <>
                    <div style={{ overflowX: "auto" }}>
                        <table
                            style={{
                                width: "100%",
                                borderCollapse: "collapse",
                            }}
                        >
                            <thead>
                                <tr style={{ background: "#eee" }}>
                                    <th style={cellStyle}>ID</th>
                                    <th style={cellStyle}>Họ tên</th>
                                    <th style={cellStyle}>Email</th>
                                    <th style={cellStyle}>Số điện thoại</th>
                                    <th style={cellStyle}>Vai trò</th>
                                </tr>
                            </thead>

                            <tbody>
                                {users.length > 0 ? (
                                    users.map((user) => (
                                        <tr key={user.user_id}>
                                            <td style={cellStyle}>
                                                {user.user_id}
                                            </td>
                                            <td style={cellStyle}>
                                                {user.name}
                                            </td>
                                            <td style={cellStyle}>
                                                {user.email}
                                            </td>
                                            <td style={cellStyle}>
                                                {user.phone || "Chưa cập nhật"}
                                            </td>
                                            <td style={cellStyle}>
                                                {user.role}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            style={cellStyle}
                                        >
                                            Không tìm thấy người dùng.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Thông tin phân trang */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: 20,
                            gap: 12,
                            flexWrap: "wrap",
                        }}
                    >
                        <p>
                            Tổng số: {pagination.totalUsers} người dùng
                        </p>

                        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                            <button
                                disabled={page <= 1}
                                onClick={() => setPage((prev) => prev - 1)}
                            >
                                Trước
                            </button>

                            <span>
                                Trang {pagination.currentPage} / {pagination.totalPages}
                            </span>

                            <button
                                disabled={page >= pagination.totalPages}
                                onClick={() => setPage((prev) => prev + 1)}
                            >
                                Sau
                            </button>
                        </div>
                    </div>
                </>
            )}
        </section>
    );
}

const cellStyle = {
    border: "1px solid #ddd",
    padding: 12,
    textAlign: "left",
};

export default Admin;
