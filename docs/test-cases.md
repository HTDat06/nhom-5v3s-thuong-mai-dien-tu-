# Danh sách Test Cases – Website Thương mại điện tử Linh kiện Máy tính

## Tổng quan 12 chức năng bắt buộc (Release v0.5)

| STT | Mã chức năng | Tên chức năng | Số lượng TC | Trạng thái |
| :---: | :--- | :--- | :---: | :---: |
| 1 | **TM-01** | Trang chủ | 3 | PASS |
| 2 | **TM-02** | Danh sách, tìm kiếm, lọc và phân trang sản phẩm | 4 | PASS |
| 3 | **TM-03** | Xem chi tiết sản phẩm | 3 | PASS |
| 4 | **TM-04** | Đăng ký & Đăng nhập | 5 | PASS |
| 5 | **TM-05** | Giỏ hàng | 6 | PASS |
| 6 | **TM-06** | Đặt hàng (Checkout) | 4 | PASS |
| 7 | **TM-07** | Đơn hàng của tôi | 6 | PASS |
| 8 | **TM-08** | Hồ sơ cá nhân | 3 | PASS |
| 9 | **TM-09 / TM-10** | Phân quyền truy cập & Dashboard Admin | 3 | PASS |
| 10 | **TM-11** | Quản lý danh mục (Admin) | 3 | PASS |
| 11 | **TM-12** | Quản lý sản phẩm (Admin) | 4 | PASS |
| 12 | **TM-13** | Quản lý đơn hàng (Admin) | 6 | PASS |

---

## 1. Bộ Test Cases tổng quát (Mốc 1)

| Mã TC | Chức năng | Kịch bản & Bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Trạng thái |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-01** | TM-05 | 1. Chọn sản phẩm và bấm "Thêm vào giỏ hàng"<br>2. Thay đổi số lượng sản phẩm trong giỏ | Số lượng: `2` | Cập nhật đúng tổng tiền, lưu dữ liệu vào CSDL | PASS |
| **TC-02** | TM-05 | 1. Nhập số lượng sản phẩm vượt quá tồn kho<br>2. Bấm cập nhật giỏ hàng | Tồn kho: `5`<br>Nhập: `10` | Hiển thị thông báo lỗi, không cho phép mua vượt tồn kho | PASS |
| **TC-03** | TM-07 | 1. Truy cập trang "Đơn hàng của tôi"<br>2. Chọn đơn trạng thái "Chờ xác nhận"<br>3. Bấm "Hủy đơn" | Mã đơn: `DH101` | Hủy đơn hàng thành công và hệ thống hoàn lại tồn kho | PASS |
| **TC-04** | TM-13 | 1. Đăng nhập Admin ➔ Quản lý đơn hàng<br>2. Đổi "Chờ xác nhận" ➔ "Đang giao"<br>3. Thử đổi ngược lại về "Chờ xác nhận" | Mã đơn: `DH101` | Chuyển trạng thái thành công; hệ thống chặn không cho đi ngược quy trình | PASS |

---

## 2. TM-01: Trang chủ

| Mã TC | Tên Test Case | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Trạng thái |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-TM01-01** | Hiển thị giao diện và danh sách sản phẩm trang chủ | 1. Mở trình duyệt và truy cập `/` | Không cần đăng nhập | Hiển thị đầy đủ Header, Banner, danh mục và danh sách sản phẩm từ CSDL | PASS |
| **TC-TM01-02** | Điều hướng từ sản phẩm trang chủ sang trang chi tiết | 1. Tại trang chủ `/`, bấm vào tên hoặc thẻ sản phẩm bất kỳ | `product_id = 1` | Chuyển hướng đúng sang trang `/products/1` | PASS |
| **TC-TM01-03** | Tìm kiếm nhanh từ thanh Header trang chủ | 1. Nhập từ khóa vào ô tìm kiếm trên Header<br>2. Bấm nút "Tìm kiếm" | Từ khóa: `RTX` | Chuyển hướng sang `/products?search=RTX` và hiển thị kết quả tương ứng | PASS |

