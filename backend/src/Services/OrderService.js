const { Prisma } = require("@prisma/client");
const prisma = require("../config/prisma");

function createError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

class OrderService {
    async placeOrder(userId, { receiver_name, shipping_address, phone } = {}) {
        const parsedUserId = Number(userId);

        if (!Number.isInteger(parsedUserId) || parsedUserId <= 0) {
            throw createError("Người dùng không hợp lệ.", 401);
        }

        if (
            typeof shipping_address !== "string" ||
            !shipping_address.trim()
        ) {
            throw createError("Vui lòng nhập địa chỉ nhận hàng.", 400);
        }

        if (
            typeof phone !== "string" ||
            !phone.trim()
        ) {
            throw createError("Vui lòng nhập số điện thoại.", 400);
        }

        try {
            return await prisma.$transaction(
                async (tx) => {
                    const cartItems = await tx.cart_items.findMany({
                        where: {
                            user_id: parsedUserId
                        },
                        include: {
                            products: true
                        }
                    });
                    if (
                        typeof receiver_name !== "string" ||
                        !receiver_name.trim()
                    ) {
                        throw createError("Vui lòng nhập tên người nhận.", 400);
                    }

                    if (cartItems.length === 0) {
                        throw createError(
                            "Giỏ hàng đang trống.",
                            400
                        );
                    }

                    const groupedItems = new Map();

                    for (const item of cartItems) {
                        if (
                            !Number.isInteger(item.quantity) ||
                            item.quantity <= 0
                        ) {
                            throw createError(
                                "Số lượng sản phẩm trong giỏ hàng không hợp lệ.",
                                400
                            );
                        }

                        const product = item.products;

                        if (!product) {
                            throw createError(
                                "Không tìm thấy sản phẩm trong giỏ hàng.",
                                404
                            );
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

                        const price = new Prisma.Decimal(
                            product.price.toString()
                        );

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
                                stock: {
                                    gte: item.quantity
                                }
                            },
                            data: {
                                stock: {
                                    decrement: item.quantity
                                }
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
                        where: {
                            user_id: parsedUserId
                        }
                    });

                    return tx.orders.findUnique({
                        where: {
                            order_id: order.order_id
                        },
                        include: {
                            order_items: {
                                include: {
                                    products: true
                                }
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
                throw createError(
                    "Đơn hàng đang được xử lý đồng thời. Vui lòng thử lại.",
                    409
                );
            }

            throw error;
        }
    }

    // TM-07: Lấy danh sách đơn hàng của tài khoản hiện tại
    async getMyOrders(userId) {
        const parsedUserId = Number(userId);
        if (!Number.isInteger(parsedUserId) || parsedUserId <= 0) {
            throw createError("Người dùng không hợp lệ.", 401);
        }

        return await prisma.orders.findMany({
            where: {
                user_id: parsedUserId
            },
            orderBy: {
                order_id: "desc"
            },
            include: {
                order_items: {
                    include: {
                        products: true
                    }
                }
            }
        });
    }

    // TM-07: Xem chi tiết đơn hàng & chặn xem đơn của người khác (IDOR)
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
            where: {
                order_id: parsedOrderId
            },
            include: {
                order_items: {
                    include: {
                        products: true
                    }
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

    // TM-07: Hủy đơn khi còn trạng thái "pending" (Chờ xác nhận) & hoàn tồn kho trong transaction
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
                where: {
                    order_id: parsedOrderId
                },
                include: {
                    order_items: {
                        include: {
                            products: true
                        }
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
                throw createError(
                    "Chỉ có thể hủy đơn hàng khi đang ở trạng thái Chờ xác nhận.",
                    400
                );
            }

            // Hoàn trả số lượng tồn kho cho từng sản phẩm trong đơn
            for (const item of order.order_items) {
                await tx.products.update({
                    where: {
                        product_id: item.product_id
                    },
                    data: {
                        stock: {
                            increment: item.quantity
                        }
                    }
                });
            }

            // Cập nhật trạng thái đơn sang "cancelled"
            return await tx.orders.update({
                where: {
                    order_id: parsedOrderId
                },
                data: {
                    status: "cancelled"
                },
                include: {
                    order_items: {
                        include: {
                            products: true
                        }
                    }
                }
            });
        });
    }
}

module.exports = new OrderService();