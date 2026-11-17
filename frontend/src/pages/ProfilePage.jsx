import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ProfilePage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });

    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: ''
    });

    const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
    const [passMsg, setPassMsg] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/users/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const userData = res.data.data || res.data;
            setFormData({
                name: userData.name || '',
                email: userData.email || '',
                phone: userData.phone || '',
                address: userData.address || ''
            });
        } catch (err) {
            setStatusMsg({ type: 'error', text: 'Không thể tải thông tin hồ sơ.' });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatusMsg({ type: '', text: '' });
        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:5000/api/users/profile', {
                name: formData.name,
                phone: formData.phone
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setStatusMsg({ type: 'success', text: 'Cập nhật hồ sơ thành công!' });

            // Cập nhật tên mới vào localStorage để đồng bộ với Navbar
            const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
            savedUser.name = formData.name;
            localStorage.setItem('user', JSON.stringify(savedUser));

            // Làm mới trang sau 1 giây để Navbar hiển thị tên mới
            setTimeout(() => {
                window.location.reload();
            }, 1000);

        } catch (err) {
            setStatusMsg({ type: 'error', text: err.response?.data?.message || 'Cập nhật thất bại.' });
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPassMsg({ type: '', text: '' });
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put('http://localhost:5000/api/users/change-password', {
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setPassMsg({ type: 'success', text: res.data.message || 'Đổi mật khẩu thành công!' });
            setPasswordData({ oldPassword: '', newPassword: '' });
        } catch (err) {
            setPassMsg({ type: 'error', text: err.response?.data?.message || 'Đổi mật khẩu thất bại.' });
        }
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '80px', fontSize: '16px', color: '#475569' }}>Đang tải thông tin...</div>;
    }

    const inputStyle = {
        width: '100%',
        padding: '10px 14px',
        border: '1px solid #cbd5e1',
        borderRadius: '8px',
        fontSize: '14px',
        boxSizing: 'border-box',
        marginTop: '6px',
        outline: 'none'
    };

    return (
        <div style={{ 
            backgroundColor: '#f8fafc', 
            minHeight: 'calc(100vh - 48px)', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            padding: '30px 20px' 
        }}>
            <div style={{
                width: '100%',
                maxWidth: '520px',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '32px',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                boxSizing: 'border-box'
            }}>
                <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '24px' }}>
                    <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#0f172a' }}>Hồ sơ cá nhân</h2>
                    <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#64748b' }}>Quản lý thông tin tài khoản và bảo mật của bạn</p>
                </div>

                {statusMsg.text && (
                    <div style={{
                        padding: '12px 16px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        fontSize: '14px',
                        backgroundColor: statusMsg.type === 'success' ? '#dcfce7' : '#fee2e2',
                        color: statusMsg.type === 'success' ? '#166534' : '#991b1b',
                        border: `1px solid ${statusMsg.type === 'success' ? '#bbf7d0' : '#fecaca'}`
                    }}>
                        {statusMsg.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <div>
                        <label style={{ fontSize: '14px', fontWeight: '600', color: '#334155', display: 'block' }}>Email đăng nhập</label>
                        <input
                            type="email"
                            value={formData.email}
                            disabled
                            style={{ ...inputStyle, backgroundColor: '#f1f5f9', color: '#64748b', cursor: 'not-allowed' }}
                        />
                        <span style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px', display: 'block' }}>Email không thể thay đổi.</span>
                    </div>

                    <div>
                        <label style={{ fontSize: '14px', fontWeight: '600', color: '#334155', display: 'block' }}>
                            Họ và tên <span style={{ color: '#ef4444' }}>*</span>
                        </label>
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
                        <label style={{ fontSize: '14px', fontWeight: '600', color: '#334155', display: 'block' }}>Số điện thoại</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone || ''}
                            onChange={handleChange}
                            placeholder="Nhập số điện thoại"
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label style={{ fontSize: '14px', fontWeight: '600', color: '#334155', display: 'block' }}>Địa chỉ giao hàng</label>
                        <textarea
                            name="address"
                            rows="3"
                            value={formData.address || ''}
                            onChange={handleChange}
                            placeholder="Nhập địa chỉ nhận hàng mặc định"
                            style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            marginTop: '4px',
                            backgroundColor: '#2563eb',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '12px',
                            fontSize: '15px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                        }}
                    >
                        Lưu thay đổi hồ sơ
                    </button>
                </form>

                {/* --- PHẦN ĐỔI MẬT KHẨU --- */}
                <div style={{ marginTop: '36px', borderTop: '1px solid #e2e8f0', paddingTop: '24px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', marginBottom: '6px' }}>Đổi mật khẩu</h3>
                    <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>Đảm bảo tài khoản của bạn đang sử dụng mật khẩu an toàn</p>

                    {passMsg.text && (
                        <div style={{
                            padding: '12px 16px',
                            borderRadius: '8px',
                            marginBottom: '16px',
                            fontSize: '14px',
                            backgroundColor: passMsg.type === 'success' ? '#dcfce7' : '#fee2e2',
                            color: passMsg.type === 'success' ? '#166534' : '#991b1b',
                            border: `1px solid ${passMsg.type === 'success' ? '#bbf7d0' : '#fecaca'}`
                        }}>
                            {passMsg.text}
                        </div>
                    )}

                    <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{ fontSize: '14px', fontWeight: '600', color: '#334155', display: 'block' }}>Mật khẩu cũ</label>
                            <input
                                type="password"
                                name="oldPassword"
                                value={passwordData.oldPassword}
                                onChange={handlePasswordChange}
                                placeholder="Nhập mật khẩu hiện tại"
                                required
                                style={inputStyle}
                            />
                        </div>

                        <div>
                            <label style={{ fontSize: '14px', fontWeight: '600', color: '#334155', display: 'block' }}>Mật khẩu mới</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                                required
                                style={inputStyle}
                            />
                        </div>

                        <button
                            type="submit"
                            style={{
                                marginTop: '4px',
                                backgroundColor: '#0f172a',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '12px',
                                fontSize: '15px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s'
                            }}
                        >
                            Cập nhật mật khẩu
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}