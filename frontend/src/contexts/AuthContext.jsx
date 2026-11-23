
import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

function readSavedUser() {
    try {
        const token = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");

        // Không có token hoặc user thì xem như chưa đăng nhập
        if (!token || !savedUser) return null;

        return JSON.parse(savedUser);
    } catch {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        return null;
    }
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(readSavedUser);

    const [token, setToken] = useState(
        () => localStorage.getItem("token")
    );

    // Đăng nhập
    const login = (userData, accessToken) => {
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", accessToken);

        setUser(userData);
        setToken(accessToken);

        window.dispatchEvent(new Event("authChanged"));
    };

    // Cập nhật thông tin người dùng
    const updateUser = (updatedData) => {
        setUser((prevUser) => {
            if (!prevUser) return prevUser;

            const newUser = {
                ...prevUser,
                ...updatedData
            };

            localStorage.setItem(
                "user",
                JSON.stringify(newUser)
            );

            return newUser;
        });

        window.dispatchEvent(new Event("authChanged"));
    };

    // Đăng xuất
    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");

        setUser(null);
        setToken(null);

        window.dispatchEvent(new Event("authChanged"));
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout,
                updateUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
