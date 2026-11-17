const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");

class UserService {
    async getProfile(userId) {
        const user = await prisma.user.findUnique({
            where: { 
                user_id: Number(userId) 
            },
            select: {
                user_id: true,
                name: true,
                email: true,
                phone: true
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

    // --- BỔ SUNG CHỨC NĂNG ĐỔI MẬT KHẨU ---
    async changePassword(userId, oldPassword, newPassword) {
        if (!oldPassword || !newPassword) {
            throw new Error("Vui lòng nhập đầy đủ mật khẩu cũ và mật khẩu mới");
        }

        if (newPassword.length < 6) {
            throw new Error("Mật khẩu mới phải có ít nhất 6 ký tự");
        }

        // 1. Lấy thông tin user (cần lấy cả trường password đã mã hóa trong DB)
        const user = await prisma.user.findUnique({
            where: { user_id: Number(userId) }
        });

        if (!user) {
            throw new Error("Không tìm thấy người dùng");
        }

        // 2. Kiểm tra mật khẩu cũ có khớp không
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            throw new Error("Mật khẩu cũ không chính xác");
        }

        // 3. Mã hóa mật khẩu mới
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);

        // 4. Cập nhật vào database
        await prisma.user.update({
            where: { user_id: Number(userId) },
            data: {
                password: hashedNewPassword
            }
        });

        return { message: "Đổi mật khẩu thành công" };
    }
}

module.exports = new UserService();