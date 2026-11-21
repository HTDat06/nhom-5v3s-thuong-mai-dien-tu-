
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/users";

const initialProfile = {
    name: "",
    email: "",
    phone: "",
    address: ""
};

const initialPassword = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
};

export default function ProfilePage() {
    const [formData, setFormData] = useState(initialProfile);
    const [passwordData, setPasswordData] = useState(initialPassword);
    const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });
    const [passMsg, setPassMsg] = useState({ type: "", text: "" });
    const [loading, setLoading] = useState(true);
    const [savingProfile, setSavingProfile] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);

    const getToken = () => localStorage.getItem("token");

    const getAuthConfig = () => ({
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = getToken();

            if (!token) {
                setStatusMsg({
                    type: "error",
                    text: "Bạn cần đăng nhập để xem hồ sơ."
                });
                return;
            }

            const res = await axios.get(
                `${API_URL}/profile`,
                getAuthConfig()
            );

            const userData = res.data.data || res.data.user || res.data;

            setFormData({
                name: userData.name || "",
                email: userData.email || "",
                phone: userData.phone || "",
                address: userData.address || ""
            });
        } catch (error) {
            setStatusMsg({
                type: "error",
                text: error.response?.data?.message ||
                    "Không thể tải thông tin hồ sơ."
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handlePasswordChange = (event) => {
        const { name, value } = event.target;

        setPasswordData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    // Cập nhật tên trong localStorage và thông báo cho Navbar
    const syncUserName = (newName) => {
        let savedUser = {};

        try {
            savedUser = JSON.parse(
                localStorage.getItem("user") || "{}"
            );
        } catch {
            savedUser = {};
        }

        const updatedUser = {
            ...savedUser,
            name: newName
        };

        localStorage.setItem("user", JSON.stringify(updatedUser));

        // Sự kiện này giúp Navbar cập nhật ngay trong cùng tab
        window.dispatchEvent(
            new CustomEvent("userUpdated", {
                detail: updatedUser
            })
        );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setStatusMsg({ type: "", text: "" });

        const newName = formData.name.trim();

        if (!newName) {
            setStatusMsg({
                type: "error",
                text: "Họ và tên không được để trống."
            });
            return;
        }

        try {
            setSavingProfile(true);

            const res = await axios.put(
                `${API_URL}/profile`,
                {
                    name: newName,
                    phone: formData.phone,
                    address: formData.address
                },
                getAuthConfig()
            );

            // Nếu backend trả về user mới thì lấy dữ liệu đó.
            const updatedData =
                res.data.data || res.data.user || {};

            const finalName = updatedData.name || newName;

            setFormData((previous) => ({
                ...previous,
                name: finalName,
                phone: updatedData.phone ?? previous.phone,
                address: updatedData.address ?? previous.address
            }));

            // Đồng bộ tên mới với Navbar
            syncUserName(finalName);

            setStatusMsg({
                type: "success",
                text: res.data.message || "Cập nhật hồ sơ thành công!"
            });
        } catch (error) {
            setStatusMsg({
                type: "error",
                text: error.response?.data?.message ||
                    "Cập nhật hồ sơ thất bại."
            });
        } finally {
            setSavingProfile(false);
        }
    };

    const handlePasswordSubmit = async (event) => {
        event.preventDefault();
        setPassMsg({ type: "", text: "" });

        const { oldPassword, newPassword, confirmPassword } = passwordData;

        if (newPassword.length < 8) {
            setPassMsg({
                type: "error",
                text: "Mật khẩu mới phải có ít nhất 8 ký tự."
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            setPassMsg({
                type: "error",
                text: "Mật khẩu nhập lại không khớp."
            });
            return;
        }

        if (oldPassword === newPassword) {
            setPassMsg({
                type: "error",
                text: "Mật khẩu mới phải khác mật khẩu cũ."
            });
            return;
        }

        try {
            setSavingPassword(true);

            const res = await axios.put(
                `${API_URL}/change-password`,
                {
                    oldPassword,
                    newPassword
                },
                getAuthConfig()
            );

            setPassMsg({
                type: "success",
                text: res.data.message || "Đổi mật khẩu thành công!"
            });

            setPasswordData(initialPassword);
        } catch (error) {
            setPassMsg({
                type: "error",
                text: error.response?.data?.message ||
                    "Đổi mật khẩu thất bại."
            });
        } finally {
            setSavingPassword(false);
        }
    };

    const inputStyle = {
        width: "100%",
        padding: "11px 14px",
        border: "1px solid #cbd5e1",
        borderRadius: "8px",
        fontSize: "14px",
        boxSizing: "border-box",
        marginTop: "6px",
        outline: "none"
    };

    const labelStyle = {
        fontSize: "14px",
        fontWeight: "600",
        color: "#334155",
        display: "block"
    };

    const messageStyle = (type) => ({
        padding: "12px 16px",
        borderRadius: "8px",
        marginBottom: "18px",
        fontSize: "14px",
        backgroundColor: type === "success" ? "#dcfce7" : "#fee2e2",
        color: type === "success" ? "#166534" : "#991b1b",
        border: `1px solid ${type === "success" ? "#bbf7d0" : "#fecaca"}`
    });

    if (loading) {
        return (
            <div style={{ textAlign: "center", padding: "80px" }}>
                Đang tải thông tin hồ sơ...
            </div>
        );
    }

    return (
        <div style={{
            backgroundColor: "#f8fafc",
            minHeight: "calc(100vh - 48px)",
            padding: "35px 16px"
        }}>
            <div style={{
                width: "100%",
                maxWidth: "600px",
                margin: "0 auto",
                backgroundColor: "#fff",
                borderRadius: "12px",
                padding: "30px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                boxSizing: "border-box"
            }}>
                <h2 style={{
                    margin: "0 0 8px",
                    fontSize: "24px",
                    color: "#0f172a"
                }}>
                    Hồ sơ cá nhân
                </h2>

                <p style={{
                    color: "#64748b",
                    fontSize: "14px",
                    marginBottom: "24px"
                }}>
                    Quản lý thông tin tài khoản và bảo mật của bạn
                </p>

                {statusMsg.text && (
                    <div style={messageStyle(statusMsg.type)}>
                        {statusMsg.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "18px"
                }}>
                    <div>
                        <label style={labelStyle}>Email đăng nhập</label>
                        <input
                            type="email"
                            value={formData.email}
                            disabled
                            style={{
                                ...inputStyle,
                                backgroundColor: "#f1f5f9",
                                color: "#64748b"
                            }}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Họ và tên *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Số điện thoại</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Nhập số điện thoại"
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Địa chỉ giao hàng</label>
                        <textarea
                            name="address"
                            rows="3"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Nhập địa chỉ nhận hàng"
                            style={{
                                ...inputStyle,
                                resize: "vertical",
                                fontFamily: "inherit"
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={savingProfile}
                        style={{
                            backgroundColor: "#2563eb",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            padding: "12px",
                            fontSize: "15px",
                            fontWeight: "600",
                            cursor: savingProfile ? "not-allowed" : "pointer"
                        }}
                    >
                        {savingProfile ? "Đang lưu..." : "Lưu thay đổi hồ sơ"}
                    </button>
                </form>

                <div style={{
                    marginTop: "36px",
                    borderTop: "1px solid #e2e8f0",
                    paddingTop: "24px"
                }}>
                    <h3 style={{
                        fontSize: "19px",
                        color: "#0f172a",
                        marginBottom: "8px"
                    }}>
                        Đổi mật khẩu
                    </h3>

                    <p style={{
                        fontSize: "13px",
                        color: "#64748b",
                        marginBottom: "18px"
                    }}>
                        Mật khẩu mới phải có ít nhất 8 ký tự.
                    </p>

                    {passMsg.text && (
                        <div style={messageStyle(passMsg.type)}>
                            {passMsg.text}
                        </div>
                    )}

                    <form onSubmit={handlePasswordSubmit} style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px"
                    }}>
                        <div>
                            <label style={labelStyle}>Mật khẩu cũ</label>
                            <input
                                type="password"
                                name="oldPassword"
                                value={passwordData.oldPassword}
                                onChange={handlePasswordChange}
                                required
                                style={inputStyle}
                                placeholder="Nhập mật khẩu hiện tại"
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>Mật khẩu mới</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                minLength={8}
                                required
                                style={inputStyle}
                                placeholder="Ít nhất 8 ký tự"
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>Nhập lại mật khẩu mới</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                minLength={8}
                                required
                                style={inputStyle}
                                placeholder="Nhập lại mật khẩu mới"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={savingPassword}
                            style={{
                                backgroundColor: "#0f172a",
                                color: "#fff",
                                border: "none",
                                borderRadius: "8px",
                                padding: "12px",
                                fontSize: "15px",
                                fontWeight: "600",
                                cursor: savingPassword ? "not-allowed" : "pointer"
                            }}
                        >
                            {savingPassword ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
