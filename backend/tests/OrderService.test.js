
const mockPrisma = {
    $transaction: jest.fn()
};
jest.mock("../src/config/prisma", () => mockPrisma);

const prisma = require("../src/config/prisma");
const { Prisma } = require("@prisma/client");
const orderService = require("../src/Services/OrderService");

describe("OrderService.placeOrder", () => {
    let tx;

    const userId = 12;
    const orderData = {
        receiver_name: "Nguyen Van A",
        shipping_address: "123 Nguyễn Trãi, TP.HCM",
        phone: "0901234567"
    };

    beforeEach(() => {
        jest.clearAllMocks();

        tx = {
            cart_items: {
                findMany: jest.fn(),
                deleteMany: jest.fn()
            },
            orders: {
                create: jest.fn(),
                findUnique: jest.fn()
            },
            products: {
                updateMany: jest.fn()
            },
            order_items: {
                createMany: jest.fn()
            }
        };

        // Giả lập transaction của Prisma.
        prisma.$transaction.mockImplementation(async (callback) => {
            return callback(tx);
        });
    });

    test("Đặt hàng thành công", async () => {
        const cartItem = {
            quantity: 2,
            products: {
                product_id: 1,
                product_name: "Intel Core i3-12100F",
                price: new Prisma.Decimal("100000"),
                stock: 10
            }
        };

        const expectedOrder = {
            order_id: 1,
            user_id: userId,
            status: "pending"
        };

        tx.cart_items.findMany.mockResolvedValue([cartItem]);
        tx.orders.create.mockResolvedValue({ order_id: 1 });
        tx.products.updateMany.mockResolvedValue({ count: 1 });
        tx.order_items.createMany.mockResolvedValue({ count: 1 });
        tx.orders.findUnique.mockResolvedValue(expectedOrder);

        const result = await orderService.placeOrder(userId, orderData);

        // Kiểm tra kết quả trả về.
        expect(result).toEqual(expectedOrder);

        // Kiểm tra đã tìm giỏ hàng của người dùng.
        expect(tx.cart_items.findMany).toHaveBeenCalledWith({
            where: { user_id: userId },
            include: { products: true }
        });

        // Kiểm tra tạo đơn hàng với trạng thái pending.
        expect(tx.orders.create).toHaveBeenCalledWith({
            data: expect.objectContaining({
                user_id: userId,
                shipping_address: orderData.shipping_address,
                phone: orderData.phone,
                status: "pending"
            })
        });

        // Kiểm tra đã trừ tồn kho.
        expect(tx.products.updateMany).toHaveBeenCalledWith({
            where: {
                product_id: 1,
                stock: { gte: 2 }
            },
            data: {
                stock: { decrement: 2 }
            }
        });

        // Kiểm tra đã tạo chi tiết đơn hàng.
        expect(tx.order_items.createMany).toHaveBeenCalledWith({
            data: [
                expect.objectContaining({
                    order_id: 1,
                    product_id: 1,
                    quantity: 2
                })
            ]
        });

        // Kiểm tra đã xóa giỏ hàng.
        expect(tx.cart_items.deleteMany).toHaveBeenCalledWith({
            where: { user_id: userId }
        });
    });

    test("Không đủ tồn kho thì trả lỗi 409 và không tạo đơn hàng", async () => {
        const cartItem = {
            quantity: 5,
            products: {
                product_id: 1,
                product_name: "Intel Core i3-12100F",
                price: new Prisma.Decimal("100000"),
                stock: 2
            }
        };

        tx.cart_items.findMany.mockResolvedValue([cartItem]);

        await expect(
            orderService.placeOrder(userId, orderData)
        ).rejects.toMatchObject({
            statusCode: 409
        });

        // Không tạo đơn hàng.
        expect(tx.orders.create).not.toHaveBeenCalled();

        // Không trừ tồn kho.
        expect(tx.products.updateMany).not.toHaveBeenCalled();

        // Không tạo chi tiết đơn hàng.
        expect(tx.order_items.createMany).not.toHaveBeenCalled();

        // Không xóa giỏ hàng.
        expect(tx.cart_items.deleteMany).not.toHaveBeenCalled();
    });

    test("Tồn kho thay đổi khi cập nhật thì báo lỗi 409 và rollback", async () => {
        const cartItem = {
            quantity: 5,
            products: {
                product_id: 1,
                product_name: "Intel Core i3-12100F",
                price: new Prisma.Decimal("100000"),
                stock: 10
            }
        };

        tx.cart_items.findMany.mockResolvedValue([cartItem]);
        tx.orders.create.mockResolvedValue({ order_id: 1 });

        // Giả lập sản phẩm vừa bị người khác mua hết.
        tx.products.updateMany.mockResolvedValue({ count: 0 });

        await expect(
            orderService.placeOrder(userId, orderData)
        ).rejects.toMatchObject({
            statusCode: 409,
            message: "Sản phẩm không đủ tồn kho. Vui lòng tải lại giỏ hàng."
        });

        // Đã thử tạo đơn hàng nhưng transaction phải rollback.
        expect(tx.orders.create).toHaveBeenCalled();

        // Không tạo chi tiết đơn hàng.
        expect(tx.order_items.createMany).not.toHaveBeenCalled();

        // Không xóa giỏ hàng.
        expect(tx.cart_items.deleteMany).not.toHaveBeenCalled();

        // Không truy vấn lại đơn hàng.
        expect(tx.orders.findUnique).not.toHaveBeenCalled();
    });
    test("Hai phiên cùng đặt cuốn sách cuối cùng: chỉ một đơn thành công", async () => {
        let stock = 1;
        let orderId = 0;
        const committedOrders = [];

        const cartItem = {
            quantity: 1,
            products: {
                product_id: 1,
                product_name: "Sach lap trinh",
                price: new Prisma.Decimal("100000"),
                stock: 1
            }
        };

        // Mỗi phiên có transaction riêng nhưng dùng chung tồn kho.
        prisma.$transaction.mockImplementation(async (callback) => {
            const stagedOrders = [];

            const transaction = {
                cart_items: {
                    findMany: jest.fn().mockResolvedValue([cartItem]),
                    deleteMany: jest.fn().mockResolvedValue({ count: 1 })
                },
                orders: {
                    create: jest.fn().mockImplementation(async () => {
                        orderId++;
                        return { order_id: orderId };
                    }),
                    findUnique: jest.fn().mockImplementation(async ({ where }) => ({
                        order_id: where.order_id,
                        status: "pending"
                    }))
                },
                products: {
                    updateMany: jest.fn().mockImplementation(async ({ where, data }) => {
                        // Cập nhật tồn kho có điều kiện một cách nguyên tử.
                        if (stock >= where.stock.gte) {
                            stock -= data.stock.decrement;
                            return { count: 1 };
                        }
                        return { count: 0 };
                    })
                },
                order_items: {
                    createMany: jest.fn().mockResolvedValue({ count: 1 })
                }
            };

            const originalCreate = transaction.orders.create;

            transaction.orders.create = jest.fn(async (...args) => {
                const order = await originalCreate(...args);
                stagedOrders.push(order);
                return order;
            });

            const result = await callback(transaction);

            // Chỉ ghi nhận đơn nếu transaction thành công.
            committedOrders.push(...stagedOrders);

            return result;
        });

        const results = await Promise.allSettled([
            orderService.placeOrder(12, {
                ...orderData,
                receiver_name: "Nguyen Van A"
            }),
            orderService.placeOrder(13, {
                ...orderData,
                receiver_name: "Nguyen Van B"
            })
        ]);

        const success = results.filter(
            result => result.status === "fulfilled"
        );

        const failed = results.filter(
            result => result.status === "rejected"
        );

        expect(success).toHaveLength(1);
        expect(failed).toHaveLength(1);

        expect(failed[0].reason.statusCode).toBe(409);

        expect(committedOrders).toHaveLength(1);
        expect(stock).toBe(0);
        expect(stock).toBeGreaterThanOrEqual(0);
    });

});