---

## 3. TM-02: Danh sách, tìm kiếm, lọc và phân trang sản phẩm

| Mã TC | Tên Test Case | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Trạng thái |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-TM02-01** | Tìm kiếm sản phẩm theo từ khóa tên hoặc mô tả | 1. Truy cập `/products`<br>2. Nhập từ khóa vào thanh tìm kiếm và bấm tìm | `search = "RAM"` | API `GET /api/products?search=RAM` trả về đúng các sản phẩm chứa từ khóa | PASS |
| **TC-TM02-02** | Lọc sản phẩm theo danh mục và khoảng giá | 1. Chọn danh mục trong dropdown<br>2. Nhập giá thấp nhất và giá cao nhất | `category_id = 1`, `min_price = 1000000`, `max_price = 5000000` | Chỉ hiển thị sản phẩm thuộc danh mục đã chọn và có giá nằm trong khoảng hợp lệ | PASS |
| **TC-TM02-03** | Sắp xếp sản phẩm theo giá tăng dần / giảm dần | 1. Chọn tiêu chí trong ô "Sắp xếp" | `sort = "price_asc"` hoặc `"price_desc"` | Danh sách sản phẩm được sắp xếp đúng thứ tự giá tăng hoặc giảm dần | PASS |
| **TC-TM02-04** | Phân trang danh sách sản phẩm (12 sản phẩm/trang) | 1. Truy cập `/products` khi CSDL có $> 12$ sản phẩm<br>2. Bấm chuyển sang "Trang 2" hoặc "Trang sau" | `page = 2`, `limit = 12` | Hiển thị đúng 12 sản phẩm mỗi trang, giữ nguyên bộ lọc hiện tại khi đổi trang | PASS |

---

## 4. TM-03: Xem chi tiết sản phẩm

| Mã TC | Tên Test Case | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Trạng thái |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-TM03-01** | Xem chi tiết sản phẩm tồn tại | 1. Truy cập `/products/:id` với ID sản phẩm hợp lệ | `product_id = 1` | Hiển thị đầy đủ ảnh, tên, danh mục, giá bán, số lượng tồn kho và mô tả chi tiết | PASS |
| **TC-TM03-02** | Truy cập ID sản phẩm không tồn tại | 1. Truy cập `/products/99999` hoặc gọi `GET /api/products/99999` | `product_id = 99999` | API trả về lỗi `404 Not Found` ("Không tìm thấy sản phẩm."); giao diện thông báo lỗi rõ ràng | PASS |
| **TC-TM03-03** | Thêm vào giỏ hàng từ trang chi tiết sản phẩm | 1. Đăng nhập tài khoản khách hàng<br>2. Mở `/products/:id`, chọn số lượng $\le$ tồn kho và bấm "Thêm vào giỏ" | `product_id = 1`, `quantity = 2` | Thêm sản phẩm vào giỏ thành công và cập nhật số lượng trên Header | PASS |

---

## 5. TM-04: Đăng ký & Đăng nhập

| Mã TC | Tên Test Case | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Trạng thái |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-TM04-01** | Đăng ký tài khoản mới thành công | 1. Mở trang `/register`<br>2. Nhập email mới và mật khẩu hợp lệ<br>3. Bấm "Đăng ký" | Email mới hợp lệ, mật khẩu $\ge$ 6 ký tự | Tạo tài khoản thành công; mật khẩu lưu dưới CSDL được băm bằng Bcrypt (`$2b$10$...`) | PASS |
| **TC-TM04-02** | Đăng ký thất bại do trùng Email | 1. Nhập email đã tồn tại<br>2. Nhập các thông tin còn lại và bấm "Đăng ký" | Email: `user@gmail.com` (đã có trong DB) | Hệ thống báo lỗi "Email đã được sử dụng", không tạo bản ghi mới | PASS |
| **TC-TM04-03** | Đăng ký thất bại do mật khẩu yếu | 1. Nhập email hợp lệ<br>2. Nhập mật khẩu ngắn và bấm "Đăng ký" | Mật khẩu `< 6` ký tự | Báo lỗi validate ngay tại form Frontend/Backend | PASS |
| **TC-TM04-04** | Đăng nhập thành công | 1. Nhập đúng Email và Mật khẩu<br>2. Bấm "Đăng nhập" | Tài khoản hợp lệ trong CSDL | Chuyển hướng sang trang chủ/dashboard; không log plain-text password | PASS |
| **TC-TM04-05** | Đăng nhập thất bại do sai mật khẩu | 1. Nhập đúng Email nhưng sai Mật khẩu<br>2. Bấm "Đăng nhập" | Email đúng, mật khẩu sai | Báo lỗi chung "Email hoặc mật khẩu không chính xác" | PASS |

