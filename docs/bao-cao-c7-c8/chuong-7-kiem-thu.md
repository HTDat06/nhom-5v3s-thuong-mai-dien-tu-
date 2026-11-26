
# CHƯƠNG 7: KIỂM THỬ HỆ THỐNG

## 7.1. Kế hoạch kiểm thử (Test Plan)

### 7.1.1. Mục tiêu kiểm thử

Quá trình kiểm thử được triển khai nhằm xác minh tính đúng đắn, ổn định và an toàn dữ liệu của website thương mại điện tử linh kiện máy tính trước khi bàn giao:

* Đảm bảo toàn bộ 14 nhóm chức năng nghiệp vụ (`TM-01` đến `TM-14`) vận hành đúng theo đặc tả yêu cầu, từ khâu đăng ký/đăng nhập, quản lý giỏ hàng, đặt hàng cho đến quy trình giao nhận và hậu mãi.
* Đảm bảo tính toàn vẹn dữ liệu tồn kho (`stock`) trong cơ sở dữ liệu SQL Server khi phát sinh các giao dịch đặt hàng đồng thời, hủy đơn hoặc hoàn trả hàng.
* Kiểm soát chặt chẽ cơ chế phân quyền giữa Khách hàng (`customer`) và Quản trị viên (`admin`), ngăn chặn các lỗ hổng truy cập trái phép dữ liệu người dùng khác (IDOR) hoặc thao tác sai quy trình trạng thái đơn hàng.

### 7.1.2. Phạm vi và loại hình kiểm thử

* **Kiểm thử chức năng (Functional Testing):** Kiểm thử hộp đen trên giao diện người dùng và API cho toàn bộ luồng mua sắm, quản lý đơn hàng và quản trị danh mục/sản phẩm.
* **Kiểm thử đơn vị và tích hợp (Unit & Integration Testing):** Kiểm thử tự động tầng nghiệp vụ (`Service`) và các điểm cuối API (`Endpoint`) tại Backend.
* **Kiểm thử đầu cuối (End-to-End Testing):** Mô phỏng trọn vẹn vòng đời một đơn hàng thực tế: *Khách đặt hàng → Admin giao hàng → Hoàn thành → Khách xác nhận nhận hàng / Gửi yêu cầu trả hàng kèm bằng chứng → Admin xét duyệt thu hồi & hoàn tiền*.
* **Kiểm thử chéo (Cross-Testing):** Các thành viên kiểm thử chéo các module do thành viên khác phát triển trên nhánh tích hợp `develop` và ghi nhận lỗi qua GitHub Issues kết hợp Trello.

### 7.1.3. Môi trường kiểm thử

* **Hệ quản trị cơ sở dữ liệu:** Microsoft SQL Server (kết nối thông qua Prisma ORM).
* **Máy chủ Backend:** Node.js, ExpressJS (chạy tại cổng `5000`, hỗ trợ upload tệp bằng chứng qua `multer`).
* **Ứng dụng Frontend:** ReactJS (Vite, chạy tại `http://localhost:5173`).
* **Công cụ kiểm thử & quản lý:** Jest, Supertest, Postman, trình duyệt Google Chrome / Microsoft Edge, GitHub Issues và Trello.

---

## 7.2. Bảng Test Case và Kết quả thực hiện

Dưới đây là tổng hợp các kịch bản kiểm thử trọng tâm, tập trung vào việc khắc phục các lỗi tồn đọng của nhóm chức năng Giỏ hàng (`TM-05`), Đơn hàng của khách (`TM-07`) và Quản lý đơn hàng của Admin (`TM-13`):

| Mã TC | Phân hệ | Tên kịch bản kiểm thử | Các bước thực hiện | Kết quả mong đợi | Kết quả thực tế | Đánh giá |
| --- | --- | --- | --- | --- | --- | --- |
| **TC-TM05-01** | Giỏ hàng (`TM-05`) | Thêm sản phẩm vượt quá số lượng tồn kho | 1. Chọn sản phẩm có `stock = 5`.<br>

<br>2. Nhập số lượng `6` và bấm thêm vào giỏ. | Hệ thống từ chối thêm vào giỏ và hiển thị cảnh báo vượt quá tồn kho hiện có. | Hiển thị thông báo lỗi đúng quy định, không ghi dữ liệu sai vào bảng `cart_items`. | **PASS** |
| **TC-TM05-02** | Giỏ hàng (`TM-05`) | Cập nhật số lượng trong giỏ về `0` hoặc số âm | 1. Mở trang Giỏ hàng.<br>

