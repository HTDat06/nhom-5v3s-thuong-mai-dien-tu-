const UserService = require("../src/Services/UserService");
const UserRepository = require("../src/Repositories/UserRepository");

// Giả lập Repository để không truy cập database thật
jest.mock("../src/Repositories/UserRepository", () => ({
    updateStatus: jest.fn()
}));

describe("Unit Test - UserService.updateUserStatus", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Test 1: Khóa tài khoản thành công
    test("Khóa tài khoản thành công: ACTIVE -> LOCKED", async () => {
        const mockUser = {
            user_id: 2,
            name: "Nguyen Van B",
            email: "user@gmail.com",
            role: "customer",
            status: "LOCKED"
        };

        UserRepository.updateStatus.mockResolvedValue(mockUser);

        const result = await UserService.updateUserStatus(
            2,
            "LOCKED",
            1
        );

        expect(UserRepository.updateStatus).toHaveBeenCalledWith(
            2,
            "LOCKED"
        );

        expect(result.status).toBe("LOCKED");
        expect(result).toEqual(mockUser);
    });

    // Test 2: Mở khóa tài khoản thành công
    test("Mở khóa tài khoản thành công: LOCKED -> ACTIVE", async () => {
        const mockUser = {
            user_id: 2,
            name: "Nguyen Van B",
            email: "user@gmail.com",
            role: "customer",
            status: "ACTIVE"
        };

        UserRepository.updateStatus.mockResolvedValue(mockUser);

        const result = await UserService.updateUserStatus(
            2,
            "ACTIVE",
            1
        );

        expect(UserRepository.updateStatus).toHaveBeenCalledWith(
            2,
            "ACTIVE"
        );

        expect(result.status).toBe("ACTIVE");
    });

    // Test 3: ID người dùng không hợp lệ
    test("Báo lỗi khi ID người dùng không hợp lệ", async () => {
        await expect(
            UserService.updateUserStatus(0, "LOCKED", 1)
        ).rejects.toMatchObject({
            message: "ID người dùng không hợp lệ",
            statusCode: 400
        });

        expect(UserRepository.updateStatus).not.toHaveBeenCalled();
    });

    // Test 4: Trạng thái tài khoản không hợp lệ
    test("Báo lỗi khi trạng thái không hợp lệ", async () => {
        await expect(
            UserService.updateUserStatus(2, "DISABLED", 1)
        ).rejects.toMatchObject({
            message: "Trạng thái tài khoản không hợp lệ",
            statusCode: 400
        });

        expect(UserRepository.updateStatus).not.toHaveBeenCalled();
    });

    // Test 5: Admin không được tự khóa tài khoản
    test("Không cho phép admin tự khóa tài khoản của mình", async () => {
        await expect(
            UserService.updateUserStatus(1, "LOCKED", 1)
        ).rejects.toMatchObject({
            message: "Không thể tự khóa tài khoản quản trị của mình",
            statusCode: 400
        });

        expect(UserRepository.updateStatus).not.toHaveBeenCalled();
    });

    // Test 6: Người dùng không tồn tại
    test("Báo lỗi 404 khi không tìm thấy người dùng", async () => {
        const prismaError = new Error("Record not found");
        prismaError.code = "P2025";

        UserRepository.updateStatus.mockRejectedValue(prismaError);

        await expect(
            UserService.updateUserStatus(999, "LOCKED", 1)
        ).rejects.toMatchObject({
            message: "Không tìm thấy người dùng",
            statusCode: 404
        });
    });

    // Test 7: Lỗi khác từ Repository được chuyển tiếp
    test("Chuyển tiếp lỗi không phải P2025 từ Repository", async () => {
        const repositoryError = new Error("Database connection error");

        UserRepository.updateStatus.mockRejectedValue(repositoryError);

        await expect(
            UserService.updateUserStatus(2, "LOCKED", 1)
        ).rejects.toThrow("Database connection error");
    });
});