---

## 6. TM-05: Giỏ hàng

| Mã TC | Tên Test Case | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Trạng thái |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-TM05-01** | Thêm sản phẩm hợp lệ khi đã đăng nhập | 1. Đăng nhập tài khoản khách hàng<br>2. Bấm "Thêm vào giỏ" tại sản phẩm còn hàng | `productId` tồn tại, `qty = 1` | Thêm thành công, badge giỏ hàng trên Header tăng lên 1 | PASS |
| **TC-TM05-02** | Thêm trùng sản phẩm đã có trong giỏ | 1. Bấm thêm lần 2 cùng `productId` đã có trong giỏ | Cùng `productId`, `qty = 1` | Cộng dồn `quantity` trong bảng `cart_items`, không tạo dòng mới | PASS |
| **TC-TM05-03** | Thêm vào giỏ khi chưa đăng nhập | 1. Chưa đăng nhập<br>2. Bấm "Thêm vào giỏ" | Không có token JWT | Chặn thao tác, hiển thị thông báo và chuyển hướng sang `/login` | PASS |
| **TC-TM05-04** | Thêm số lượng âm hoặc bằng 0 | 1. Gọi API `POST /api/cart` hoặc nhập số lượng $\le 0$ | `qty = 0` hoặc `qty = -1` | API trả về lỗi `400 Bad Request`, không lưu vào DB | PASS |
| **TC-TM05-05** | Sửa/thêm vượt quá số lượng tồn kho | 1. Tăng hoặc nhập số lượng lớn hơn `stock` trong `/cart` | Tổng `qty > product.stock` | Chặn thao tác và báo lỗi vượt quá số lượng tồn kho hiện có | PASS |
| **TC-TM05-06** | Thêm sản phẩm đã hết hàng | 1. Xem sản phẩm có `stock = 0` hoặc gọi trực tiếp API | Sản phẩm có `stock = 0` | Nút "Hết hàng" bị vô hiệu hóa trên UI; API trả lỗi `400` | PASS |

---

## 7. TM-06: Đặt hàng (Checkout)

| Mã TC | Tên Test Case | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Trạng thái |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-TM06-01** | Đặt hàng thành công từ giỏ hàng | 1. Đăng nhập tài khoản có sản phẩm trong giỏ<br>2. Vào trang thanh toán, nhập đầy đủ người nhận, SĐT, địa chỉ<br>3. Bấm "Đặt hàng" | `receiver_name`, `phone`, `shipping_address` hợp lệ | Tạo đơn trạng thái `pending`, trừ `stock` sản phẩm tương ứng và xóa sạch giỏ hàng trong transaction | PASS |
| **TC-TM06-02** | Đặt hàng thất bại khi thiếu thông tin giao hàng | 1. Bỏ trống tên người nhận, SĐT hoặc địa chỉ giao hàng<br>2. Bấm "Đặt hàng" | `shipping_address = ""` hoặc `phone = ""` | Báo lỗi validate `400 Bad Request`, không tạo đơn hàng | PASS |
| **TC-TM06-03** | Chặn đặt hàng khi giỏ hàng trống | 1. Tài khoản có giỏ hàng rỗng gọi API `POST /api/orders` | `cart_items` rỗng | Hệ thống từ chối đặt hàng và trả về thông báo giỏ hàng trống | PASS |
| **TC-TM06-04** | Chặn đặt hàng nếu tồn kho vừa thay đổi không đủ | 1. Sản phẩm trong giỏ có `quantity > product.stock` tại thời điểm đặt<br>2. Bấm "Đặt hàng" | `quantity = 5`, `stock = 2` | Rollback transaction, báo lỗi không đủ tồn kho và không trừ âm kho | PASS |

