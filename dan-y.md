# DÀN Ý BÁO CÁO ĐỒ ÁN LẬP TRÌNH WEB
**Đề tài:** Website Thương mại điện tử 
**Nhóm thực hiện:** Nhóm 8  
**Nhánh làm việc:** `docs/bao-cao`

---

## Bảng phân công thực hiện

| Chương / Hạng mục | Nội dung chính | Người phụ trách |
| :--- | :--- | :--- |
| **Chương 1** | Giới thiệu đề tài | TV1 (Nguyễn Chí Hải) |
| **Chương 2** | Tổ chức nhóm và quản lý dự án | TV1 (Nguyễn Chí Hải) |
| **Chương 3** | Công nghệ sử dụng | TV4 (Mai Thanh Tân) |
| **Chương 4** | Phân tích yêu cầu | TV1 (Nguyễn Chí Hải), TV2 (Trần Ngọc Duy) |
| **Chương 5** | Thiết kế hệ thống | - 5.1 & 5.3: TV2 (Trần Ngọc Duy)<br>- 5.2 (CSDL): TV4 (Mai Thanh Tân)<br>- 5.4 (Giao diện): TV3 (Phạm Thiên Phúc) |
| **Chương 6** | Cài đặt | TV2 (Trần Ngọc Duy), TV5 (Hoàng Tiến Đạt) |
| **Chương 7** | Kiểm thử | TV5 (Hoàng Tiến Đạt) |
| **Chương 8** | Quản lý mã nguồn | TV5 (Hoàng Tiến Đạt) |
| **Chương 9** | Báo cáo phản tư về sử dụng AI | TV1 tổng hợp, mỗi thành viên viết phần của mình |
| **Chương 10** | Kết luận & Tài liệu tham khảo  | TV1 (Nguyễn Chí Hải) |
| **Phụ lục & Sản phẩm** | Phụ lục A–D, Video demo (3–5 phút), Slide bảo vệ| - Video demo: TV3<br>- README & Phụ lục: TV5<br>- Slide & ghép bản cuối: TV1 |

---

## Chi tiết dàn ý 10 chương (theo quy định chuẩn)

### Chương 1: Giới thiệu đề tài (Phụ trách: TV1)
- **1.1.** Bối cảnh, lý do chọn đề tài (Website thương mại điện tử bán linh kiện điện tử)
- **1.2.** Mục tiêu
- **1.3.** Phạm vi (3 phân hệ người dùng, 12 chức năng bắt buộc, chức năng cộng điểm đã làm, phần ngoài phạm vi)
- **1.4.** Bố cục báo cáo


### Chương 2: Tổ chức nhóm và quản lý dự án (Phụ trách: TV1)
- **2.1.** Vai trò thành viên (`TV1`–`TV5`)
- **2.2.** Quy trình Scrum rút gọn (5 sprint ngắn, họp nhóm, Trello)
- **2.3.** Kế hoạch và tiến độ thực tế từng sprint
- **2.4.** Tổng hợp retrospective
- **2.5.** Đánh giá phân công

### Chương 3: Công nghệ sử dụng (Phụ trách: TV4)
- **3.1.** Backend, frontend, CSDL đã chọn
- **3.2.** Lý do lựa chọn và so sánh ngắn với phương án khác
- **3.3.** Thư viện chính và phiên bản

### Chương 4: Phân tích yêu cầu (Phụ trách: TV1, TV2)
- **4.1.** Danh sách user story (`TM-01` đến `TM-16`, mức B/C)
- **4.2.** Use case diagram
- **4.3.** Đặc tả 3 use case: Đăng nhập, Quản lý sản phẩm, Đặt hàng
- **4.4.** Yêu cầu phi chức năng

### Chương 5: Thiết kế hệ thống (Phụ trách: TV2, TV4, TV3)
- **5.1.** Kiến trúc tổng thể và luồng một request qua 3 lớp *(TV2)*
- **5.2.** Thiết kế CSDL: ERD, mô tả bảng, chuẩn hóa 3NF, chỉ mục *(TV4)*
- **5.3.** Sequence diagram luồng Đặt hàng *(TV2)*
- **5.4.** Thiết kế giao diện (wireframe / giao diện thật) *(TV3)*

### Chương 6: Cài đặt (Phụ trách: TV2, TV5)
- **6.1.** Cấu trúc thư mục mã nguồn
- **6.2.** Mẫu thiết kế / nguyên lý áp dụng (Repository, DI, Middleware...) và vị trí trong mã
- **6.3.** Nghiệp vụ tiêu biểu: đặt hàng trong transaction, chống bán vượt tồn kho (ý tưởng, mã giả, độ phức tạp)
- **6.4.** Bảo mật: băm mật khẩu, chống Injection/XSS/CSRF, phân quyền, kiểm tra quyền sở hữu đơn hàng

### Chương 7: Kiểm thử (Phụ trách: TV5)
- **7.1.** Kế hoạch kiểm thử
- **7.2.** Unit test (danh sách, cách chạy, kết quả)
- **7.3.** Bảng test case 12 chức năng bắt buộc
- **7.4.** Kiểm thử chéo: số lỗi nhận / đã sửa

### Chương 8: Quản lý mã nguồn (Phụ trách: TV5)
- **8.1.** Mô hình nhánh và quy tắc commit
- **8.2.** Thống kê commit, PR, review theo thành viên
- **8.3.** Các tag phiên bản (`v0.1`, `v0.5`, `v1.0`...)
- **8.4.** Sự cố Git đã gặp và cách xử lý

### Chương 9: Báo cáo phản tư về sử dụng AI (Phụ trách: TV1 tổng hợp, 5 thành viên viết phần riêng)
- **9.1.** Thống kê AI log theo giai đoạn và thành viên
- **9.2.** Hai trường hợp AI giúp hiệu quả nhất
- **9.3.** Hai trường hợp AI trả lời sai, lỗi thời hoặc gây lỗi bảo mật và cách phát hiện
- **9.4.** So sánh một chức năng tự viết với một chức năng có AI hỗ trợ
- **9.5.** Kỹ thuật viết prompt rút ra
- **9.6.** Quy tắc dùng AI của nhóm

### Chương 10: Kết luận (Phụ trách: TV1)
- **10.1.** Kết quả đạt được (đối chiếu mục tiêu)
- **10.2.** Hạn chế
- **10.3.** Hướng phát triển
- **Tài liệu tham khảo**

### Phụ lục (không tính vào 15–25 trang)
- **Phụ lục A:** Hướng dẫn cài đặt và chạy (trích README), tài khoản demo
- **Phụ lục B:** Toàn bộ biên bản họp và retrospective
- **Phụ lục C:** Bảng test case đầy đủ và danh sách lỗi kiểm thử chéo
- **Phụ lục D:** Đường dẫn repository, board Trello, video demo, thư mục `ai-logs/`
