# ĐẶC TẢ USE CASE - ĐỀ TÀI THƯƠNG MẠI ĐIỆN TỬ

## 1. Sơ đồ Use Case tổng quan

### 1.1. Tác nhân (Actors)

Hệ thống có 3 tác nhân chính:

1. **Khách vãng lai (Guest):**
   - Người chưa đăng nhập vào hệ thống.
   - Có thể xem sản phẩm, tìm kiếm, lọc sản phẩm, xem chi tiết sản phẩm, đăng ký và đăng nhập.

2. **Khách hàng (Customer):**
   - Người đã đăng nhập vào hệ thống.
   - Có thể quản lý giỏ hàng, đặt hàng, xem đơn hàng, quản lý hồ sơ cá nhân và đổi mật khẩu.

3. **Quản trị viên (Admin):**
   - Người có quyền quản trị hệ thống.
   - Có thể quản lý danh mục, sản phẩm, đơn hàng, người dùng và xem thống kê.

### 1.2. Danh sách Use Case theo chức năng

Các chức năng được xây dựng theo bảng phân công và tiêu chí chấp nhận của dự án.

**Nhóm chức năng khách vãng lai:**

| Mã | Use Case | Chức năng |
|---|---|---|
| TM-01 | Trang chủ | Hiển thị sản phẩm mới và sản phẩm theo danh mục |
| TM-02 | Tìm kiếm, lọc sản phẩm | Tìm theo tên, lọc danh mục, khoảng giá, sắp xếp và phân trang |
| TM-03 | Xem chi tiết sản phẩm | Hiển thị hình ảnh, giá, mô tả, số lượng tồn |
| TM-04 | Đăng ký, đăng nhập | Tạo tài khoản và đăng nhập hệ thống |

**Nhóm chức năng khách hàng:**

| Mã | Use Case | Chức năng |
|---|---|---|
| TM-05 | Giỏ hàng | Thêm, sửa số lượng và xóa sản phẩm |
| TM-06 | Đặt hàng (COD) | Nhập thông tin nhận hàng và xác nhận đặt hàng |
| TM-07 | Đơn hàng của tôi | Xem danh sách, chi tiết và hủy đơn hàng khi còn chờ xác nhận |
| TM-08 | Hồ sơ cá nhân | Cập nhật họ tên, số điện thoại, địa chỉ và đổi mật khẩu |

**Nhóm chức năng quản trị viên:**

| Mã | Use Case | Chức năng |
|---|---|---|
| TM-11 | Quản lý danh mục | Thêm, sửa, xóa danh mục |
| TM-12 | Quản lý sản phẩm | Thêm, sửa, xóa, ẩn/hiện sản phẩm, tìm kiếm và phân trang |
| TM-13 | Quản lý đơn hàng | Lọc theo trạng thái và cập nhật trạng thái đơn hàng |
| TM-14 | Quản lý người dùng | Tìm kiếm theo email, khóa và mở khóa tài khoản |
| TM-15 | Thống kê | Thống kê doanh thu, sản phẩm bán chạy và số đơn theo trạng thái |

**Lưu ý:** TM-09 (Đánh giá sản phẩm) và TM-10 (Thanh toán online thử) chưa được nhóm triển khai nên không đưa vào phạm vi chức năng hiện tại.

---

## 2. Đặc tả chi tiết các Use Case chính

### UC-01: Đặt hàng (Checkout / TM-06)

- **Tác nhân:** Khách hàng (Customer).
- **Mục tiêu:** Cho phép khách hàng đặt mua sản phẩm trong giỏ hàng bằng phương thức thanh toán COD.
- **Tiền điều kiện:**
  - Khách hàng đã đăng nhập vào hệ thống.
  - Giỏ hàng (`cart_items`) có ít nhất một sản phẩm.
  - Số lượng sản phẩm đặt mua không vượt quá số lượng tồn kho.
- **Hậu điều kiện:**
  - Đơn hàng được tạo thành công trong cơ sở dữ liệu.
  - Đơn hàng có trạng thái "Chờ xác nhận".
  - Số lượng tồn kho được cập nhật.
  - Giỏ hàng được xóa sau khi đặt hàng thành công.

