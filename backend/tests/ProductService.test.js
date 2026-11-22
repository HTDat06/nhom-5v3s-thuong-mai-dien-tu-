
const { test } = require("node:test");
const assert = require("node:assert/strict");

const productRepository = require("../src/Repositories/ProductRepository");
const productService = require("../src/Services/ProductService");

// TC01: Kiểm tra lọc sản phẩm theo khoảng giá
test("ProductService.search - lọc sản phẩm theo khoảng giá", async () => {

    // Dữ liệu giả lập trả về từ Repository
    const mockProducts = [
        {
            product_id: 1,
            product_name: "RAM 16GB",
            price: 1000000
        },
        {
            product_id: 2,
            product_name: "SSD 512GB",
            price: 1500000
        },
        {
            product_id: 3,
            product_name: "CPU Ryzen 5",
            price: 4500000
        }
    ];

    // Lưu lại hàm gốc
    const originalFindAll = productRepository.findAll;

    let receivedOptions;

    try {
        // Mock Repository, không truy vấn database thật
        productRepository.findAll = async (options) => {
            receivedOptions = options;

            return {
                products: mockProducts,
                total: 3
            };
        };

        // Gọi hàm search với khoảng giá
        const result = await productService.search(
            "",           // keyword
            "",           // categoryId
            "1000000",    // minPrice
            "5000000",    // maxPrice
            "newest",     // sort
            1             // page
        );

        // Kiểm tra Repository nhận đúng khoảng giá
        assert.equal(receivedOptions.minPrice, 1000000);
        assert.equal(receivedOptions.maxPrice, 5000000);

        // Kiểm tra kết quả trả về
        assert.equal(result.products.length, 3);

        // Kiểm tra tên các sản phẩm
        assert.deepEqual(
            result.products.map(product => product.product_name),
            ["RAM 16GB", "SSD 512GB", "CPU Ryzen 5"]
        );

        // Kiểm tra thông tin phân trang
        assert.equal(result.pagination.currentPage, 1);
        assert.equal(result.pagination.limit, 12);
        assert.equal(result.pagination.totalProducts, 3);
        assert.equal(result.pagination.totalPages, 1);

    } finally {
        // Khôi phục Repository sau khi test
        productRepository.findAll = originalFindAll;
    }
});


// TC02: Kiểm tra khoảng giá không hợp lệ
test("ProductService.search - báo lỗi khi giá thấp nhất lớn hơn giá cao nhất", async () => {

    const originalFindAll = productRepository.findAll;

    try {
        let repositoryCalled = false;

        productRepository.findAll = async () => {
            repositoryCalled = true;

            return {
                products: [],
                total: 0
            };
        };

        // Kiểm tra hàm search có phát sinh lỗi
        await assert.rejects(
            productService.search(
                "",
                "",
                5000000,
                1000000,
                "newest",
                1
            ),
            {
                message: "Giá thấp nhất không được lớn hơn giá cao nhất.",
                statusCode: 400
            }
        );

        // Repository không được gọi khi khoảng giá sai
        assert.equal(repositoryCalled, false);

    } finally {
        productRepository.findAll = originalFindAll;
    }
});