<br>2. Giảm số lượng sản phẩm xuống `0` hoặc nhập `-1`. | Tự động xóa sản phẩm khỏi giỏ (nếu bằng `0`) hoặc báo lỗi dữ liệu không hợp lệ (nếu số âm). | Xử lý chính xác, tổng tiền giỏ hàng được tính lại tức thời. | **PASS** |
| **TC-TM07-01** | Đặt hàng (`TM-07`) | Đặt hàng hợp lệ và trừ tồn kho giao dịch | 1. Nhập đầy đủ thông tin nhận hàng.<br>

<br>2. Bấm xác nhận đặt hàng. | Tạo đơn ở trạng thái `pending`, trừ đúng `stock` trong `prisma.$transaction`, làm rỗng giỏ hàng. | Đơn hàng được tạo thành công, tồn kho giảm chính xác. | **PASS** |
| **TC-TM07-02** | Hủy đơn (`TM-07`) | Khách hàng hủy đơn đang chờ xác nhận | 1. Vào "Đơn hàng của tôi".<br>

<br>2. Bấm "Hủy đơn hàng" tại đơn có trạng thái `pending`. | Đơn chuyển sang `cancelled`, số lượng `stock` của từng sản phẩm được cộng trả lại kho. | Đơn hủy thành công và tồn kho được hoàn lại đầy đủ. | **PASS** |
| **TC-TM07-03** | Giao hàng (`TM-07`) | Chặn hủy đơn khi đơn đang được vận chuyển | 1. Admin chuyển đơn sang `shipping`.<br>

<br>2. Khách mở lại trang đơn hàng và thử gửi API hủy. | Nút "Hủy đơn hàng" bị ẩn trên giao diện; API trả mã lỗi `400` nếu gọi trực tiếp. | Giao diện ẩn nút hủy, API chặn thành công với thông báo rõ ràng. | **PASS** |
| **TC-TM07-04** | Nhận hàng (`TM-07`) | Khách hàng xác nhận đã nhận hàng | 1. Admin chuyển đơn sang `completed`.<br>

<br>2. Khách bấm nút "Đã nhận hàng". | Cập nhật `customer_confirmed = true`, lưu mốc thời gian `confirmed_at` và hiện nhãn xác nhận. | Hiển thị nhãn xanh `✓ Đã nhận hàng` trên cả trang khách và Admin. | **PASS** |
| **TC-TM07-05** | Trả hàng (`TM-07`) | Gửi yêu cầu trả hàng kèm lý do và bằng chứng | 1. Tại đơn `completed`, bấm "Yêu cầu trả hàng".<br>

<br>2. Nhập lý do, chọn ảnh/video bằng chứng và gửi. | Tệp lưu vào `/uploads/returns`, đơn chuyển sang trạng thái `return_requested`. | Gửi thành công, dữ liệu lý do và đường dẫn tệp lưu đúng vào CSDL. | **PASS** |
| **TC-TM07-06** | Bảo mật (`TM-07`) | Chống truy cập trái phép đơn hàng người khác (IDOR) | 1. Đăng nhập tài khoản Khách A.<br>

<br>2. Truy cập URL chi tiết đơn hàng của Khách B. | Hệ thống từ chối truy cập và trả về mã lỗi `403 Forbidden`. | Hiển thị thông báo không có quyền xem đơn hàng này. | **PASS** |
| **TC-TM13-01** | Quản lý đơn (`TM-13`) | Chặn Admin chuyển ngược trạng thái đơn hàng | 1. Mở đơn ở trạng thái `shipping` hoặc `completed`.<br>

<br>2. Gửi yêu cầu chuyển về `pending`. | State Machine chặn thao tác đi ngược hoặc nhảy bước, trả lỗi `400`. | Hệ thống từ chối cập nhật và giữ nguyên trạng thái hiện tại. | **PASS** |
| **TC-TM13-02** | Duyệt trả hàng (`TM-13`) | Admin duyệt thu hồi hàng và hoàn tiền | 1. Mở tab "Yêu cầu trả hàng" tại trang Admin.<br>