---

## 8. TM-07: Đơn hàng của tôi

| Mã TC | Tên Test Case | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Trạng thái |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-TM07-01** | Xem danh sách đơn hàng của tôi | 1. Đăng nhập tài khoản khách hàng<br>2. Truy cập `/my-orders` | Token JWT của User A | Hiển thị đúng danh sách đơn của User A, sắp xếp đơn mới nhất lên đầu | PASS |
| **TC-TM07-02** | Xem chi tiết đơn hàng hợp lệ | 1. Tại `/my-orders`, bấm "Xem chi tiết" đơn của mình | `orderId` thuộc sở hữu User A | Hiển thị đầy đủ mã đơn, người nhận, SĐT, địa chỉ, trạng thái và sản phẩm | PASS |
| **TC-TM07-03** | Chặn xem đơn hàng của người khác (IDOR) | 1. Đang đăng nhập User A<br>2. Đổi `:id` trên URL `/my-orders/:id` sang mã đơn của User B | `orderId` thuộc về User B | API trả về lỗi `403 Forbidden`; giao diện chặn hiển thị và báo không có quyền | PASS |
| **TC-TM07-04** | Truy cập mã đơn hàng không tồn tại | 1. Đổi `:id` trên URL `/my-orders/:id` sang mã không có trong DB | `orderId = 99999` | API trả về lỗi `404 Not Found`; giao diện báo không tìm thấy đơn hàng | PASS |
| **TC-TM07-05** | Hủy đơn khi trạng thái "Chờ xác nhận" (`pending`) | 1. Chọn đơn có `status = "pending"`<br>2. Bấm "Hủy đơn hàng" và xác nhận | `orderId` đang `pending` | Đơn chuyển sang `"cancelled"`; số lượng `stock` của sản phẩm được hoàn lại trong `prisma.$transaction` | PASS |
| **TC-TM07-06** | Chặn hủy đơn đã xác nhận hoặc đã hủy | 1. Mở đơn có `status` khác `"pending"` (`shipping`, `completed`, `cancelled`) | `orderId` đã xử lý/đã hủy | Giao diện ẩn nút "Hủy đơn hàng"; gọi trực tiếp API trả lỗi `400 Bad Request` | PASS |

---

## 9. TM-08: Hồ sơ cá nhân

| Mã TC | Tên Test Case | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Trạng thái |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-TM08-01** | Xem thông tin hồ sơ cá nhân | 1. Đăng nhập tài khoản khách hàng<br>2. Truy cập trang hồ sơ `/profile` | Token JWT hợp lệ | Hiển thị đúng họ tên, email, số điện thoại và địa chỉ của tài khoản đang đăng nhập | PASS |
| **TC-TM08-02** | Cập nhật thông tin hồ sơ cá nhân thành công | 1. Tại `/profile`, chỉnh sửa họ tên, SĐT, địa chỉ<br>2. Bấm "Lưu thay đổi" | `name`, `phone`, `address` hợp lệ | Cập nhật thành công vào CSDL, hiển thị thông báo và cập nhật tên trên Header | PASS |
| **TC-TM08-03** | Chặn cập nhật hồ sơ với dữ liệu không hợp lệ | 1. Xóa trống họ tên hoặc nhập số điện thoại sai định dạng<br>2. Bấm "Lưu thay đổi" | `name = ""` hoặc `phone = "abc"` | Hệ thống báo lỗi validate `400 Bad Request` và không ghi đè dữ liệu sai | PASS |

---

## 10. TM-09 / TM-10: Phân quyền truy cập & Dashboard Admin

