
const prisma = require("../config/prisma");

class UserRepository {
    // Tìm tài khoản theo email
    async findByEmail(email) {
        return prisma.user.findUnique({
            where: { email }
        });
    }

    // Tạo tài khoản mới
    async create(data) {
        return prisma.user.create({
            data,
            select: {
                user_id: true,
                name: true,
                email: true,
                phone: true,
                role: true
            }
        });
    }

    // TM-14: Lấy danh sách người dùng có tìm kiếm và phân trang
    async list(keyword = "", page = 1, pageSize = 10) {
        const where = keyword
            ? {
                email: {
                    contains: keyword
                }
            }
            : {};

        const skip = (page - 1) * pageSize;

        const [users, totalItems] = await prisma.$transaction([
            prisma.user.findMany({
                where,
                select: {
                    user_id: true,
                    name: true,
                    email: true,
                    phone: true,
                    role: true,
                    status: true
                },
                orderBy: {
                    user_id: "asc"
                },
                skip,
                take: pageSize
            }),

            prisma.user.count({
                where
            })
        ]);

        return {
            users,
            pagination: {
                currentPage: page,
                pageSize,
                totalItems,
                totalPages: Math.ceil(totalItems / pageSize)
            }
        };
    }

    // Giữ hàm cũ để không ảnh hưởng chức năng khác
    async findAll(searchEmail = "") {
        return prisma.user.findMany({
            where: searchEmail
                ? {
                    email: {
                        contains: searchEmail
                    }
                }
                : {},
            select: {
                user_id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                status: true
            },
            orderBy: {
                user_id: "asc"
            }
        });
    }

    // TM-14: Cập nhật trạng thái tài khoản
    async updateStatus(userId, status) {
        return prisma.user.update({
            where: {
                user_id: Number(userId)
            },
            data: {
                status
            },
            select: {
                user_id: true,
                name: true,
                email: true,
                role: true,
                status: true
            }
        });
    }
}

module.exports = new UserRepository();
