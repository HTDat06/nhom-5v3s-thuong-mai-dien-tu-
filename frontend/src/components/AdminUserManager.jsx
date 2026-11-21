
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

import {
    getAllUsersAdminRequest,
    lockUserAdminRequest,
    unlockUserAdminRequest
} from "../services/adminUserService";

function AdminUserManager() {
    const { token, user } = useAuth();

    const [users, setUsers] = useState([]);
    const [email, setEmail] = useState("");

    const [pagination, setPagination] = useState({
        currentPage: 1,
        pageSize: 10,
        totalItems: 0,
        totalPages: 0
    });

    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Lấy danh sách người dùng
    const fetchUsers = useCallback(async (searchEmail = "", page = 1) => {
        if (!token) {
            setUsers([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setErrorMessage("");

            const result = await getAllUsersAdminRequest(
                token,
                searchEmail,
                page
            );

            setUsers(
                Array.isArray(result.users) ? result.users : []
            );

            setPagination(result.pagination);
        } catch (error) {
            console.error("Get users error:", error);

            setUsers([]);
            setErrorMessage(
                error.message || "Không thể tải danh sách tài khoản."
            );
        } finally {
            setLoading(false);
        }
    }, [token]);

    // Tải dữ liệu lần đầu
    useEffect(() => {
        fetchUsers("", 1);
    }, [fetchUsers]);

    // Tìm kiếm
    const handleSearch = (e) => {
        e.preventDefault();
        fetchUsers(email.trim(), 1);
    };

    // Làm mới
    const handleReset = () => {
        setEmail("");
        setSuccessMessage("");
        fetchUsers("", 1);
    };

    // Kiểm tra tài khoản hiện tại
    const isCurrentUser = (targetUser) => {
        const currentUserId = user?.user_id ?? user?.id;

        return (
            currentUserId != null &&
            Number(targetUser.user_id) === Number(currentUserId)
        );
    };

    // Khóa / mở khóa
    const handleUpdateStatus = async (targetUser) => {
        const isLocked = targetUser.status === "LOCKED";
        const action = isLocked ? "mở khóa" : "khóa";

        if (!isLocked && isCurrentUser(targetUser)) {
            setErrorMessage(
                "Bạn không thể tự khóa tài khoản của mình."
            );
            return;
        }

        const confirmed = window.confirm(
            `Bạn có chắc chắn muốn ${action} tài khoản ${targetUser.email}?`
        );

        if (!confirmed) return;

        try {
            setUpdatingId(targetUser.user_id);
            setErrorMessage("");
            setSuccessMessage("");

            const result = isLocked
                ? await unlockUserAdminRequest(token, targetUser.user_id)
                : await lockUserAdminRequest(token, targetUser.user_id);

            setSuccessMessage(
                result.message || `${action} tài khoản thành công.`
            );

            await fetchUsers(email.trim(), pagination.currentPage);
        } catch (error) {
            console.error("Update status error:", error);

            setErrorMessage(
                error.message || `${action} tài khoản thất bại.`
            );
        } finally {
            setUpdatingId(null);
        }
    };

    // Trang trước
    const handlePreviousPage = () => {
        if (pagination.currentPage > 1) {
            fetchUsers(email.trim(), pagination.currentPage - 1);
        }
    };

    // Trang sau
    const handleNextPage = () => {
        if (pagination.currentPage < pagination.totalPages) {
            fetchUsers(email.trim(), pagination.currentPage + 1);
        }
    };

    // Chuyển trang trực tiếp
    const handleGoToPage = (page) => {
        if (
            page >= 1 &&
            page <= pagination.totalPages &&
            page !== pagination.currentPage
        ) {
            fetchUsers(email.trim(), page);
        }
    };

    // Danh sách số trang hiển thị
    const getPageNumbers = () => {
        const pages = [];
        const start = Math.max(1, pagination.currentPage - 2);
        const end = Math.min(
            pagination.totalPages,
            pagination.currentPage + 2
        );

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    };

    return (
        <section style={styles.wrapper}>
            {/* Tiêu đề */}
            <div style={styles.header}>
                <h2 style={styles.title}>
                    👥 Quản lý tài khoản
                </h2>

                <span style={styles.total}>
                    Tổng số: {pagination.totalItems} tài khoản
                </span>
            </div>

            {/* Tìm kiếm */}
            <form onSubmit={handleSearch} style={styles.searchForm}>
                <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập email cần tìm..."
                    style={styles.searchInput}
                />

                <button
                    type="submit"
                    style={styles.searchButton}
                    disabled={loading}
                >
                    Tìm kiếm
                </button>

                <button
                    type="button"
                    style={styles.resetButton}
                    onClick={handleReset}
                    disabled={loading}
                >
                    Làm mới
                </button>
            </form>

            {/* Thông báo lỗi */}
            {errorMessage && (
                <div style={styles.error}>
                    {errorMessage}
                </div>
            )}

            {/* Thông báo thành công */}
            {successMessage && (
                <div style={styles.success}>
                    {successMessage}
                </div>
            )}

            {/* Bảng dữ liệu */}
            {loading ? (
                <p style={styles.empty}>
                    Đang tải danh sách tài khoản...
                </p>
            ) : users.length === 0 ? (
                <p style={styles.empty}>
                    Không tìm thấy tài khoản nào.
                </p>
            ) : (
                <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>STT</th>
                                <th style={styles.th}>Họ tên</th>
                                <th style={styles.th}>Email</th>
                                <th style={styles.th}>Số điện thoại</th>
                                <th style={styles.th}>Vai trò</th>
                                <th style={styles.th}>Trạng thái</th>
                                <th style={styles.th}>Thao tác</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map((item, index) => {
                                const isLocked = item.status === "LOCKED";
                                const isUpdating =
                                    updatingId === item.user_id;

                                const isSelf = isCurrentUser(item);

                                const isAdmin =
                                    String(item.role).toLowerCase() === "admin";

                                const stt =
                                    (pagination.currentPage - 1) *
                                    pagination.pageSize + index + 1;

                                return (
                                    <tr key={item.user_id}>
                                        <td style={styles.td}>
                                            {stt}
                                        </td>

                                        <td style={styles.td}>
                                            {item.name}
                                        </td>

                                        <td style={styles.td}>
                                            {item.email}
                                        </td>

                                        <td style={styles.td}>
                                            {item.phone || "—"}
                                        </td>

                                        <td style={styles.td}>
                                            {isAdmin
                                                ? "Quản trị viên"
                                                : "Khách hàng"}
                                        </td>

                                        <td style={styles.td}>
                                            <span
                                                style={{
                                                    ...styles.badge,
                                                    backgroundColor: isLocked
                                                        ? "#ffebee"
                                                        : "#e8f5e9",
                                                    color: isLocked
                                                        ? "#c62828"
                                                        : "#2e7d32"
                                                }}
                                            >
                                                {isLocked
                                                    ? "Đã khóa"
                                                    : "Đang hoạt động"}
                                            </span>
                                        </td>

                                        <td style={styles.td}>
                                            {isAdmin ? (
                                                <span style={styles.note}>
                                                    Tài khoản quản trị
                                                </span>
                                            ) : (
                                                <button
                                                    type="button"
                                                    disabled={
                                                        isUpdating || isSelf
                                                    }
                                                    onClick={() =>
                                                        handleUpdateStatus(item)
                                                    }
                                                    style={{
                                                        ...styles.actionButton,
                                                        backgroundColor: isLocked
                                                            ? "#2e7d32"
                                                            : "#d32f2f",
                                                        opacity:
                                                            isUpdating || isSelf
                                                                ? 0.5
                                                                : 1,
                                                        cursor:
                                                            isUpdating || isSelf
                                                                ? "not-allowed"
                                                                : "pointer"
                                                    }}
                                                >
                                                    {isUpdating
                                                        ? "Đang xử lý..."
                                                        : isLocked
                                                            ? "Mở khóa"
                                                            : "Khóa tài khoản"}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Phân trang */}
            {!loading && pagination.totalPages > 0 && (
                <div style={styles.pagination}>
                    <div style={styles.paginationInfo}>
                        Hiển thị{" "}
                        {(pagination.currentPage - 1) *
                            pagination.pageSize + 1}
                        {" - "}
                        {Math.min(
                            pagination.currentPage * pagination.pageSize,
                            pagination.totalItems
                        )}
                        {" / "}
                        {pagination.totalItems} tài khoản
                    </div>

                    <div style={styles.paginationButtons}>
                        <button
                            type="button"
                            style={styles.pageButton}
                            disabled={pagination.currentPage === 1}
                            onClick={handlePreviousPage}
                        >
                            « Trước
                        </button>

                        {getPageNumbers().map((page) => (
                            <button
                                key={page}
                                type="button"
                                onClick={() => handleGoToPage(page)}
                                style={{
                                    ...styles.pageButton,
                                    ...(page === pagination.currentPage
                                        ? styles.activePage
                                        : {})
                                }}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            type="button"
                            style={styles.pageButton}
                            disabled={
                                pagination.currentPage >=
                                pagination.totalPages
                            }
                            onClick={handleNextPage}
                        >
                            Sau »
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}

const styles = {
    wrapper: {
        background: "#fff",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        padding: "20px",
        marginTop: "24px"
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "12px",
        marginBottom: "20px"
    },

    title: {
        margin: 0,
        fontSize: "20px",
        color: "#222"
    },

    total: {
        color: "#666",
        fontSize: "14px"
    },

    searchForm: {
        display: "flex",
        gap: "10px",
        marginBottom: "18px",
        flexWrap: "wrap"
    },

    searchInput: {
        flex: 1,
        minWidth: "200px",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "5px"
    },

    searchButton: {
        padding: "10px 18px",
        background: "#2563eb",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer"
    },

    resetButton: {
        padding: "10px 18px",
        background: "#e5e7eb",
        color: "#333",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer"
    },

    error: {
        padding: "10px",
        background: "#ffebee",
        color: "#c62828",
        borderRadius: "5px",
        marginBottom: "12px"
    },

    success: {
        padding: "10px",
        background: "#e8f5e9",
        color: "#2e7d32",
        borderRadius: "5px",
        marginBottom: "12px"
    },

    empty: {
        textAlign: "center",
        padding: "30px",
        color: "#666"
    },

    tableWrapper: {
        overflowX: "auto"
    },

    table: {
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "14px",
        textAlign: "left"
    },

    th: {
        padding: "12px",
        background: "#f8f9fa",
        borderBottom: "2px solid #ddd",
        whiteSpace: "nowrap"
    },

    td: {
        padding: "12px",
        borderBottom: "1px solid #eee"
    },

    badge: {
        display: "inline-block",
        padding: "5px 10px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "600",
        whiteSpace: "nowrap"
    },

    actionButton: {
        padding: "8px 12px",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        fontSize: "13px"
    },

    note: {
        color: "#888",
        fontSize: "12px"
    },

    pagination: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "12px",
        marginTop: "20px",
        paddingTop: "15px",
        borderTop: "1px solid #eee"
    },

    paginationInfo: {
        color: "#666",
        fontSize: "13px"
    },

    paginationButtons: {
        display: "flex",
        flexWrap: "wrap",
        gap: "5px"
    },

    pageButton: {
        padding: "7px 12px",
        border: "1px solid #ddd",
        background: "#fff",
        color: "#333",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "13px"
    },

    activePage: {
        background: "#2563eb",
        color: "#fff",
        borderColor: "#2563eb"
    }
};

export default AdminUserManager;
