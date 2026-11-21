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
                address: true
            }
        });

        if (!user) {
            throw new Error("Không tìm thấy người dùng");
        }
        return user;
    }

    async updateProfile(userId, data) {
        const { name, phone, address } = data;

        if (!name || name.trim() === "") {
            throw new Error("Họ tên không được để trống");
        }

        const updatedUser = await prisma.user.update({
            where: { user_id: Number(userId) },
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
    }

    // --- CHỨC NĂNG ĐỔI MẬT KHẨU (TM-08 CHUẨN) ---
    async changePassword(userId, oldPassword, newPassword, confirmNewPassword) {
        // 1. Kiểm tra đầu vào đầy đủ các trường
        if (!oldPassword || !newPassword || !confirmNewPassword) {
            throw new Error("Vui lòng nhập đầy đủ mật khẩu cũ, mật khẩu mới và xác nhận mật khẩu");
        }

        // 2. Ràng buộc mật khẩu mới >= 8 ký tự theo đúng yêu cầu TM-08
        if (newPassword.length < 8) {
            throw new Error("Mật khẩu mới phải có ít nhất 8 ký tự");
        }

        // 3. Kiểm tra mật khẩu mới và mật khẩu nhập lại có khớp nhau không
        if (newPassword !== confirmNewPassword) {
            throw new Error("Mật khẩu nhập lại không khớp với mật khẩu mới");
        }

        const user = await prisma.user.findUnique({
            where: { user_id: Number(userId) }
        });

        if (!user) {
            throw new Error("Không tìm thấy người dùng");
        }

        // 4. Kiểm tra mật khẩu cũ có chính xác không
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            throw new Error("Mật khẩu cũ không chính xác");
        }

        // 5. Mã hóa mật khẩu mới bằng bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);

        // 6. Cập nhật vào Database
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