# CHƯƠNG 6. CÀI ĐẶT

## 6.1. Cấu trúc thư mục mã nguồn

Dự án được chia thành hai phần chính:

**Frontend:**

- `components/`: Các thành phần giao diện dùng chung.
- `pages/`: Các trang chức năng.
- `context/`: Quản lý trạng thái dùng chung.
- `services/`: Giao tiếp với Backend thông qua API.

**Backend:**

- `Controllers/`: Tiếp nhận và xử lý request.
- `Services/`: Chứa logic nghiệp vụ.
- `Repositories/`: Truy vấn cơ sở dữ liệu.
- `Routes/`: Khai báo các API.
- `Middlewares/`: Xác thực, phân quyền và xử lý request.
- `config/`: Cấu hình kết nối.
- `prisma/`: Khai báo mô hình dữ liệu.
- `uploads/`: Lưu trữ hình ảnh tải lên.
- `tests/`: Chứa các file kiểm thử.

**Hình 6.1. Cấu trúc thư mục mã nguồn dự án**

## 6.2. Mẫu thiết kế áp dụng

Dự án áp dụng một số mẫu thiết kế và nguyên lý tổ chức mã nguồn:

**Repository Pattern:** Tách biệt truy vấn dữ liệu khỏi nghiệp vụ. Ví dụ: UserRepository, CartRepository và ProductRepository.

**Layered Architecture:** Chia Backend thành ba lớp Controller, Service và Repository để mỗi lớp đảm nhận một nhiệm vụ riêng.

**Middleware Pattern:** Sử dụng Middleware để xác thực JWT, kiểm tra quyền truy cập và xử lý dữ liệu trước khi đến Controller.

**Mock trong kiểm thử:** Sử dụng Jest Mock để giả lập Repository khi kiểm thử Service, giúp kiểm tra nghiệp vụ mà không cần truy cập cơ sở dữ liệu thật.

Các cách tổ chức này giúp mã nguồn dễ bảo trì, tái sử dụng và mở rộng.

## 6.3. Nghiệp vụ đặt hàng trong Transaction

### 6.3.1. Mục đích

Đặt hàng liên quan đến nhiều thao tác dữ liệu: tạo đơn hàng, tạo chi tiết đơn hàng, cập nhật tồn kho và xóa giỏ hàng.

Nếu một thao tác thất bại, các thao tác còn lại cũng cần được hủy để tránh dữ liệu không nhất quán. Vì vậy, hệ thống sử dụng Transaction.

### 6.3.2. Quy trình thực hiện

1. Kiểm tra thông tin người nhận.
2. Lấy giỏ hàng của người dùng.
3. Kiểm tra sản phẩm và tồn kho.
4. Tính tổng tiền.
5. Bắt đầu Transaction.
6. Tạo đơn hàng trong bảng Orders.
7. Tạo chi tiết đơn hàng trong Order_Items.
8. Cập nhật số lượng tồn kho.
9. Xóa giỏ hàng.
10. Commit nếu thành công; Rollback nếu xảy ra lỗi.

### 6.3.3. Mã giả

```text
FUNCTION placeOrder(userId, orderData):

    VALIDATE orderData

    cart = GET cart(userId)

    IF cart is empty:
        RETURN ERROR

    CHECK stock of all products

    IF stock is insufficient:
        RETURN ERROR

    BEGIN TRANSACTION SERIALIZABLE

        CREATE order with status "pending"

        FOR EACH item IN cart:
            UPDATE product stock
            WHERE stock >= item.quantity

            IF update fails:
                ROLLBACK
                RETURN ERROR

            CREATE order item

        DELETE user's cart

    COMMIT TRANSACTION
    RETURN SUCCESS

CATCH error:
    ROLLBACK
    RETURN ERROR
```

### 6.3.4. Phân tích độ phức tạp

Gọi \(n\) là số sản phẩm trong giỏ hàng.

- Kiểm tra sản phẩm và tồn kho: \(O(n)\).
- Tính tổng tiền: \(O(n)\).
- Cập nhật tồn kho và tạo chi tiết đơn hàng: \(O(n)\) thao tác dữ liệu.

Do đó, độ phức tạp xử lý trong bộ nhớ là:

\[
O(n)
\]

Độ phức tạp không gian phụ trợ là:

\[
O(n)
\]

Thời gian thực tế còn phụ thuộc vào tốc độ truy vấn cơ sở dữ liệu và số lượng giao dịch đồng thời.

### 6.3.5. Đảm bảo tính toàn vẹn dữ liệu

Transaction đảm bảo các thao tác đặt hàng được thực hiện đồng bộ. Nếu xảy ra lỗi, hệ thống Rollback để tránh tình trạng tạo đơn hàng thành công nhưng chưa cập nhật tồn kho hoặc đã xóa giỏ hàng khi đơn hàng chưa hoàn tất.

Mức cô lập `Serializable` kết hợp cập nhật tồn kho có điều kiện giúp hạn chế tình trạng nhiều người dùng cùng đặt mua vượt số lượng sản phẩm còn lại.

## 6.4. Bảo mật hệ thống

Hệ thống áp dụng các biện pháp bảo mật cơ bản:

- **Băm mật khẩu:** Sử dụng bcryptjs để băm mật khẩu trước khi lưu vào cơ sở dữ liệu.
- **Xác thực JWT:** Kiểm tra token trước khi cho phép truy cập API cần đăng nhập.
- **Phân quyền:** Phân biệt quyền người dùng và quản trị viên.
- **Kiểm tra quyền sở hữu:** Đảm bảo người dùng chỉ được xem hoặc hủy đơn hàng thuộc tài khoản của mình.
- **Chống SQL Injection:** Sử dụng Prisma ORM và kiểm tra dữ liệu đầu vào.
- **Hạn chế XSS/CSRF:** Kiểm soát dữ liệu hiển thị và cấu hình cơ chế xác thực phù hợp.
- **Khóa tài khoản:** AuthService từ chối đăng nhập nếu tài khoản không ở trạng thái `ACTIVE`.

**Kết luận chương 6**

Hệ thống được tổ chức theo kiến trúc phân lớp, áp dụng Repository Pattern và Middleware để nâng cao khả năng bảo trì. Nghiệp vụ đặt hàng sử dụng Transaction nhằm đảm bảo tính toàn vẹn dữ liệu, kiểm soát tồn kho và hạn chế lỗi khi nhiều người dùng đặt hàng đồng thời.
