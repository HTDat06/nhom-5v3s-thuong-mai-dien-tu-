const prisma = require("../config/prisma");

class UserService {
    async list(keyword = "", page = 1) {
        const limit = 10;

        // Kiểm tra page hợp lệ
        page = Math.max(1, Number.parseInt(page, 10) || 1);

        // Điều kiện tìm kiếm email
        const where = keyword.trim()
            ? {
                email: {
                    contains: keyword.trim()
                }
            }
            : {};

        // Tổng số người dùng phù hợp từ khóa
        const totalUsers = await prisma.user.count({
            where
        });

        // Tính tổng số trang
        const totalPages = Math.ceil(totalUsers / limit);

        // Nếu page vượt quá tổng số trang thì đưa về trang cuối
        page = totalPages > 0
            ? Math.min(page, totalPages)
            : 1;

        // Lấy danh sách người dùng của trang hiện tại
        const users = await prisma.user.findMany({
            where,
            select: {
                user_id: true,
                name: true,
                email: true,
                phone: true,
                role: true
            },
            orderBy: {
                user_id: "asc"
            },
            skip: (page - 1) * limit,
            take: limit
        });

        return {
            users,
            pagination: {
                currentPage: page,
                limit,
                totalUsers,
                totalPages
            }
        };
    }
}

module.exports = new UserService();