<br>2. Xem bằng chứng và bấm "Xác nhận thu hồi & Hoàn tiền". | Đơn chuyển sang `returned`, tự động cộng lại `stock` cho các sản phẩm trong đơn. | Trạng thái cập nhật sang `returned`, tồn kho được hoàn lại chính xác. | **PASS** |
| **TC-TM13-03** | Duyệt trả hàng (`TM-13`) | Admin từ chối yêu cầu trả hàng kèm ghi chú | 1. Mở chi tiết yêu cầu trả hàng.<br>

<br>2. Nhập lý do từ chối và bấm "Từ chối trả hàng". | Đơn quay về trạng thái `completed`, lưu `admin_return_note` hiển thị cho khách hàng. | Khách hàng nhìn thấy phản hồi từ chối của cửa hàng tại chi tiết đơn. | **PASS** |

---

## 7.3. Kiểm thử đơn vị (Unit Test)

Kiểm thử đơn vị được xây dựng cho tầng xử lý nghiệp vụ Backend (`OrderService`, `CartService`, `AuthService`) nhằm cô lập và xác minh các quy tắc xử lý dữ liệu trước khi tích hợp giao diện:

* **Kiểm tra giao dịch đặt hàng (`placeOrder`):** Xác minh cơ chế `Serializable` transaction ngăn chặn tình trạng bán vượt tồn kho (`overselling`) khi nhiều yêu cầu đặt cùng một sản phẩm gửi đến đồng thời.
* **Kiểm tra máy trạng thái đơn hàng (`ALLOWED_TRANSITIONS`):** Xác minh hàm `updateOrderStatusByAdmin` chỉ cho phép chuyển tuyến tính `pending → shipping → completed` hoặc `pending → cancelled`, từ chối mọi trường hợp chuyển ngược trạng thái.
* **Kiểm tra nghiệp vụ hoàn kho (`cancelOrder` và `reviewReturnRequestByAdmin`):** Xác minh khi đơn bị hủy ở trạng thái `pending` hoặc được Admin duyệt thu hồi hàng (`approve`), tổng số lượng `stock` của từng mặt hàng trong `order_items` được cộng trả lại chính xác vào bảng `products`.
* **Kết quả thực thi:** Toàn bộ các ca kiểm thử đơn vị và tích hợp API đều đạt trạng thái **PASS**, không ghi nhận ngoại lệ chưa xử lý (`Unhandled Rejection`) hay sai lệch dữ liệu tính toán.

---

## 7.4. Kiểm thử chéo (Cross-Testing)

Để đảm bảo tính khách quan, các thành viên trong nhóm thực hiện kiểm thử chéo các phân hệ của nhau trên nhánh `develop`. Mọi lỗi phát hiện đều được chuẩn hóa quy trình xử lý: **Phát hiện lỗi → Tạo thẻ trên Trello & Mở GitHub Issue → Thành viên phụ trách sửa lỗi trên nhánh `fix/...` → Kiểm thử lại (Re-test) và đóng Issue**.

| Mã Issue | Phân hệ liên quan | Mô tả vấn đề phát hiện | Mức độ | Người phụ trách xử lý | Trạng thái |
| --- | --- | --- | --- | --- | --- |
| **#01** | `TM-05` (Giỏ hàng) | Chưa chặn thao tác tăng nhanh số lượng vượt quá tồn kho trên giao diện giỏ hàng. | Cao | Thành viên phụ trách `TM-05` & TV5 | Đã khắc phục & Đóng |
| **#02** | `TM-07` (Đơn hàng) | Người dùng vẫn thấy nút hủy đơn khi đơn đã chuyển sang trạng thái đang giao (`shipping`). | Cao | TV5 | Đã khắc phục & Đóng |
| **#03** | `TM-13` (Quản trị đơn) | Thiếu ràng buộc ngăn Admin chuyển ngược trạng thái đơn đã hoàn thành về chờ xác nhận. | Trung bình | TV5 | Đã khắc phục & Đóng |
| **#04** | `TM-07` & `TM-13` | Bổ sung tính năng khách xác nhận đã nhận hàng, form gửi yêu cầu trả hàng có đính kèm bằng chứng và luồng Admin duyệt thu hồi/hoàn kho. | Cao | TV5 | Đã hoàn thiện & Đóng |
