const prisma = require("../config/prisma");

class UserService {
    async getProfile(userId) {
        // Sử dụng trực tiếp tham số userId truyền từ Controller/Middleware xuống
        const user = await prisma.user.findUnique({
            where: { 
                user_id: Number(userId) // Khóa chính chuẩn theo Prisma schema
            },
            select: {
                user_id: true,
                name: true,
                email: true,
                phone: true
                // Tạm thời bỏ address vì database/schema chưa có cột này
            }
        });

        if (!user) {
            throw new Error("Không tìm thấy người dùng");
        }
        return user;
    }

    async updateProfile(userId, data) {
        const { name, phone } = data;

        if (!name || name.trim() === "") {
            throw new Error("Họ tên không được để trống");
        }

        const updatedUser = await prisma.user.update({
            where: { user_id: Number(userId) },
            data: {
                name: name.trim(),
                phone: phone ? phone.trim() : null
            },
            select: {
                user_id: true,
                name: true,
                email: true,
                phone: true
            }
        });

        return updatedUser;
    }
}

module.exports = new UserService();