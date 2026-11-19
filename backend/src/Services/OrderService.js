
const { Prisma } = require("@prisma/client");
const prisma = require("../config/prisma");

function createError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

class OrderService {
    async placeOrder(userId, { receiver_name, shipping_address, phone } = {}) {
        // 1. Kiểm tra dữ liệu đầu vào
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

        // 2. Thực hiện toàn bộ quy trình trong một transaction
        try {
            return await prisma.$transaction(
                async (tx) => {
                    // Đọc giỏ hàng của người dùng
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

                    // Gộp các dòng trùng product_id nếu có
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

                    // Kiểm tra tồn kho và tính tổng tiền
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

                    // Tạo đơn hàng
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

                    // Trừ kho bằng cập nhật có điều kiện.
                    // Nếu kho đã thay đổi và không còn đủ hàng,
                    // updateMany sẽ không cập nhật bản ghi nào.
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

                    // Tạo chi tiết đơn hàng
                    await tx.order_items.createMany({
                        data: orderItems.map((item) => ({
                            order_id: order.order_id,
                            product_id: item.product_id,
                            quantity: item.quantity,
                            price: item.price,
                            subtotal: item.subtotal
                        }))
                    });

                    // Xóa giỏ hàng sau khi đặt thành công
                    await tx.cart_items.deleteMany({
                        where: {
                            user_id: parsedUserId
                        }
                    });

                    // Trả về đơn hàng cùng chi tiết
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
            // Lỗi xung đột transaction: yêu cầu thử lại
            if (error.code === "P2034") {
                throw createError(
                    "Đơn hàng đang được xử lý đồng thời. Vui lòng thử lại.",
                    409
                );
            }

            throw error;
        }
    }
}

module.exports = new OrderService();
