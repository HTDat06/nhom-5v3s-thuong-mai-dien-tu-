const UserService = require("../Services/UserService");

class UserController {
    async getProfile(req, res) {
        try {
            // Lấy id linh hoạt từ req.user (hỗ trợ cả id lẫn user_id)
            const userId = req.user?.user_id || req.user?.id || req.user?.userId;
            
            if (!userId) {
                return res.status(400).json({ success: false, message: "Không tìm thấy thông tin xác thực người dùng trong token" });
            }

            const user = await UserService.getProfile(userId);

            return res.status(200).json({
                success: true,
                message: "Lấy thông tin hồ sơ thành công",
                data: user
            });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    async updateProfile(req, res) {
        try {
            const userId = req.user?.user_id || req.user?.id || req.user?.userId;
            
            if (!userId) {
                return res.status(400).json({ success: false, message: "Không tìm thấy thông tin xác thực người dùng trong token" });
            }

            const updatedUser = await UserService.updateProfile(userId, req.body);

            return res.status(200).json({
                success: true,
                message: "Cập nhật hồ sơ thành công",
                data: updatedUser
            });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }
}

module.exports = new UserController();