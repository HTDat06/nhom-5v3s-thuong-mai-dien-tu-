const { Prisma } = require("@prisma/client");
const prisma = require("../config/prisma");

function createError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

// Máy trạng thái đơn hàng (State Machine): chỉ cho đi xuôi, chặn đi ngược & nhảy bước
const STATUS_LABELS = {
    pending: "Chờ xác nhận",
    shipping: "Đang giao",
    completed: "Hoàn thành",
    cancelled: "Đã hủy"
};

const ALLOWED_TRANSITIONS = {
    pending: ["shipping", "cancelled"],
    shipping: ["completed"],
    completed: [],
    cancelled: []
};

class OrderService {
    async placeOrder(userId, { receiver_name, shipping_address, phone } = {}) {
        const parsedUserId = Number(userId);

        if (!Number.isInteger(parsedUserId) || parsedUserId <= 0) {
            throw createError("Người dùng không hợp lệ.", 401);
        }

        if (typeof shipping_address !== "string" || !shipping_address.trim()) {
            throw createError("Vui lòng nhập địa chỉ nhận hàng.", 400);
        }

        if (typeof phone !== "string" || !phone.trim()) {
            throw createError("Vui lòng nhập số điện thoại.", 400);
        }

        try {
            return await prisma.$transaction(
                async (tx) => {
                    const cartItems = await tx.cart_items.findMany({
                        where: { user_id: parsedUserId },
                        include: { products: true }
                    });

                    if (typeof receiver_name !== "string" || !receiver_name.trim()) {
                        throw createError("Vui lòng nhập tên người nhận.", 400);
                    }

                    if (cartItems.length === 0) {
                        throw createError("Giỏ hàng đang trống.", 400);
                    }

                    const groupedItems = new Map();

                    for (const item of cartItems) {
                        if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
                            throw createError("Số lượng sản phẩm trong giỏ hàng không hợp lệ.", 400);
                        }

                        const product = item.products;
                        if (!product) {
                            throw createError("Không tìm thấy sản phẩm trong giỏ hàng.", 404);
                        }

                        const current = groupedItems.get(product.product_id);
                        if (current) {
                            current.quantity += item.quantity;
                        } else {
                            groupedItems.set(product.product_id, {
                                product,
                                quantity: item.quantity
                            });
                        }
                    }

                    const orderItems = [];
                    let totalAmount = new Prisma.Decimal(0);

                    for (const { product, quantity } of groupedItems.values()) {
                        if (product.stock < quantity) {
                            throw createError(
                                `Sản phẩm "${product.product_name}" không đủ tồn kho. Còn lại: ${product.stock}.`,
                                409
                            );
                        }

                        const price = new Prisma.Decimal(product.price.toString());
                        const subtotal = price.mul(quantity);
                        totalAmount = totalAmount.add(subtotal);

                        orderItems.push({
                            product_id: product.product_id,
                            quantity,
                            price,
                            subtotal
                        });
                    }

                    const order = await tx.orders.create({
                        data: {
                            user_id: parsedUserId,
                            total_amount: totalAmount,
                            receiver_name: receiver_name.trim(),
                            shipping_address: shipping_address.trim(),
                            phone: phone.trim(),
                            status: "pending"
                        }
                    });

                    for (const item of orderItems) {
                        const stockResult = await tx.products.updateMany({
                            where: {
                                product_id: item.product_id,
                                stock: { gte: item.quantity }
                            },
                            data: {
                                stock: { decrement: item.quantity }
                            }
                        });

                        if (stockResult.count !== 1) {
                            throw createError(
                                "Sản phẩm không đủ tồn kho. Vui lòng tải lại giỏ hàng.",
                                409
                            );
                        }
                    }

                    await tx.order_items.createMany({
                        data: orderItems.map((item) => ({
                            order_id: order.order_id,
                            product_id: item.product_id,
                            quantity: item.quantity,
                            price: item.price,
                            subtotal: item.subtotal
                        }))
                    });

                    await tx.cart_items.deleteMany({
                        where: { user_id: parsedUserId }
                    });

                    return tx.orders.findUnique({
                        where: { order_id: order.order_id },
                        include: {
                            order_items: {
                                include: { products: true }
                            }
                        }
                    });
                },
                {
                    isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
                    maxWait: 10000,
                    timeout: 15000
                }
            );
        } catch (error) {
            if (error.code === "P2034") {
                throw createError("Đơn hàng đang được xử lý đồng thời. Vui lòng thử lại.", 409);
            }
            throw error;
        }
    }

    // TM-07: Danh sách đơn hàng của khách hàng
    async getMyOrders(userId) {
        const parsedUserId = Number(userId);
        if (!Number.isInteger(parsedUserId) || parsedUserId <= 0) {
            throw createError("Người dùng không hợp lệ.", 401);
        }

        return await prisma.orders.findMany({
            where: { user_id: parsedUserId },
            orderBy: { order_id: "desc" },
            include: {
                order_items: {
                    include: { products: true }
                }
            }
        });
    }

    // TM-07: Chi tiết đơn hàng của khách hàng (chặn IDOR)
    async getOrderDetail(userId, orderId) {
        const parsedUserId = Number(userId);
        const parsedOrderId = Number(orderId);

        if (!Number.isInteger(parsedUserId) || parsedUserId <= 0) {
            throw createError("Người dùng không hợp lệ.", 401);
        }

        if (!Number.isInteger(parsedOrderId) || parsedOrderId <= 0) {
            throw createError("Mã đơn hàng không hợp lệ.", 400);
        }

        const order = await prisma.orders.findUnique({
            where: { order_id: parsedOrderId },
            include: {
                order_items: {
                    include: { products: true }
                }
            }
        });

        if (!order) {
            throw createError("Không tìm thấy đơn hàng.", 404);
        }

        if (order.user_id !== parsedUserId) {
            throw createError("Bạn không có quyền xem đơn hàng này.", 403);
        }

        return order;
    }

    // TM-07: Khách hàng hủy đơn khi còn "pending"
    async cancelOrder(userId, orderId) {
        const parsedUserId = Number(userId);
        const parsedOrderId = Number(orderId);

        if (!Number.isInteger(parsedUserId) || parsedUserId <= 0) {
            throw createError("Người dùng không hợp lệ.", 401);
        }

        if (!Number.isInteger(parsedOrderId) || parsedOrderId <= 0) {
            throw createError("Mã đơn hàng không hợp lệ.", 400);
        }

        return await prisma.$transaction(async (tx) => {
            const order = await tx.orders.findUnique({
                where: { order_id: parsedOrderId },
                include: {
                    order_items: {
                        include: { products: true }
                    }
                }
            });

            if (!order) {
                throw createError("Không tìm thấy đơn hàng.", 404);
            }

            if (order.user_id !== parsedUserId) {
                throw createError("Bạn không có quyền hủy đơn hàng này.", 403);
            }

            if (order.status !== "pending") {
                throw createError("Chỉ có thể hủy đơn hàng khi đang ở trạng thái Chờ xác nhận.", 400);
            }

            for (const item of order.order_items) {
                await tx.products.update({
                    where: { product_id: item.product_id },
                    data: {
                        stock: { increment: item.quantity }
                    }
                });
            }

            return await tx.orders.update({
                where: { order_id: parsedOrderId },
                data: { status: "cancelled" },
                include: {
                    order_items: {
                        include: { products: true }
                    }
                }
            });
        });
    }

    // TM-13: Admin lấy danh sách toàn bộ đơn hàng (có lọc theo trạng thái)
    async getAllOrdersForAdmin(statusFilter) {
        const where = {};

        if (statusFilter && statusFilter !== "all") {
            if (!Object.prototype.hasOwnProperty.call(STATUS_LABELS, statusFilter)) {
                throw createError("Trạng thái lọc đơn hàng không hợp lệ.", 400);
            }
            where.status = statusFilter;
        }

        return await prisma.orders.findMany({
            where,
            orderBy: { order_id: "desc" },
            include: {
                order_items: {
                    include: { products: true }
                }
            }
        });
    }

    // TM-13: Admin chuyển trạng thái đơn theo máy trạng thái (chặn đi ngược)
    async updateOrderStatusByAdmin(orderId, nextStatus) {
        const parsedOrderId = Number(orderId);
        if (!Number.isInteger(parsedOrderId) || parsedOrderId <= 0) {
            throw createError("Mã đơn hàng không hợp lệ.", 400);
        }

        if (!nextStatus || !Object.prototype.hasOwnProperty.call(STATUS_LABELS, nextStatus)) {
            throw createError("Trạng thái đơn hàng đích không hợp lệ.", 400);
        }

        return await prisma.$transaction(async (tx) => {
            const order = await tx.orders.findUnique({
                where: { order_id: parsedOrderId },
                include: {
                    order_items: {
                        include: { products: true }
                    }
                }
            });

            if (!order) {
                throw createError("Không tìm thấy đơn hàng.", 404);
            }

            const currentStatus = order.status;

            if (currentStatus === nextStatus) {
                throw createError(
                    `Đơn hàng đã ở trạng thái "${STATUS_LABELS[currentStatus]}".`,
                    400
                );
            }

            const allowedNextStatuses = ALLOWED_TRANSITIONS[currentStatus] || [];
            if (!allowedNextStatuses.includes(nextStatus)) {
                const currentLabel = STATUS_LABELS[currentStatus] || currentStatus;
                const nextLabel = STATUS_LABELS[nextStatus] || nextStatus;
                throw createError(
                    `Không thể chuyển trạng thái từ "${currentLabel}" sang "${nextLabel}" (không cho phép đi ngược hoặc nhảy bước).`,
                    400
                );
            }

            // Nếu Admin hủy đơn từ trạng thái "pending", hoàn lại tồn kho
            if (currentStatus === "pending" && nextStatus === "cancelled") {
                for (const item of order.order_items) {
                    await tx.products.update({
                        where: { product_id: item.product_id },
                        data: {
                            stock: { increment: item.quantity }
                        }
                    });
                }
            }

            return await tx.orders.update({
                where: { order_id: parsedOrderId },
                data: { status: nextStatus },
                include: {
                    order_items: {
                        include: { products: true }
                    }
                }
            });
        });
    }
}

module.exports = new OrderService();