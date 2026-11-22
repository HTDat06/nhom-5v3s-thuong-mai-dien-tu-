
jest.mock("../src/Repositories/UserRepository", () => ({
    findByEmail: jest.fn(),
    create: jest.fn()
}));

jest.mock("bcryptjs", () => ({
    hash: jest.fn(),
    compare: jest.fn()
}));

jest.mock("jsonwebtoken", () => ({
    sign: jest.fn()
}));

const AuthService = require("../src/Services/AuthService");
const userRepository = require("../src/Repositories/UserRepository");
const bcrypt = require("bcryptjs");

describe("Unit Test - AuthService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        process.env.JWT_SECRET = "test_secret";
    });

    // Test 1: Đăng ký email đã tồn tại
    test("Đăng ký email trùng phải bị từ chối", async () => {
        userRepository.findByEmail.mockResolvedValue({
            user_id: 2,
            email: "customer1@gmail.com"
        });

        await expect(
            AuthService.register({
                name: "Nguyen Van A",
                email: "customer1@gmail.com",
                password: "123456"
            })
        ).rejects.toMatchObject({
            statusCode: 409,
            message: "Email này đã được đăng ký."
        });

        expect(userRepository.create).not.toHaveBeenCalled();
    });

    // Test 2: Đăng nhập tài khoản bị khóa
    test("Đăng nhập tài khoản LOCKED phải bị từ chối", async () => {
        userRepository.findByEmail.mockResolvedValue({
            user_id: 10,
            name: "Nguyen Van B",
            email: "customer10@gmail.com",
            password: "hashed_password",
            role: "customer",
            status: "LOCKED"
        });

        bcrypt.compare.mockResolvedValue(true);

        await expect(
            AuthService.login({
                email: "customer10@gmail.com",
                password: "123456"
            })
        ).rejects.toMatchObject({
            statusCode: 403
        });
    });
});
