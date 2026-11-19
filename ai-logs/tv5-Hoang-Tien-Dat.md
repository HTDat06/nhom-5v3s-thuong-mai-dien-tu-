# AI log – TV5 – Hoàng Tiến Đạt

| Mục | Thông tin |
| --- | --- |
| Họ tên, MSSV | Hoàng Tiến Đạt – 0306241272 |
| Nhóm, đề tài | Nhóm 8 – Thương mại điện tử |
| Vai trò | TV5 – TE (Tester) |
| Công cụ AI dùng | Gemini |

## Bảng tổng hợp

| Mã | Ngày | Giai đoạn | Nội dung | Commit / PR |
| --- | --- | --- | --- | --- |
| AI-01 | 09/11 | Kiểm thử | Tạo 5 test cases mẫu cho TM-05 Giỏ hàng | PR #32 |
| AI-02 | 10/11 | Tài liệu | Cập nhật README tách biệt Frontend và Backend | PR #35 |
| AI-03 | 11/11 | Kiểm thử | Thêm Test Cases TM-04 và Checklist Review PR Bảo mật/Migration | PR #55 |
| AI-04 | 12/11 | Tài liệu | Đồng bộ CSDL Prisma/Seed và rà soát README Mốc 1 | [PR #68 ](https://github.com/HTDat06/nhom-5v3s-thuong-mai-dien-tu-/pull/68) |
| AI-05 | 13/11 | Phát hành | Hoàn thiện ERD Mốc 1, phát hành Release v0.1 và tạo nhánh TM-05 | [PR #76 ](https://github.com/HTDat06/nhom-5v3s-thuong-mai-dien-tu-/pull/76) |
| AI-06 | 16/11 | Phát triển & Kiểm thử | Triển khai chức năng Thêm vào giỏ hàng (TM-05) Fullstack và Test Cases | [PR #112 ](https://github.com/HTDat06/nhom-5v3s-thuong-mai-dien-tu-/pull/112) |
| AI-07 | 18/11 | Phát triển & Kiểm thử | Hoàn thiện Trang giỏ hàng TM-05 (sửa số lượng, xóa, tổng tiền) và đồng bộ nhánh develop | [PR #138 ](https://github.com/HTDat06/nhom-5v3s-thuong-mai-dien-tu-/pull/138) |
| AI-08 | 20/11 | Phát triển & Kiểm thử | Review PR TM-06, đồng bộ CSDL và triển khai & kiểm thử Đơn hàng của tôi TM-07 (chống IDOR 403/404, hủy đơn hoàn tồn kho) | [PR #152 ](https://github.com/HTDat06/nhom-5v3s-thuong-mai-dien-tu-/pull/152) |
| AI-09 | 20/11 | Phát triển & Kiểm thử | Review PR TM-02, triển khai Quản lý đơn hàng Admin TM-13 (State Machine chặn đi ngược) và phân quyền Header Admin | [PR #153 ](https://github.com/HTDat06/nhom-5v3s-thuong-mai-dien-tu-/pull/153) |

---

### [AI-01] Tạo 5 test cases mẫu cho TM-05 Giỏ hàng
- Ngày / Người dùng: 2026-11-09 / Hoàng Tiến Đạt
- Công cụ: Gemini
- Giai đoạn: Kiểm thử
- Task / Commit / PR: [TEST] Mẫu test case / `docs: mau test case` / PR #32
- Mục đích: Tạo 5 test case chuẩn kiểm thử chức năng TM-05 Giỏ hàng khớp với tiêu chí chấp nhận.
- Prompt chính: "Nhờ AI tạo 5 test case mẫu cho TM-05 Giỏ hàng; tự sửa cho khớp tiêu chí chấp nhận."
- Kết quả AI trả về (tóm tắt): AI tạo ra 5 test case kiểm tra thêm sản phẩm, sửa số lượng, xóa khỏi giỏ, chặn mua vượt tồn kho và tính tổng tiền tự động.
- Đánh giá: Đúng – Phủ đầy đủ luồng chính (Happy Path) và luồng ngoại lệ.
- Đã chỉnh sửa gì: Chỉnh sửa lại định dạng bảng Markdown cho đồng bộ với file `docs/test-cases.md`.
- Cách kiểm chứng: Đối chiếu tiêu chí chấp nhận trong Use Case TM-05; PR đã được duyệt và Merge vào develop.
- Tỷ lệ nội dung AI còn giữ lại (ước lượng): 60%
- Điều học được: Cần yêu cầu AI xuất ra đúng định dạng bảng Markdown ngay trong prompt để tiết kiệm thời gian format lại.

---

### [AI-02] Cập nhật README hướng dẫn cài đặt riêng Frontend và Backend
- Ngày / Người dùng: 2026-11-10 / Hoàng Tiến Đạt
- Công cụ: Gemini
- Giai đoạn: Tài liệu
- Task / Commit / PR: [DOCS] Cập nhật README / `docs: cap nhat readme cai dat fe va be` / PR #35
- Mục đích: Viết lại hướng dẫn cài đặt và khởi chạy dự án tách biệt rõ ràng giữa Frontend (`client`) và Backend (`server`).
- Prompt chính: "Hướng dẫn cài đặt và chạy dự án web thương mại điện tử với Frontend và Backend làm riêng biệt."
- Kết quả AI trả về (tóm tắt): Khung tài liệu README chi tiết các lệnh `cd`, `npm install`, cấu hình `.env` cho 2 thư mục riêng biệt kèm cổng chạy local (3000 và 5000).
- Đánh giá: Đúng – Cấu trúc rõ ràng, giúp thành viên mới dễ dàng cài đặt trên máy sạch.
- Đã chỉnh sửa gì: Bổ sung thêm bảng danh sách 15 chức năng (TM-01 đến TM-15) và liên kết tới tài liệu `docs/use-cases.md`.
- Cách kiểm chứng: Thử nghiệm clone dự án về máy sạch và thực hành cài đặt theo đúng hướng dẫn trong README.
- Tỷ lệ nội dung AI còn giữ lại (ước lượng): 70%
- Điều học được: Việc phân tách rõ quy trình cài đặt Client/Server trong README giúp giảm thiểu lỗi môi trường khi làm việc nhóm.

---

### [AI-03] Thêm Test Cases TM-04 và Checklist Review PR Bảo mật/Migration
- Ngày / Người dùng: 2026-11-11 / Hoàng Tiến Đạt
- Công cụ: Gemini
- Giai đoạn: Kiểm thử
- Task / Commit / PR: [TEST] Kiểm tra môi trường / `docs: bo sung bo test cases TM-04 dang ky va dang nhap` / PR #55
- Mục đích: Xây dựng bộ test cases cho chức năng Đăng ký/Đăng nhập (TM-04) và lập checklist review code bảo mật, CSDL SQL Server.
- Prompt chính: "Nhờ AI liệt kê lỗi bảo mật hay gặp ở chức năng đăng ký và tạo test cases cho TM-04; dùng làm checklist review."
- Kết quả AI trả về (tóm tắt): Đưa ra 5 test cases phủ luồng TM-04 (kiểm tra băm Bcrypt, kiểm tra validate dữ liệu đầu vào) và checklist review Migration CSDL.
- Đánh giá: Đúng – Đáp ứng đầy đủ tiêu chí chấp nhận và tiêu chuẩn an toàn thông tin.
- Đã chỉnh sửa gì: Bổ sung thêm các lệnh PowerShell `Invoke-RestMethod` kèm khối `try-catch` để test tự động các mã lỗi HTTP 400.
- Cách kiểm chứng: Chạy thực tế bộ lệnh test API trên PowerShell local; review và để lại bình luận Approve trên PR của đồng đội.
- Tỷ lệ nội dung AI còn giữ lại (ước lượng): 75%
- Điều học được: Khi test API trên PowerShell, cần dùng khối `try-catch` để đọc nội dung lỗi chi tiết trong Response Stream khi HTTP Status khác 200.

---

### [AI-04] Đồng bộ CSDL Prisma/Seed và rà soát README, tài liệu Mốc 1
- Ngày / Người dùng: 2026-11-12 / Hoàng Tiến Đạt
- Công cụ: Gemini
- Giai đoạn: Tài liệu
- Task / Commit / PR: [DOC] Kiểm tra repo Mốc 1 / `docs: cap nhat readme va tai lieu cau truc thu muc` / PR #68
- Mục đích: Xử lý lỗi cài đặt driver SQL Server (`msnodesqlv8`) trên Node.js v24, đồng bộ đủ 6 bảng kèm dữ liệu mẫu qua Prisma (`seed.js`) và rà soát lại `README.md` (hướng dẫn cài đặt, chạy migration/seed, tài khoản demo) phục vụ kiểm tra repo Mốc 1.
- Prompt chính: "Xử lý lỗi thiếu bảng trên SSMS khi chạy Prisma, tạo script seed dữ liệu mẫu linh kiện máy tính và viết lại README hướng dẫn tải về, chạy migration/seed kèm tài khoản demo."
- Kết quả AI trả về (tóm tắt): Cung cấp câu lệnh SQL tạo đủ 6 bảng trong database `linh_kien_may_tinh`, tệp `backend/prisma/seed.js` nạp 5 danh mục, 30 sản phẩm, 11 tài khoản mẫu (`admin@gmail.com`, `customer1..10@gmail.com`) cùng 10 đơn hàng, và khung `README.md` chuẩn hóa quy trình cài đặt Backend/Frontend.
- Đánh giá: Đúng – Giải quyết triệt để xung đột môi trường trên Windows/Node v24 và giúp cả nhóm khởi tạo CSDL chỉ với vài lệnh Prisma.
- Đã chỉnh sửa gì: Điều chỉnh tên database thành `linh_kien_may_tinh` cho khớp đề tài, bổ sung hướng dẫn xử lý lỗi PowerShell Execution Policy và rà soát đầy đủ các đầu mục của Mốc 1.
- Cách kiểm chứng: Chạy thực tế toàn bộ quy trình trên máy (`npx prisma db pull`, `node prisma/seed.js`), kiểm tra đủ 6 bảng và bản ghi trong SSMS, đồng thời đăng nhập thử bằng tài khoản demo `admin@gmail.com`.
- Tỷ lệ nội dung AI còn giữ lại (ước lượng): 75%
- Điều học được: Khi dự án có sẵn cả migration của Sequelize và schema của Prisma, cần thống nhất một luồng khởi tạo và seed dữ liệu chuẩn trong `README.md` để tránh lỗi môi trường cho các thành viên khác.

---

### [AI-05] Hoàn thiện tài liệu ERD Mốc 1, phát hành Release v0.1 và khởi tạo nhánh TM-05
- Ngày / Người dùng: 2026-11-13 / Hoàng Tiến Đạt
- Công cụ: Gemini
- Giai đoạn: Phát hành
- Task / Commit / PR: [DOC] Tag v0.1 & [TM-05] / `docs: cap nhat erd-final va phat hanh v0.1` / PR #76
- Mục đích: Trích xuất các tệp chuẩn (`erd-final.png`, `mo_ta_bang.md`) từ nhánh `docs/erd` sang `develop`, xóa các bản nháp cũ, gộp `develop` vào `main` qua PR để phát hành phiên bản `v0.1` và tạo nhánh `feature/TM-05-gio-hang`.
- Prompt chính: "Lấy erd-final và mô tả bảng mới nhất từ nhánh docs/erd vào nhánh develop, xóa các bản nháp cũ; hướng dẫn merge develop vào main và tạo release/tag v0.1 trên GitHub."
- Kết quả AI trả về (tóm tắt): Cung cấp bộ lệnh Git trích xuất chọn lọc tệp từ nhánh `docs/erd` (`git fetch`, `git checkout FETCH_HEAD -- ...`, `git rm`), hướng dẫn cấu hình Git identity cục bộ trên máy phòng thực hành, quy trình tạo PR `develop` -> `main`, xuất bản Release `v0.1` và khởi tạo nhánh `feature/TM-05-gio-hang`.
- Đánh giá: Đúng – Các lệnh xử lý chính xác tình huống clone nông (`--depth 1`) và quy tắc bảo vệ nhánh `main` trên GitHub.
- Đã chỉnh sửa gì: Tự cấu hình thông tin người dùng Git cục bộ (`user.name`, `user.email`), kiểm tra lại mã commit trên nhánh `main` trước khi xuất bản Release `v0.1` và cập nhật trạng thái các thẻ trên Trello.
- Cách kiểm chứng: Kiểm tra thư mục `docs/database/` trên nhánh `develop` chỉ còn đúng 2 tệp chuẩn (`erd-final.png`, `mo_ta_bang.md`), xác nhận trang Release `v0.1` hiển thị công khai trên GitHub và nhánh `feature/TM-05-gio-hang` đã được đẩy lên remote.
- Tỷ lệ nội dung AI còn giữ lại (ước lượng): 80%
- Điều học được: Khi clone repository với tham số `--depth 1`, dữ liệu nhánh vừa fetch sẽ nằm ở `FETCH_HEAD` thay vì `origin/<tên-nhánh>`; đồng thời trên máy dùng chung nên cấu hình Git identity cục bộ (không dùng `--global`).

---

### [AI-06] Triển khai chức năng Thêm vào giỏ hàng (TM-05) Fullstack và kiểm thử trường hợp biên
- Ngày / Người dùng: 2026-11-16 / Hoàng Tiến Đạt
- Công cụ: Gemini
- Giai đoạn: Phát triển & Kiểm thử
- Task / Commit / PR: [TM-05] Giỏ hàng / `feat(TM-05): them san pham vao gio` / PR #112
- Mục đích: Xây dựng trọn vẹn chức năng thêm sản phẩm vào giỏ hàng (`TM-05`) từ Backend (Repository, Service, Controller, Route có xác thực JWT và kiểm tra tồn kho) đến Frontend (nút "Thêm vào giỏ" bắt buộc đăng nhập, badge số lượng trên Header) và bổ sung test cases trường hợp biên.
- Prompt chính: "Hướng dẫn triển khai chức năng thêm sản phẩm vào giỏ hàng (TM-05) khớp với cấu trúc backend/frontend hiện tại của nhóm, xử lý kiểm tra đăng nhập, cộng dồn số lượng, chặn vượt tồn kho và đẩy code lên nhánh feature/TM-05-gio-hang."
- Kết quả AI trả về (tóm tắt): Cung cấp mã nguồn 4 tầng Backend (`CartRepository.js`, `CartService.js`, `CartController.js`, `cartRoutes.js`), tích hợp Frontend (`cartService.js`, `CartContext.jsx`, cập nhật `App.jsx`, `Header.jsx`, `ProductCard.jsx`), quy trình Git làm việc trên nhánh riêng và bộ test cases kiểm thử giỏ hàng.
- Đánh giá: Đúng – Mã nguồn bám sát kiến trúc phân tầng của dự án và xử lý đầy đủ các ràng buộc nghiệp vụ.
- Đã chỉnh sửa gì: Chỉ chạy `npx prisma generate` để khởi tạo Prisma Client trên thư mục mới tải về (bỏ qua `db push` và `seed.js` do CSDL đã có sẵn), sửa lỗi khai báo biến `req` nằm ngoài phạm vi class trong `CartController.js`, bổ sung đọc linh hoạt trường `userId` từ JWT payload và cập nhật `docs/test-cases.md`.
- Cách kiểm chứng: Chạy thử trực tiếp trên `localhost:5173` với các kịch bản: chưa đăng nhập bấm thêm bị điều hướng sang `/login`, đăng nhập bấm thêm cộng dồn số lượng trên badge Header và giữ nguyên sau khi tải lại trang (`F5`), chặn thêm vượt tồn kho; đẩy code lên nhánh `feature/TM-05-gio-hang` và tạo PR sang `develop`.
- Tỷ lệ nội dung AI còn giữ lại (ước lượng): 80%
- Điều học được: Khi tải dự án có sẵn CSDL về môi trường mới chỉ cần chạy `npx prisma generate` để tạo client mà không cần chạy lại migration/seed gây trùng dữ liệu; luôn đẩy code lên nhánh tính năng (`feature/TM-05-gio-hang`) và mở Pull Request để review chéo trước khi gộp vào `develop`.

---

### [AI-07] Hoàn thiện Trang giỏ hàng (TM-05) Fullstack và đồng bộ nhánh develop
- Ngày / Người dùng: 2026-11-18 / Hoàng Tiến Đạt
- Công cụ: Gemini
- Giai đoạn: Phát triển & Kiểm thử
- Task / Commit / PR: [TM-05] Trang giỏ hàng / `feat(TM-05): sua so luong xoa tong tien` / PR #138
- Mục đích: Đồng bộ nhánh `feature/TM-08-ho-so` vào `develop` mà không làm mất `README.md`, xây dựng trọn vẹn trang giỏ hàng (`/cart`) hỗ trợ hiển thị danh sách, sửa số lượng không vượt tồn kho (`stock`), xóa sản phẩm, tính tổng tiền tự động và mở PR #138 chờ review.
- Prompt chính: "Hỗ trợ gộp nhánh TM-08 vào develop và triển khai hoàn chỉnh tính năng Trang giỏ hàng TM-05 (danh sách sản phẩm, sửa số lượng chặn vượt tồn kho, xóa sản phẩm, tổng tiền) khớp với CartContext, CartService và CartRepository hiện tại."
- Kết quả AI trả về (tóm tắt): Cung cấp quy trình gộp nhánh `TM-08` vào `develop` giữ nguyên `README.md`, bổ sung API cập nhật số lượng (`PUT /api/cart/:cartItemId`) và xóa sản phẩm (`DELETE /api/cart/:cartItemId`) ở Backend, cùng mã nguồn Frontend (`cartService.js`, `CartContext.jsx`, `CartPage.jsx`, `App.jsx`) có kiểm tra tồn kho và tự động tính tổng tiền.
- Đánh giá: Đúng – Mã nguồn bám sát kiến trúc phân tầng của dự án, xử lý chặt chẽ ràng buộc tồn kho cả phía giao diện lẫn API Backend.
- Đã chỉnh sửa gì: Cài đặt bổ sung thư viện `bcrypt` bị thiếu trong `backend` sau khi đồng bộ code từ `develop`, kiểm thử với dữ liệu sản phẩm thật từ trang `/products` thay vì dữ liệu mẫu cứng ở trang chủ, và mở PR #138 từ nhánh `feature/TM-05-trang-gio-hang` vào `develop`.
- Cách kiểm chứng: Chạy thử trực tiếp trên `localhost:5173/cart` với các kịch bản: tăng/giảm/nhập số lượng vượt quá tồn kho (hệ thống chặn và báo lỗi), xóa sản phẩm khỏi giỏ (badge Header và tổng tiền cập nhật tức thì); tạo PR #138 trên GitHub, chuyển thẻ `[TM-05]` sang cột Chờ review trên Trello và kiểm tra chéo PR của thành viên khác (`TM-12`, `TM-14`).
- Tỷ lệ nội dung AI còn giữ lại (ước lượng): 80%
- Điều học được: Khi gộp các nhánh tính năng mới vào `develop`, cần kiểm tra và cài đặt bổ sung các gói thư viện mới phát sinh (`npm install bcrypt`), đồng thời lưu ý quy tắc của GitHub không cho phép tác giả tự Approve trên chính Pull Request của mình mà cần review chéo với các thành viên trong nhóm.


---

### [AI-08] Review PR TM-06, đồng bộ CSDL và triển khai Đơn hàng của tôi (TM-07)
- Ngày / Người dùng: 2026-11-20 / Hoàng Tiến Đạt
- Công cụ: Gemini
- Giai đoạn: Phát triển & Kiểm thử
- Task / Commit / PR: [TM-07] Đơn hàng của tôi / `feat(TM-07): don hang cua toi` / PR #152
- Mục đích: Review và gộp PR `TM-06` (#152) vào `develop`, xử lý cập nhật cột bắt buộc `receiver_name` trên SQL Server mà không làm mất dữ liệu cũ, triển khai trọn vẹn tính năng Đơn hàng của tôi (`TM-07`) gồm xem danh sách/chi tiết đơn, chặn xem đơn người khác (IDOR lỗi 403/404) và hủy đơn `"pending"` hoàn tồn kho trong transaction.
- Prompt chính: "Hỗ trợ review PR TM-06, xử lý lỗi Prisma db push thêm cột bắt buộc receiver_name trên bảng orders có sẵn dữ liệu, và triển khai fullstack chức năng Đơn hàng của tôi TM-07 (danh sách đơn, chi tiết đơn chặn IDOR 403/404, hủy đơn pending hoàn tồn kho)."
- Kết quả AI trả về (tóm tắt): Hướng dẫn kiểm tra xung đột 23 tệp trong PR #152 trước khi merge; cung cấp câu lệnh SQL `ALTER TABLE` / `UPDATE` bổ sung cột `receiver_name` giữ nguyên 10 bản ghi cũ; xuất mã nguồn Backend (`OrderService.js`, `OrderController.js`, `orderRoutes.js`) và Frontend (`myOrderService.js`, `MyOrdersPage.jsx`, `OrderDetailPage.jsx`, `App.jsx`, `Header.jsx`) cho `TM-07`.
- Đánh giá: Đúng – Bám sát cấu trúc đặt hàng của `TM-06`, đảm bảo toàn vẹn tồn kho bằng Prisma Transaction và chặn triệt để lỗ hổng IDOR.
- Đã chỉnh sửa gì: Chạy truy vấn SQL cập nhật dữ liệu cột `receiver_name` trong SSMS thay vì dùng `--force-reset` để bảo toàn dữ liệu mẫu; tích hợp nút điều hướng `/my-orders` vào `Header.jsx` hiện tại và bổ sung bộ test cases kiểm thử `TM-07` vào `docs/test-cases.md`.
- Cách kiểm chứng: Chạy thực tế trên `localhost:5173/my-orders` với các kịch bản: xem danh sách và chi tiết đơn của tài khoản đang đăng nhập, thử đổi ID đơn hàng trên URL sang đơn của người dùng khác (hệ thống trả lỗi `403` / `404` và chặn hiển thị), hủy đơn ở trạng thái `"pending"` và kiểm tra số lượng `stock` trong bảng `products` được hoàn lại chính xác.
- Tỷ lệ nội dung AI còn giữ lại (ước lượng): 80%
- Điều học được: Khi schema Prisma thêm cột `NOT NULL` không có giá trị mặc định vào bảng đã có dữ liệu, cần bổ sung dữ liệu cho các dòng cũ bằng SQL trước khi chạy `npx prisma db push` thay vì `--force-reset`; đồng thời luôn kiểm tra quyền sở hữu (`order.user_id === currentUserId`) ở tầng Service để chống truy cập trái phép qua tham số URL.



---

### [AI-09] Review PR TM-02 và triển khai Quản lý đơn hàng Admin (TM-13)
- Ngày / Người dùng: 2026-11-20 / Hoàng Tiến Đạt
- Công cụ: Gemini
- Giai đoạn: Phát triển & Kiểm thử
- Task / Commit / PR: [TM-13] Quản lý đơn hàng Admin / `feat(TM-13): chuyen trang thai don` / PR #153
- Mục đích: Review xung đột PR `#144` (`TM-02` Tìm kiếm), xây dựng chức năng Quản lý đơn hàng cho Admin (`TM-13`) gồm lọc danh sách đơn theo trạng thái và máy trạng thái chuyển một chiều (`Chờ xác nhận` ➔ `Đang giao` ➔ `Hoàn thành` / `Đã hủy`, chặn đi ngược), đồng thời ẩn nút Giỏ hàng và Đơn hàng của tôi trên Header khi đăng nhập quyền Admin.
- Prompt chính: "Gợi ý biểu diễn máy trạng thái đơn hàng cho TM-13 (lọc theo trạng thái, chuyển Chờ xác nhận -> Đang giao -> Hoàn thành hoặc Đã hủy, chặn đi ngược) khớp với authMiddleware và trang Admin hiện tại."
- Kết quả AI trả về (tóm tắt): Thiết kế bảng chuyển trạng thái `ALLOWED_TRANSITIONS` kiểm tra hợp lệ ở tầng Service, xuất mã nguồn Backend (`OrderService.js`, `OrderController.js`, `orderRoutes.js` gắn `authenticate, requireAdmin`) và Frontend (`adminOrderService.js`, `AdminOrderManager.jsx`, cập nhật `Admin.jsx` và `Header.jsx`).
- Đánh giá: Đúng – Chặn chặt chẽ chuyển trạng thái ngược chiều/nhảy bước ở cả giao diện lẫn API Backend, hoàn tồn kho khi Admin hủy đơn `pending`.
- Đã chỉnh sửa gì: Loại bỏ mệnh đề `include: { users }` trong `OrderService.js` để khớp với tên quan hệ trong `schema.prisma` hiện tại của nhóm, ẩn nút Giỏ hàng/Đơn hàng của tôi trên `Header.jsx` đối với tài khoản `admin` mà vẫn giữ nguyên ô tìm kiếm của `TM-02`, và bổ sung bộ test cases `TM-13` vào `docs/test-cases.md`.
- Cách kiểm chứng: Đăng nhập `admin@gmail.com` trên `localhost:5173/admin`, kiểm tra bộ lọc trạng thái, chuyển xuôi trạng thái đơn hàng, kiểm tra khóa nút ở đơn `Hoàn thành`/`Đã hủy`, và dùng PowerShell gọi trực tiếp API `PUT /api/orders/:id/status` chuyển ngược về `pending` để xác nhận server trả lỗi `400`.
- Tỷ lệ nội dung AI còn giữ lại (ước lượng): 80%
- Điều học được: Biểu diễn máy trạng thái bằng từ điển `ALLOWED_TRANSITIONS` giúp kiểm soát tập trung mọi luồng chuyển đổi hợp lệ và ngăn chặn triệt để thao tác gọi API đi ngược quy trình.