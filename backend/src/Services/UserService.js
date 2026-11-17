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
                phone: true,
                address: true // Bổ sung lấy thêm trường address
            }
        });

        if (!user) {
            throw new Error("Không tìm thấy người dùng");
        }
        return user;
    }

    async updateProfile(userId, data) {
        const { name, phone, address } = data; // Lấy thêm address từ request

        if (!name || name.trim() === "") {
            throw new Error("Họ tên không được để trống");
        }

        const updatedUser = await prisma.user.update({
            where: { user_id: Number(userId) },
            data: {
                name: name.trim(),
                phone: phone ? phone.trim() : null,
                address: address ? address.trim() : null // Cập nhật address vào DB
            },
            select: {
                user_id: true,
                name: true,
                email: true,
                phone: true,
                address: true // Trả về address mới cập nhật
            }
        });

        return updatedUser;
    }

    // --- CHỨC NĂNG ĐỔI MẬT KHẨU ---
    async changePassword(userId, oldPassword, newPassword) {
        if (!oldPassword || !newPassword) {
            throw new Error("Vui lòng nhập đầy đủ mật khẩu cũ và mật khẩu mới");
        }

        if (newPassword.length < 6) {
            throw new Error("Mật khẩu mới phải có ít nhất 6 ký tự");
        }

        const user = await prisma.user.findUnique({
            where: { user_id: Number(userId) }
        });

        if (!user) {
            throw new Error("Không tìm thấy người dùng");
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            throw new Error("Mật khẩu cũ không chính xác");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);

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