const UserService = require("../Services/UserService");

class UserController {
    async list(req, res) {
        try {
            const keyword = req.query.keyword || "";
            const page = req.query.page || 1;

            const result = await UserService.list(keyword, page);

            return res.status(200).json({
                success: true,
                message: "Lấy danh sách người dùng thành công",
                data: result.users,
                pagination: result.pagination
            });
        } catch (error) {
            console.error("Lỗi lấy danh sách người dùng:", error);

            return res.status(500).json({
                success: false,
                message: "Không thể lấy danh sách người dùng"
            });
        }
    }
}

module.exports = new UserController();