| Mã TC | Tên Test Case | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Trạng thái |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-TM09-01** | Chặn người dùng chưa đăng nhập vào trang `/admin` | 1. Không đăng nhập<br>2. Truy cập trực tiếp URL `/admin` | Không có token JWT | Chuyển hướng ngay về trang đăng nhập `/login` | PASS |
| **TC-TM09-02** | Chặn tài khoản `customer` truy cập trang `/admin` | 1. Đăng nhập bằng tài khoản khách hàng (`role = "customer"`)<br>2. Truy cập `/admin` | Token JWT của `customer` | Chặn truy cập khu vực quản trị, điều hướng về trang chủ `/` | PASS |
| **TC-TM10-01** | Hiển thị Dashboard Admin và ẩn chức năng mua hàng | 1. Đăng nhập tài khoản Admin (`role = "admin"`)<br>2. Truy cập `/admin` | Token JWT của `admin` | Hiển thị đầy đủ menu Quản lý danh mục, Quản lý sản phẩm, Quản lý đơn hàng; Header ẩn Giỏ hàng và Đơn hàng của tôi | PASS |

---

## 11. TM-11: Quản lý danh mục (Admin)

| Mã TC | Tên Test Case | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Trạng thái |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-TM11-01** | Thêm mới danh mục sản phẩm | 1. Đăng nhập Admin ➔ Quản lý danh mục<br>2. Nhập tên danh mục mới và bấm "Thêm" | `category_name = "Nguồn máy tính (PSU)"` | Tạo danh mục mới thành công trong bảng `categories` và hiển thị ngay trên danh sách | PASS |
| **TC-TM11-02** | Cập nhật tên danh mục | 1. Bấm nút "Sửa" tại danh mục đã có<br>2. Đổi tên mới và bấm "Lưu" | `category_id = 1`, `category_name = "CPU - Vi xử lý"` | Cập nhật thành công tên danh mục trong CSDL | PASS |
| **TC-TM11-03** | Chặn xóa danh mục đang có sản phẩm | 1. Bấm "Xóa" danh mục đang chứa sản phẩm | `category_id` có liên kết khóa ngoại trong `products` | Hệ thống từ chối xóa, báo lỗi ràng buộc dữ liệu và giữ nguyên danh mục | PASS |

---

## 12. TM-12: Quản lý sản phẩm (Admin)

| Mã TC | Tên Test Case | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Trạng thái |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-TM12-01** | Thêm mới sản phẩm kèm tải ảnh đại diện | 1. Đăng nhập Admin ➔ Quản lý sản phẩm<br>2. Nhập đầy đủ thông tin, chọn ảnh hợp lệ và bấm "Thêm" | `product_name`, `price = 2500000`, `stock = 10`, `category_id = 1`, file ảnh `.jpg` | Lưu ảnh vào `/uploads/products`, tạo sản phẩm mới thành công và hiển thị ngoài trang chủ | PASS |
| **TC-TM12-02** | Validate giá âm hoặc thiếu ảnh khi tạo sản phẩm | 1. Nhập `price <= 0` hoặc không chọn ảnh đại diện<br>2. Bấm "Thêm" | `price = 0` hoặc không đính kèm `file` | API trả lỗi `400 Bad Request` kèm thông báo validate cụ thể | PASS |
| **TC-TM12-03** | Cập nhật thông tin và trạng thái ẩn/hiện sản phẩm | 1. Sửa giá/tồn kho hoặc bấm chuyển trạng thái `is_active` của sản phẩm | `product_id = 1`, `is_active = false` | Cập nhật thành công trong CSDL; sản phẩm ẩn không hiển thị cho khách mua | PASS |
| **TC-TM12-04** | Chặn xóa sản phẩm đang nằm trong giỏ hàng hoặc đơn hàng | 1. Bấm "Xóa" sản phẩm đã từng được đặt mua hoặc đang nằm trong giỏ | `product_id` có bản ghi trong `order_items` / `cart_items` | API trả lỗi `409 Conflict` ("Không thể xóa sản phẩm vì sản phẩm đang có trong giỏ hàng hoặc đơn hàng...") | PASS |