**Luồng chính:**

1. Khách hàng truy cập trang giỏ hàng.
2. Hệ thống hiển thị danh sách sản phẩm, số lượng, đơn giá và tổng tiền.
3. Khách hàng nhấn nút "Tiến hành đặt hàng".
4. Hệ thống hiển thị biểu mẫu nhập thông tin nhận hàng gồm: họ tên người nhận, số điện thoại và địa chỉ giao hàng.
5. Khách hàng nhập đầy đủ thông tin nhận hàng.
6. Khách hàng chọn phương thức thanh toán COD.
7. Khách hàng nhấn nút "Xác nhận đặt hàng".
8. Hệ thống kiểm tra tính hợp lệ của thông tin nhận hàng.
9. Hệ thống kiểm tra số lượng tồn kho của từng sản phẩm.
10. Hệ thống tính tổng tiền đơn hàng.
11. Hệ thống tạo đơn hàng mới với trạng thái "Chờ xác nhận".
12. Hệ thống trừ số lượng tồn kho và xóa giỏ hàng trong cùng một transaction.
13. Hệ thống thông báo đặt hàng thành công và chuyển khách hàng đến trang "Đơn hàng của tôi".

**Luồng ngoại lệ:**

- **E1 - Giỏ hàng trống:** Hệ thống thông báo giỏ hàng chưa có sản phẩm và yêu cầu khách hàng thêm sản phẩm.
- **E2 - Sản phẩm hết hàng:** Nếu số lượng đặt mua vượt quá tồn kho thực tế, hệ thống hủy giao dịch và thông báo sản phẩm không đủ số lượng.
- **E3 - Thiếu thông tin nhận hàng:** Nếu khách hàng bỏ trống họ tên, số điện thoại hoặc địa chỉ, hệ thống hiển thị thông báo lỗi tương ứng bằng tiếng Việt.
- **E4 - Thông tin không hợp lệ:** Nếu thông tin nhận hàng hoặc số lượng sản phẩm không hợp lệ, hệ thống thông báo lỗi và yêu cầu khách hàng kiểm tra lại.
- **E5 - Lỗi xử lý đơn hàng:** Nếu xảy ra lỗi trong quá trình tạo đơn hàng hoặc cập nhật tồn kho, hệ thống rollback transaction để đảm bảo dữ liệu nhất quán.
- **E6 - Phiên đăng nhập hết hạn:** Hệ thống yêu cầu khách hàng đăng nhập lại trước khi tiếp tục đặt hàng.

---

### UC-02: Quản lý sản phẩm (Product Management / TM-12)

- **Tác nhân:** Quản trị viên (Admin).
- **Mục tiêu:** Cho phép quản trị viên quản lý thông tin sản phẩm trong hệ thống.
- **Tiền điều kiện:**
  - Quản trị viên đã đăng nhập vào hệ thống.
  - Tài khoản có quyền `admin`.
  - Hệ thống đã kiểm tra quyền truy cập ở phía Server.
- **Hậu điều kiện:**
  - Thông tin sản phẩm được thêm mới, cập nhật hoặc xóa thành công.
  - Trạng thái hiển thị sản phẩm được cập nhật khi quản trị viên thực hiện ẩn/hiện.
  - Danh sách sản phẩm được cập nhật sau khi thao tác thành công.

**Luồng chính:**

1. Quản trị viên đăng nhập vào hệ thống.
2. Quản trị viên truy cập trang quản lý sản phẩm (`/admin/products`).
3. Hệ thống hiển thị danh sách sản phẩm có phân trang và công cụ tìm kiếm.
4. Quản trị viên có thể nhập từ khóa để tìm kiếm sản phẩm.
5. Quản trị viên chọn chức năng "Thêm sản phẩm mới".
6. Hệ thống hiển thị biểu mẫu nhập thông tin sản phẩm.
7. Quản trị viên nhập tên sản phẩm, danh mục, giá bán, mô tả và số lượng tồn kho.
8. Quản trị viên tải lên một ảnh đại diện sản phẩm.
9. Hệ thống kiểm tra tính hợp lệ của dữ liệu và file ảnh.
10. Quản trị viên xác nhận lưu sản phẩm.
11. Hệ thống lưu thông tin sản phẩm và hình ảnh vào hệ thống.
12. Hệ thống thông báo thêm sản phẩm thành công và cập nhật danh sách sản phẩm.

