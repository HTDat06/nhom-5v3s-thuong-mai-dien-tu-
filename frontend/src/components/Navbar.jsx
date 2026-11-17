import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    const categories = [
        { name: "Trang chủ", path: "/" },
        { name: "VGA", path: "/products?category=vga" },
        { name: "RAM", path: "/products?category=ram" },
        { name: "CPU", path: "/products?category=cpu" },
        { name: "Mainboard", path: "/products?category=mainboard" },
        { name: "SSD", path: "/products?category=ssd" },
        { name: "PSU", path: "/products?category=psu" },
        { name: "Case PC", path: "/products?category=case" },
        { name: "Tản nhiệt", path: "/products?category=cooler" }
    ];

    // Lấy thông tin user hiện tại từ localStorage để kiểm tra phân quyền
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user.role === 'admin';

    return (
        <nav style={{
            backgroundColor: '#2563eb',
            padding: '0 24px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '48px'
            }}>
                {/* Danh mục nằm ngang */}
                <ul style={{
                    display: 'flex',
                    listStyle: 'none',
                    margin: 0,
                    padding: 0,
                    gap: '8px'
                }}>
                    {categories.map((item) => (
                        <li key={item.name}>
                            <Link
                                to={item.path}
                                style={{
                                    color: '#f8fafc',
                                    textDecoration: 'none',
                                    padding: '8px 14px',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    display: 'inline-block'
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#334155'}
                                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Chỉ hiển thị nút Hồ sơ cá nhân nếu KHÔNG PHẢI là admin */}
                {!isAdmin && (
                    <Link
                        to="/profile"
                        style={{
                            backgroundColor: '#2563eb',
                            color: '#ffffff',
                            textDecoration: 'none',
                            padding: '6px 14px',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}
                    >
                        <span>👤</span> Hồ sơ cá nhân
                    </Link>
                )}
            </div>
        </nav>
    );
}

export default Navbar;