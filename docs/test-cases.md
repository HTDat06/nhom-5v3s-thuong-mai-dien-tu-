| ID | Mã chức năng | Bước thực hiện | Dữ liệu | Kết quả mong đợi | Kết quả thực tế |
| :--- | :--- | :--- | :--- | :--- | :--- |
| TC01 | TM-05 | 1. Chọn sản phẩm và bấm "Thêm vào giỏ hàng"<br>2. Thay đổi số lượng sản phẩm trong giỏ | Số lượng: `2` | Cập nhật đúng tổng tiền, lưu dữ liệu vào CSDL | Đạt (Pass) |
| TC02 | TM-05 | 1. Nhập số lượng sản phẩm vượt quá số lượng tồn kho<br>2. Bấm cập nhật giỏ hàng | Tồn kho: `5`<br>Nhập: `10` | Hiển thị thông báo lỗi, không cho phép mua vượt tồn kho | Đạt (Pass) |
| TC03 | TM-07 | 1. Truy cập trang "Đơn hàng của tôi"<br>2. Chọn đơn hàng có trạng thái "Chờ xác nhận"<br>3. Bấm "Hủy đơn" | Mã đơn: `DH101` | Hủy đơn hàng thành công và hệ thống hoàn lại tồn kho | Đạt (Pass) |
| TC04 | TM-13 | 1. Đăng nhập Admin ➔ Vào trang Quản lý đơn hàng<br>2. Đổi trạng thái từ "Chờ xác nhận" ➔ "Đang giao"<br>3. Thử đổi ngược lại về "Chờ xác nhận" | Mã đơn: `DH101` | Chuyển trạng thái thành công; hệ thống chặn không cho đi ngược quy trình | Đạt (Pass) |

## TM-04: Đăng ký & Đăng nhập

| Mã TC | Tên Test Case | Điều kiện tiên quyết | Các bước thực hiện | Kết quả mong đợi | Trạng thái |
| --- | --- | --- | --- | --- | --- |
| **TC_TM04_01** | Đăng ký tài khoản mới thành công | Trình duyệt mở trang `/register` | 1. Nhập email mới hợp lệ.<br>2. Nhập mật khẩu đủ độ dài.<br>3. Bấm "Đăng ký". | - Tạo tài khoản thành công.<br>- Mật khẩu lưu dưới CSDL được băm bằng Bcrypt (`$2b$10$...`). | PASS |
| **TC_TM04_02** | Đăng ký thất bại do trùng Email | Đã có tài khoản `user@gmail.com` | 1. Nhập email `user@gmail.com`.<br>2. Nhập các thông tin còn lại.<br>3. Bấm "Đăng ký". | - Hệ thống báo lỗi: "Email đã được sử dụng".<br>- Không tạo mới record trong CSDL. | PASS |
| **TC_TM04_03** | Đăng ký thất bại do mật khẩu yếu | Trình duyệt mở trang `/register` | 1. Nhập email hợp lệ.<br>2. Nhập mật khẩu ngắn (< 6 ký tự).<br>3. Bấm "Đăng ký". | - Báo lỗi validate ngay tại form front-end/back-end.<br>- Nút bấm bị vô hiệu hóa hoặc báo lỗi rõ ràng. | PASS |
| **TC_TM04_04** | Đăng nhập thành công | Đã có tài khoản trong CSDL | 1. Nhập đúng Email và Mật khẩu.<br>2. Bấm "Đăng nhập". | - Chuyển hướng sang trang chủ/dashboard.<br>- Luồng đăng nhập không log plain-text password ra console. | PASS |
| **TC_TM04_05** | Đăng nhập thất bại do sai Mật khẩu | Đã có tài khoản trong CSDL | 1. Nhập đúng Email nhưng sai Mật khẩu.<br>2. Bấm "Đăng nhập". | - Báo lỗi chung: "Email hoặc mật khẩu không chính xác" (tránh lộ thông tin dò quét). | PASS |

## TM-05: Thêm sản phẩm vào giỏ hàng
| Mã TC | Kịch bản kiểm thử | Dữ liệu đầu vào | Kết quả mong đợi |
| :--- | :--- | :--- | :--- |
| TC-CART-01 | Thêm sản phẩm hợp lệ khi đã đăng nhập | `productId` tồn tại, `qty = 1` | Thêm thành công, badge giỏ hàng trên Header tăng lên 1 |
| TC-CART-02 | Thêm trùng sản phẩm đã có trong giỏ | Bấm thêm lần 2 cùng `productId` | Cộng dồn `quantity` trong bảng `cart_items`, không tạo dòng mới |
| TC-CART-03 | Thêm vào giỏ khi chưa đăng nhập | Chưa có token JWT | Chặn thao tác, hiển thị thông báo và chuyển hướng sang `/login` |
| TC-CART-04 | Thêm số lượng âm hoặc bằng 0 | `qty = 0` hoặc `qty = -1` | API trả về lỗi `400 Bad Request`, không lưu vào DB |
| TC-CART-05 | Thêm vượt quá số lượng tồn kho | Tổng `qty > product.stock` | API trả về lỗi `400`, báo vượt quá số lượng tồn kho hiện có |
| TC-CART-06 | Thêm sản phẩm đã hết hàng | Sản phẩm có `stock = 0` | Nút "Hết hàng" bị vô hiệu hóa trên UI; API trả lỗi `400` nếu gọi trực tiếp |
