# CHƯƠNG 5. THIẾT KẾ HỆ THỐNG

## 5.1. Kiến trúc tổng thể và luồng request qua 3 lớp

### 5.1.1. Kiến trúc tổng thể

Hệ thống thương mại điện tử được xây dựng theo mô hình Client – Server, gồm:

- **Frontend:** ReactJS, xây dựng giao diện và tương tác với người dùng.
- **Backend:** Node.js và Express.js, xử lý các yêu cầu và nghiệp vụ.
- **Database:** SQL Server, lưu trữ dữ liệu.
- **ORM:** Prisma, hỗ trợ truy vấn và thao tác với cơ sở dữ liệu.

Backend được tổ chức theo kiến trúc ba lớp Controller – Service – Repository.

```text
Người dùng
    |
Frontend (ReactJS)
    |
HTTP Request / Response
    |
Backend (ExpressJS)
    |
Middleware
    |
Controller
    |
Service
    |
Repository
    |
Prisma ORM
    |
SQL Server
```

**Hình 5.1. Kiến trúc tổng thể hệ thống**

### 5.1.2. Chức năng của từng lớp

- **Controller:** Tiếp nhận request, lấy dữ liệu đầu vào, gọi Service và trả kết quả về Frontend.
- **Service:** Xử lý nghiệp vụ, kiểm tra dữ liệu và điều phối các thao tác liên quan.
- **Repository:** Thực hiện truy vấn, thêm, sửa, xóa dữ liệu thông qua Prisma.

Việc phân chia ba lớp giúp mã nguồn dễ quản lý, kiểm thử và mở rộng.

### 5.1.3. Luồng xử lý một request

Ví dụ với chức năng đăng nhập:

1. Người dùng nhập email và mật khẩu trên Frontend.
2. Frontend gửi POST request đến API đăng nhập.
3. AuthController tiếp nhận dữ liệu và gọi AuthService.
4. AuthService kiểm tra thông tin, trạng thái tài khoản và mật khẩu.
5. UserRepository truy vấn thông tin người dùng trong SQL Server thông qua Prisma.
6. Nếu hợp lệ, hệ thống tạo JWT và trả kết quả về Frontend.
7. Frontend hiển thị kết quả đăng nhập.

**Hình 5.2. Luồng xử lý request đăng nhập qua ba lớp**

## 5.3. Sequence Diagram – Luồng đặt hàng

### 5.3.1. Mô tả nghiệp vụ

Người dùng chọn sản phẩm, thêm vào giỏ hàng và nhập thông tin giao hàng. Sau đó, Frontend gửi yêu cầu đặt hàng đến Backend.

OrderService kiểm tra thông tin người nhận, giỏ hàng và tồn kho. Nếu hợp lệ, hệ thống thực hiện tạo đơn hàng, tạo chi tiết đơn hàng, cập nhật tồn kho và xóa giỏ hàng trong cùng một Transaction.

Đơn hàng được tạo với trạng thái ban đầu là `pending` (Chờ xác nhận).

### 5.3.2. Các bước xử lý

1. Frontend gửi request đặt hàng kèm JWT.
2. Middleware xác thực người dùng.
3. OrderController tiếp nhận thông tin và gọi OrderService.
4. OrderService kiểm tra dữ liệu giao hàng và giỏ hàng.
5. Hệ thống kiểm tra số lượng tồn kho.
6. Prisma thực hiện Transaction để tạo đơn hàng, chi tiết đơn hàng, cập nhật tồn kho và xóa giỏ hàng.
7. Nếu thành công, hệ thống Commit và trả kết quả.
8. Nếu xảy ra lỗi, hệ thống Rollback và trả thông báo lỗi.

**Hình 5.3. Sequence Diagram quy trình đặt hàng**

### 5.3.3. Xử lý đặt hàng đồng thời

Để tránh tình trạng hai người dùng cùng mua sản phẩm cuối cùng, hệ thống sử dụng Transaction với mức cô lập `Serializable` và cập nhật tồn kho có điều kiện.

Nếu tồn kho không đủ hoặc xảy ra xung đột giao dịch, hệ thống hủy Transaction. Trường hợp lỗi Prisma `P2034`, Backend trả về HTTP 409.

Cơ chế này giúp hạn chế bán vượt tồn kho và đảm bảo dữ liệu đơn hàng nhất quán.