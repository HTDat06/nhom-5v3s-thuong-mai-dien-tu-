
const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");
const UserRepository = require("../Repositories/UserRepository");

class UserService {
    // =====================================
    // TM-08: HỒ SƠ CÁ NHÂN
    // =====================================

    // 1. Xem hồ sơ cá nhân
    async getProfile(userId) {
        const parsedId = Number(userId);

        if (!Number.isInteger(parsedId) || parsedId <= 0) {
            const error = new Error("ID người dùng không hợp lệ");
            error.statusCode = 400;
            throw error;
        }

        const user = await prisma.user.findUnique({
            where: {
                user_id: parsedId
            },
            select: {
                user_id: true,
                name: true,
                email: true,
                phone: true,
                address: true
            }
        });

        if (!user) {
            const error = new Error("Không tìm thấy người dùng");
            error.statusCode = 404;
            throw error;
        }

        return user;
    }

    // 2. Cập nhật hồ sơ cá nhân
    async updateProfile(userId, data) {
        const parsedId = Number(userId);

        if (!Number.isInteger(parsedId) || parsedId <= 0) {
            const error = new Error("ID người dùng không hợp lệ");
            error.statusCode = 400;
            throw error;
        }

        const { name, phone, address } = data || {};

        // Kiểm tra họ tên
        if (
            typeof name !== "string" ||
            name.trim() === ""
        ) {
            const error = new Error("Họ tên không được để trống");
            error.statusCode = 400;
            throw error;
        }

        // Kiểm tra số điện thoại
        if (
            phone !== undefined &&
            phone !== null &&
            typeof phone !== "string"
        ) {
            const error = new Error("Số điện thoại không hợp lệ");
            error.statusCode = 400;
            throw error;
        }

        // Kiểm tra địa chỉ
        if (
            address !== undefined &&
            address !== null &&
            typeof address !== "string"
        ) {
            const error = new Error("Địa chỉ không hợp lệ");
            error.statusCode = 400;
            throw error;
        }

        try {
            const updatedUser = await prisma.user.update({
                where: {
                    user_id: parsedId
                },
                data: {
                    name: name.trim(),
                    phone: phone ? phone.trim() : null,
                    address: address ? address.trim() : null
                },
                select: {
                    user_id: true,
                    name: true,
                    email: true,
                    phone: true,
                    address: true
                }
            });

            return updatedUser;
        } catch (error) {
            if (error.code === "P2025") {
                const notFoundError = new Error(
                    "Không tìm thấy người dùng"
                );
                notFoundError.statusCode = 404;
                throw notFoundError;
            }

            throw error;
        }
    }

    // 3. Đổi mật khẩu
    async changePassword(userId, oldPassword, newPassword) {
        const parsedId = Number(userId);

        if (!Number.isInteger(parsedId) || parsedId <= 0) {
            const error = new Error("ID người dùng không hợp lệ");
            error.statusCode = 400;
            throw error;
        }

        // Kiểm tra dữ liệu đầu vào
        if (
            typeof oldPassword !== "string" ||
            oldPassword.length === 0 ||
            typeof newPassword !== "string" ||
            newPassword.length === 0
        ) {
            const error = new Error(
                "Vui lòng nhập đầy đủ mật khẩu cũ và mật khẩu mới"
            );
            error.statusCode = 400;
            throw error;
        }

        // Mật khẩu mới tối thiểu 8 ký tự theo Ngày 8
        if (newPassword.length < 8) {
            const error = new Error(
                "Mật khẩu mới phải có ít nhất 8 ký tự"
            );
            error.statusCode = 400;
            throw error;
        }

        // Không cho dùng lại mật khẩu cũ
        if (oldPassword === newPassword) {
            const error = new Error(
                "Mật khẩu mới phải khác mật khẩu cũ"
            );
            error.statusCode = 400;
            throw error;
        }

        // Tìm người dùng
        const user = await prisma.user.findUnique({
            where: {
                user_id: parsedId
            }
        });

        if (!user) {
            const error = new Error("Không tìm thấy người dùng");
            error.statusCode = 404;
            throw error;
        }

        // Kiểm tra mật khẩu cũ
        const isMatch = await bcrypt.compare(
            oldPassword,
            user.password
        );

        if (!isMatch) {
            const error = new Error("Mật khẩu cũ không chính xác");
            error.statusCode = 400;
            throw error;
        }

        // Mã hóa mật khẩu mới
        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        // Cập nhật vào database
        await prisma.user.update({
            where: {
                user_id: parsedId
            },
            data: {
                password: hashedPassword
            }
        });

        return {
            message: "Đổi mật khẩu thành công"
        };
    }

    // =====================================
    // TM-14: QUẢN LÝ NGƯỜI DÙNG
    // =====================================

    // Danh sách, tìm kiếm email và phân trang
    async list(keyword = "", page = 1) {
        if (typeof keyword !== "string") {
            const error = new Error(
                "Từ khóa tìm kiếm không hợp lệ"
            );
            error.statusCode = 400;
            throw error;
        }

        const parsedPage = Number(page);

        if (!Number.isInteger(parsedPage) || parsedPage < 1) {
            const error = new Error("Số trang không hợp lệ");
            error.statusCode = 400;
            throw error;
        }

        const normalizedKeyword = keyword.trim();

        return UserRepository.list(
            normalizedKeyword,
            parsedPage,
            10
        );
    }

    // Giữ hàm cũ để tương thích với code đang sử dụng
    async getAllUsers(email = "") {
        if (typeof email !== "string") {
            const error = new Error("Email tìm kiếm không hợp lệ");
            error.statusCode = 400;
            throw error;
        }

        return UserRepository.findAll(email.trim());
    }

    // Khóa hoặc mở khóa tài khoản
    async updateUserStatus(userId, status, adminId) {
        const parsedId = Number(userId);

        if (!Number.isInteger(parsedId) || parsedId <= 0) {
            const error = new Error("ID người dùng không hợp lệ");
            error.statusCode = 400;
            throw error;
        }

        if (!["ACTIVE", "LOCKED"].includes(status)) {
            const error = new Error(
                "Trạng thái tài khoản không hợp lệ"
            );
            error.statusCode = 400;
            throw error;
        }

        if (!adminId) {
            const error = new Error(
                "Không xác định được tài khoản quản trị"
            );
            error.statusCode = 401;
            throw error;
        }

        // Không cho Admin tự khóa tài khoản của mình
        if (
            status === "LOCKED" &&
            parsedId === Number(adminId)
        ) {
            const error = new Error(
                "Không thể tự khóa tài khoản quản trị của mình"
            );
            error.statusCode = 400;
            throw error;
        }

        try {
            return await UserRepository.updateStatus(
                parsedId,
                status
            );
        } catch (error) {
            if (error.code === "P2025") {
                const notFoundError = new Error(
                    "Không tìm thấy người dùng"
                );
                notFoundError.statusCode = 404;
                throw notFoundError;
            }

            throw error;
        }
    }
}

module.exports = new UserService();