**Các luồng thay thế:**

- **A1 - Tìm kiếm và phân trang sản phẩm:**
  1. Quản trị viên nhập tên sản phẩm vào ô tìm kiếm.
  2. Hệ thống tìm kiếm sản phẩm theo từ khóa.
  3. Hệ thống hiển thị kết quả tìm kiếm theo từng trang.
  4. Quản trị viên có thể chuyển sang trang tiếp theo hoặc trang trước đó.

- **A2 - Cập nhật sản phẩm:**
  1. Quản trị viên chọn sản phẩm cần chỉnh sửa.
  2. Hệ thống hiển thị thông tin hiện tại của sản phẩm.
  3. Quản trị viên thay đổi các thông tin cần thiết.
  4. Hệ thống kiểm tra dữ liệu và lưu thông tin mới.
  5. Hệ thống thông báo cập nhật thành công.

- **A3 - Xóa sản phẩm:**
  1. Quản trị viên chọn sản phẩm cần xóa.
  2. Hệ thống hiển thị thông báo xác nhận xóa.
  3. Quản trị viên xác nhận thao tác.
  4. Hệ thống thực hiện xóa sản phẩm.
  5. Hệ thống cập nhật danh sách sản phẩm.


**Luồng ngoại lệ:**

- **E1 - Thiếu thông tin:** Nếu tên sản phẩm, danh mục, giá hoặc số lượng tồn kho không hợp lệ, hệ thống thông báo lỗi và yêu cầu nhập lại.
- **E2 - Giá hoặc số lượng không hợp lệ:** Hệ thống từ chối dữ liệu có giá hoặc số lượng tồn kho nhỏ hơn 0.
- **E3 - Lỗi định dạng ảnh:** Nếu file ảnh không thuộc định dạng JPG, JPEG hoặc PNG, hệ thống từ chối tải lên.
- **E4 - Ảnh vượt dung lượng:** Nếu file ảnh vượt quá 2MB, hệ thống thông báo lỗi dung lượng.
- **E5 - Không có quyền Admin:** Nếu người dùng không có quyền quản trị, hệ thống từ chối truy cập chức năng.
- **E6 - Sản phẩm không tồn tại:** Nếu sản phẩm cần chỉnh sửa hoặc xóa không tồn tại, hệ thống thông báo không tìm thấy sản phẩm.
- **E7 - Lỗi lưu dữ liệu:** Nếu xảy ra lỗi khi lưu thông tin sản phẩm, hệ thống thông báo thao tác thất bại.

---

### UC-03: Đăng ký và đăng nhập (Authentication / TM-04)

- **Tác nhân:** Khách vãng lai (Guest).
- **Mục tiêu:** Cho phép người dùng đăng ký tài khoản mới hoặc đăng nhập vào hệ thống.
- **Tiền điều kiện:**
  - Đối với đăng ký: Người dùng chưa có tài khoản với email sử dụng.
  - Đối với đăng nhập: Người dùng đã có tài khoản trên hệ thống.
- **Hậu điều kiện:**
  - Đăng ký thành công: Tài khoản mới được lưu vào cơ sở dữ liệu.
  - Đăng nhập thành công: Người dùng được cấp token xác thực và điều hướng theo vai trò.
  - Đăng nhập thất bại: Hệ thống không cấp token.

**Luồng chính:**

**A. Đăng ký tài khoản**

1. Khách vãng lai truy cập trang Đăng ký.
2. Hệ thống hiển thị biểu mẫu đăng ký.
3. Người dùng nhập họ tên, email và mật khẩu theo yêu cầu của hệ thống.
4. Người dùng nhấn nút "Đăng ký".
5. Hệ thống kiểm tra dữ liệu đầu vào.
6. Hệ thống kiểm tra email đã tồn tại trong cơ sở dữ liệu hay chưa.
7. Hệ thống kiểm tra mật khẩu có tối thiểu 8 ký tự.
8. Hệ thống mã hóa mật khẩu bằng bcrypt.
9. Hệ thống lưu thông tin tài khoản mới vào cơ sở dữ liệu.
10. Hệ thống thông báo đăng ký thành công và chuyển người dùng đến trang đăng nhập.

