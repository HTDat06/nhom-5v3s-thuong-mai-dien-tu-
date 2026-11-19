# Danh sách Test Cases – Website Thương mại điện tử Linh kiện Máy tính

## 1. Bộ Test Cases tổng quát (Mốc 1)

| Mã TC | Chức năng | Kịch bản & Bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Trạng thái |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-01** | TM-05 | 1. Chọn sản phẩm và bấm "Thêm vào giỏ hàng"<br>2. Thay đổi số lượng sản phẩm trong giỏ | Số lượng: `2` | Cập nhật đúng tổng tiền, lưu dữ liệu vào CSDL | PASS |
| **TC-02** | TM-05 | 1. Nhập số lượng sản phẩm vượt quá tồn kho<br>2. Bấm cập nhật giỏ hàng | Tồn kho: `5`<br>Nhập: `10` | Hiển thị thông báo lỗi, không cho phép mua vượt tồn kho | PASS |
| **TC-03** | TM-07 | 1. Truy cập trang "Đơn hàng của tôi"<br>2. Chọn đơn trạng thái "Chờ xác nhận"<br>3. Bấm "Hủy đơn" | Mã đơn: `DH101` | Hủy đơn hàng thành công và hệ thống hoàn lại tồn kho | PASS |
| **TC-04** | TM-13 | 1. Đăng nhập Admin ➔ Quản lý đơn hàng<br>2. Đổi "Chờ xác nhận" ➔ "Đang giao"<br>3. Thử đổi ngược lại về "Chờ xác nhận" | Mã đơn: `DH101` | Chuyển trạng thái thành công; hệ thống chặn không cho đi ngược quy trình | PASS |

---

## 2. TM-04: Đăng ký & Đăng nhập

| Mã TC | Tên Test Case | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Trạng thái |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-TM04-01** | Đăng ký tài khoản mới thành công | 1. Mở trang `/register`<br>2. Nhập email mới và mật khẩu hợp lệ<br>3. Bấm "Đăng ký" | Email mới hợp lệ, mật khẩu $\ge$ 6 ký tự | Tạo tài khoản thành công; mật khẩu lưu dưới CSDL được băm bằng Bcrypt (`$2b$10$...`) | PASS |
| **TC-TM04-02** | Đăng ký thất bại do trùng Email | 1. Nhập email đã tồn tại<br>2. Nhập các thông tin còn lại và bấm "Đăng ký" | Email: `user@gmail.com` (đã có trong DB) | Hệ thống báo lỗi "Email đã được sử dụng", không tạo bản ghi mới | PASS |
| **TC-TM04-03** | Đăng ký thất bại do mật khẩu yếu | 1. Nhập email hợp lệ<br>2. Nhập mật khẩu ngắn và bấm "Đăng ký" | Mật khẩu `< 6` ký tự | Báo lỗi validate ngay tại form Frontend/Backend | PASS |
| **TC-TM04-04** | Đăng nhập thành công | 1. Nhập đúng Email và Mật khẩu<br>2. Bấm "Đăng nhập" | Tài khoản hợp lệ trong CSDL | Chuyển hướng sang trang chủ/dashboard; không log plain-text password | PASS |
| **TC-TM04-05** | Đăng nhập thất bại do sai mật khẩu | 1. Nhập đúng Email nhưng sai Mật khẩu<br>2. Bấm "Đăng nhập" | Email đúng, mật khẩu sai | Báo lỗi chung "Email hoặc mật khẩu không chính xác" | PASS |

---

## 3. TM-05: Giỏ hàng

| Mã TC | Tên Test Case | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Trạng thái |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-TM05-01** | Thêm sản phẩm hợp lệ khi đã đăng nhập | 1. Đăng nhập tài khoản khách hàng<br>2. Bấm "Thêm vào giỏ" tại sản phẩm còn hàng | `productId` tồn tại, `qty = 1` | Thêm thành công, badge giỏ hàng trên Header tăng lên 1 | PASS |
| **TC-TM05-02** | Thêm trùng sản phẩm đã có trong giỏ | 1. Bấm thêm lần 2 cùng `productId` đã có trong giỏ | Cùng `productId`, `qty = 1` | Cộng dồn `quantity` trong bảng `cart_items`, không tạo dòng mới | PASS |
| **TC-TM05-03** | Thêm vào giỏ khi chưa đăng nhập | 1. Chưa đăng nhập<br>2. Bấm "Thêm vào giỏ" | Không có token JWT | Chặn thao tác, hiển thị thông báo và chuyển hướng sang `/login` | PASS |
| **TC-TM05-04** | Thêm số lượng âm hoặc bằng 0 | 1. Gọi API `POST /api/cart` hoặc nhập số lượng $\le 0$ | `qty = 0` hoặc `qty = -1` | API trả về lỗi `400 Bad Request`, không lưu vào DB | PASS |
| **TC-TM05-05** | Sửa/thêm vượt quá số lượng tồn kho | 1. Tăng hoặc nhập số lượng lớn hơn `stock` trong `/cart` | Tổng `qty > product.stock` | Chặn thao tác và báo lỗi vượt quá số lượng tồn kho hiện có | PASS |
| **TC-TM05-06** | Thêm sản phẩm đã hết hàng | 1. Xem sản phẩm có `stock = 0` hoặc gọi trực tiếp API | Sản phẩm có `stock = 0` | Nút "Hết hàng" bị vô hiệu hóa trên UI; API trả lỗi `400` | PASS |

---

## 4. TM-07: Đơn hàng của tôi

| Mã TC | Tên Test Case | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Trạng thái |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-TM07-01** | Xem danh sách đơn hàng của tôi | 1. Đăng nhập tài khoản khách hàng<br>2. Truy cập `/my-orders` | Token JWT của User A | Hiển thị đúng danh sách đơn của User A, sắp xếp đơn mới nhất lên đầu | PASS |
| **TC-TM07-02** | Xem chi tiết đơn hàng hợp lệ | 1. Tại `/my-orders`, bấm "Xem chi tiết" đơn của mình | `orderId` thuộc sở hữu User A | Hiển thị đầy đủ mã đơn, người nhận, SĐT, địa chỉ, trạng thái và sản phẩm | PASS |
| **TC-TM07-03** | Chặn xem đơn hàng của người khác (IDOR) | 1. Đang đăng nhập User A<br>2. Đổi `:id` trên URL `/my-orders/:id` sang mã đơn của User B | `orderId` thuộc về User B | API trả về lỗi `403 Forbidden`; giao diện chặn hiển thị và báo không có quyền | PASS |
| **TC-TM07-04** | Truy cập mã đơn hàng không tồn tại | 1. Đổi `:id` trên URL `/my-orders/:id` sang mã không có trong DB | `orderId = 99999` | API trả về lỗi `404 Not Found`; giao diện báo không tìm thấy đơn hàng | PASS |
| **TC-TM07-05** | Hủy đơn khi trạng thái "Chờ xác nhận" (`pending`) | 1. Chọn đơn có `status = "pending"`<br>2. Bấm "Hủy đơn hàng" và xác nhận | `orderId` đang `pending` | Đơn chuyển sang `"cancelled"`; số lượng `stock` của sản phẩm được hoàn lại trong `prisma.$transaction` | PASS |
| **TC-TM07-06** | Chặn hủy đơn đã xác nhận hoặc đã hủy | 1. Mở đơn có `status` khác `"pending"` (`confirmed`, `shipping`, `cancelled`) | `orderId` đã xử lý/đã hủy | Giao diện ẩn nút "Hủy đơn hàng"; gọi trực tiếp API trả lỗi `400 Bad Request` | PASS |