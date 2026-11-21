const UserService = require("../Services/UserService");

class UserController {
    // =====================================
    // TM-08: HỒ SƠ CÁ NHÂN
    // =====================================

    // Lấy hồ sơ cá nhân
    async getProfile(req, res) {
        try {
            const userId =
                req.user?.user_id ||
                req.user?.id ||
                req.user?.userId;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Không tìm thấy thông tin người dùng trong token"
                });
            }

            const user = await UserService.getProfile(userId);

            return res.status(200).json({
                success: true,
                message: "Lấy thông tin hồ sơ thành công",
                data: user
            });
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Không thể lấy hồ sơ"
            });
        }
    }

    // Cập nhật hồ sơ cá nhân
    async updateProfile(req, res) {
        try {
            const userId =
                req.user?.user_id ||
                req.user?.id ||
                req.user?.userId;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Không tìm thấy thông tin người dùng trong token"
                });
            }

            const updatedUser = await UserService.updateProfile(
                userId,
                req.body
            );

            return res.status(200).json({
                success: true,
                message: "Cập nhật hồ sơ thành công",
                data: updatedUser
            });
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Cập nhật hồ sơ thất bại"
            });
        }
    }

    // Đổi mật khẩu
    async changePassword(req, res) {
        try {
            const userId =
                req.user?.user_id ||
                req.user?.id ||
                req.user?.userId;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Không tìm thấy thông tin người dùng trong token"
                });
            }

            const {
                oldPassword,
                newPassword,
                confirmNewPassword,
                confirmPassword
            } = req.body;

            const result = await UserService.changePassword(
                userId,
                oldPassword,
                newPassword,
                confirmNewPassword ?? confirmPassword
            );

            return res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Đổi mật khẩu thất bại"
            });
        }
    }

    // =====================================
    // TM-14: QUẢN LÝ NGƯỜI DÙNG
    // =====================================

    // Admin xem danh sách, tìm kiếm và phân trang
    async getAllUsers(req, res) {
        try {
            const keyword = req.query.keyword ?? req.query.email ?? "";
            const page = req.query.page ?? 1;

            const result = await UserService.list(keyword, page);

            return res.status(200).json({
                success: true,
                data: result.users,
                pagination: result.pagination
            });
        } catch (error) {
            console.error("Get all users error:", error);

            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message ||
                    "Không thể tải danh sách người dùng"
            });
        }
    }

    // Admin khóa tài khoản
    async lockUser(req, res) {
        try {
            const adminId =
                req.user?.user_id ||
                req.user?.id ||
                req.user?.userId;

            const user = await UserService.updateUserStatus(
                req.params.id,
                "LOCKED",
                adminId
            );

            return res.status(200).json({
                success: true,
                message: "Khóa tài khoản thành công",
                data: user
            });
        } catch (error) {
            console.error("Lock user error:", error);

            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message ||
                    "Không thể khóa tài khoản"
            });
        }
    }

    // Admin mở khóa tài khoản
    async unlockUser(req, res) {
        try {
            const adminId =
                req.user?.user_id ||
                req.user?.id ||
                req.user?.userId;

            const user = await UserService.updateUserStatus(
                req.params.id,
                "ACTIVE",
                adminId
            );

            return res.status(200).json({
                success: true,
                message: "Mở khóa tài khoản thành công",
                data: user
            });
        } catch (error) {
            console.error("Unlock user error:", error);

            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message ||
                    "Không thể mở khóa tài khoản"
            });
        }
    }
}

module.exports = new UserController();