**B. Đăng nhập tài khoản**

1. Người dùng truy cập trang Đăng nhập.
2. Hệ thống hiển thị biểu mẫu đăng nhập.
3. Người dùng nhập Email và Mật khẩu.
4. Người dùng nhấn nút "Đăng nhập".
5. Hệ thống kiểm tra dữ liệu đầu vào.
6. Hệ thống tìm kiếm tài khoản theo email trong cơ sở dữ liệu.
7. Hệ thống xác thực mật khẩu bằng bcrypt.
8. Hệ thống kiểm tra trạng thái tài khoản, đảm bảo tài khoản không bị khóa.
9. Hệ thống tạo JWT token để xác thực người dùng.
10. Hệ thống trả về thông tin người dùng và token.
11. Hệ thống điều hướng theo vai trò:
    - Nếu là `admin`: Chuyển đến trang `/admin/dashboard`.
    - Nếu là `customer`: Chuyển đến trang chủ `/`.

**Luồng ngoại lệ:**

- **E1 - Email đã tồn tại:** Nếu email đăng ký đã được sử dụng, hệ thống thông báo email đã tồn tại.
- **E2 - Email không hợp lệ:** Hệ thống thông báo email không đúng định dạng.
- **E3 - Mật khẩu không đủ 8 ký tự:** Hệ thống yêu cầu người dùng nhập mật khẩu có tối thiểu 8 ký tự.
- **E4 - Thiếu thông tin:** Nếu người dùng bỏ trống các trường bắt buộc, hệ thống yêu cầu nhập đầy đủ thông tin.
- **E5 - Email đăng nhập không tồn tại:** Hệ thống thông báo "Email hoặc mật khẩu không chính xác".
- **E6 - Sai mật khẩu:** Hệ thống thông báo "Email hoặc mật khẩu không chính xác".
- **E7 - Tài khoản bị khóa:** Hệ thống thông báo "Tài khoản của bạn đã bị khóa" và từ chối cấp token.
- **E8 - Lỗi kết nối cơ sở dữ liệu:** Hệ thống thông báo thao tác thất bại do lỗi hệ thống.

---

## 3. Các yêu cầu phi chức năng liên quan

- **NFR-01 - Bảo mật:** Mật khẩu người dùng phải được mã hóa bằng bcrypt. Các chức năng quản trị phải được kiểm tra quyền truy cập ở phía Server.
- **NFR-02 - Tính toàn vẹn dữ liệu:** Các thao tác đặt hàng, cập nhật tồn kho và xóa giỏ hàng phải đảm bảo dữ liệu nhất quán trong một transaction.
- **NFR-03 - Hiệu năng:** Danh sách sản phẩm cần hỗ trợ tìm kiếm và phân trang phía Server.
- **NFR-04 - Khả năng sử dụng:** Giao diện thân thiện, thông báo lỗi bằng tiếng Việt và hướng dẫn người dùng xử lý khi thao tác thất bại.
- **NFR-05 - Kiểm tra dữ liệu:** Dữ liệu đầu vào phải được kiểm tra hợp lệ ở phía Server trước khi lưu vào cơ sở dữ liệu.
- **NFR-06 - Quản lý tệp:** Hình ảnh sản phẩm phải thuộc định dạng JPG/PNG và dung lượng không vượt quá 2MB.

---

## 4. Phạm vi triển khai

Các chức năng thuộc phạm vi dự án hiện tại bao gồm:

- TM-01 đến TM-08.
- TM-11 đến TM-15.

Các chức năng chưa triển khai:

- TM-09: Đánh giá sản phẩm.
- TM-10: Thanh toán online thử (VNPay/MoMo Sandbox).

Hai chức năng TM-09 và TM-10 không thuộc phạm vi triển khai hiện tại và không được xem là chức năng đã hoàn thành.
